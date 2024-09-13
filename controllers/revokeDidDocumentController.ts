import { Request, Response } from 'express';
import { db } from '..';          
export const revokeDidDocumentController=async(req:Request,res:Response)=>{
    try {
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
        const [publicKey] = data;
        const collection=db.collection('Blocks')
        const query={
            'publicKey.publicKey':publicKey
        }

        const document=await collection.updateOne(query,{
            $set:{isValid:false}
        })
        if(document.modifiedCount===0) return res.status(400).json({message:'Cannot find any DID with given public key'})
        else res.status(200).json({message:'Successfully revoked given DID/public key'})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server Error"})
    }
}