import { Blockchain } from "./blockchain";
import e from "express";
import bodyParser from "body-parser";
import { Db } from "mongodb";
import { PubSub } from "./pubsub";
import dotenv from 'dotenv'; 
import { connectToDatabase } from "./db";
async function main(){
    dotenv.config();  
    const app=e();
    const blockchain=new Blockchain();
    const pubsub=new PubSub(blockchain)
    const db:Db=await connectToDatabase()
    setTimeout(()=>{pubsub.broadcastChain()},1000)
    app.use(bodyParser.json())
    app.get('/api/getAllBlocks',(req,res)=>{
    res.json(blockchain.chain)
    })
    
    app.post('/api/mine',(req,res)=>{
    const {data}=req.body
    blockchain.addBlock(data);
    pubsub.broadcastChain();
    res.redirect('/api/getAllBlocks')
    })
    const PORT=process.env.EXPRESS_PORT;
    if(process.env.GENERATE_PEER_PORT==='true'){
        app.listen(3005,()=>{console.log('listening on port : '+3005)})
    }
    else{
        app.listen(PORT,()=>{console.log('listening on port : '+PORT)})
    }
    
}
main()