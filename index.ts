import { Blockchain } from "./blockchain";
import e from "express";
import bodyParser from "body-parser";
const app=e();
const blockchain=new Blockchain();
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