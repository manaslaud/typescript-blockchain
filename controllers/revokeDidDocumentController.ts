import { Request, Response } from 'express';
import { db } from '..';   
import { Signature } from '../did';
import { blockchain,pubSub } from '..';
import { Collection, WithId, Document } from 'mongodb';
import { Transaction } from '../did';
const importNoble = async () => {
    try {
        const { secp256k1 } = await import('@noble/curves/secp256k1');
        return secp256k1;
    } catch (error) {
        console.error('Failed to import @noble/curves/secp256k1:', error);
        throw new Error('Failed to import @noble/curves/secp256k1');
    }
};
export const revokeDidDocumentController=async(req:Request,res:Response)=>{
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
        const [publicKey,signatureR,signatureS,msgHash] = data;
        if (!publicKey || !signatureR || !signatureS || !msgHash) {
            console.error('Bad request');
            return res.status(400).json({message:'Invalid Params'});
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
        const collectionA: Collection = db.collection('Admin pkeys');
        const allDocs: WithId<Document>[] = await collectionA.find().toArray();
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
        const collection=db.collection('Blocks')
        const query={
            'publicKey.publicKey':publicKey
        }

        const document=await collection.updateOne(query,{
            $set:{isValid:false}
        })
        if(document.modifiedCount===0) return res.status(400).json({message:'Cannot find any DID with given public key, or already revoked'})
        else {
            const transaction = new Transaction(signature, fullUrl, new Date(),publicKey,null);
            console.log('Created transaction:', transaction);
            blockchain.addBlock([JSON.stringify(transaction)]);
            pubSub.broadcastChain();
            return res.status(200).json({message:'Successfully revoked given DID/public key'})
        }        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server Error"})
    }
}