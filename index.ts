import { Blockchain } from "./blockchain";
import e from "express";
import bodyParser from "body-parser";
import { PubSub } from "./pubsub";
const app=e();
const blockchain=new Blockchain();
const pubsub=new PubSub(blockchain)
setTimeout(()=>{pubsub.broadcastChain()},1000)
app.use(bodyParser.json())
app.get('/api/getAllBlocks',(req,res)=>{
res.json(blockchain.chain)
console.log(req)
})

app.post('/api/mine',(req,res)=>{
const {data}=req.body
blockchain.addBlock(data);
res.redirect('/api/getAllBlocks')
})
const PORT=3000;
app.listen(PORT,()=>{console.log('listening on port : '+PORT)})