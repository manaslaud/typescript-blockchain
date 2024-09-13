import { Request, Response } from 'express';
import { DidDocument, Signature, Transaction ,Did, PublicKey} from '../did';  
import { db } from '..';          
import { Collection, WithId, Document } from 'mongodb';
import { blockchain,pubSub } from '..';
import { cryptoHash } from '../hash';
const importNoble = async () => {
    try {
        const { secp256k1 } = await import('@noble/curves/secp256k1');
        return secp256k1;
    } catch (error) {
        console.error('Failed to import @noble/curves/secp256k1:', error);
        throw new Error('Failed to import @noble/curves/secp256k1');
    }
};

export const createDidDocumentController = async (req: Request, res: Response) => {
    try {
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        let { data } = req.body; 
        if (Array.isArray(data)) {
            data = data.map(item => {
                if (/^\d+n$/.test(item)) { // Check if the string represents a BigInt
                    return BigInt(item);
                }
                return item;
            });
        } else {
            return res.status(400).json({message:'Data must be an array of strings'});
        }
        console.log(data)
        const [signatureR, signatureS, msgHash,isNewUser,publicKey,publicKeyType] = data;
        const doesDidExist:Document|null=await db.collection('Blocks').findOne({'publicKey.publicKey':publicKey})
        console.log(doesDidExist)
        if(doesDidExist) return res.status(400).json({message:'Did alrady exists for given public key'})
        if (!signatureR || !signatureS || !msgHash || !publicKey || !isNewUser) {
            return res.status(400).json({message:'Signature, Message Hash and isNewUSer required'});
        }

        const secp256k1 = await importNoble();
        if (!secp256k1) {
            console.error('Failed to import secp256k1');
            return res.status(500).json({message:'Error importing @noble/curves/secp256k1'});
        }
        const signature: Signature = {
            r: String(signatureR),
            s: String(signatureS),
        };
        const collection: Collection = db.collection('Admin pkeys');
        const allDocs: WithId<Document>[] = await collection.find().toArray();
        // Verify the signature
        let isValidSignature = false;
        for (const document of allDocs) {
            console.log('Verifying signature with document:', document);
            const currValidity = secp256k1.verify({
                r:BigInt(signatureR),
                s:BigInt(signatureS)
            }, msgHash, document.pkey);
            if (currValidity) isValidSignature = true;
        }
        if (!isValidSignature) {
            console.error('Signature verification failed');
            return res.status(401).json({message:'Signature verification failed'})
        }
        let didDocument:DidDocument|null=null;
        let did:Did|null=null;
        if(isNewUser=='true'){
            did=new Did('did','auth',cryptoHash([publicKey]))
            let pk=new PublicKey(publicKeyType,publicKey)
            didDocument=new DidDocument(did,pk,new Date(),true)
            const collection=db.collection('Blocks')
            collection.insertOne(didDocument)
            console.log(did)
        }
        const transaction = new Transaction(signature, fullUrl, new Date(),publicKey,did);
        console.log('Created transaction:', transaction);

        blockchain.addBlock([JSON.stringify(transaction)]);
        pubSub.broadcastChain();
        
        res.status(200).send(transaction);
    } catch (error: any) {
        console.error('Error in mineController:', error);
        res.status(500).json({message:'Internal Server Error'});
    }
};
//transaction added in 1 block, if transaction was a creation for user (create a DID), transaction also contains didCreation, associated public key of the user
//if the task was for didCreation then create a DID, store it on mongoDB, store transaction on chain