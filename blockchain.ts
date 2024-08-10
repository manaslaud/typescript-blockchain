import { Block } from "./helpers/block"
import { cryptoHash } from "./hash";
export class Blockchain{
    chain:Block[];
    constructor(){
        this.chain=[Block.genesis()];
    }
     addBlock(data:string[]){
        const newBlock=Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(newBlock);
    }
    static isValidChain(chain:Block[]):boolean{
        console.log('from first line of isVAlidChain: ', JSON.stringify(chain[0])!==JSON.stringify(Block.genesis()))
        if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())) return false;
        for(let i=1;i<chain.length;i++){
            let {hash,prevHash,timestamp,data,nonce,difficulty}=chain[i];
            let lastDifficulty=chain[i-1].difficulty
            let realLastHash=chain[i-1].hash
            if(prevHash!==realLastHash) return false;
            const validatedHash=cryptoHash(timestamp,prevHash,...data,nonce,difficulty)
            console.log(hash,validatedHash)
            if(hash!==validatedHash) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }
    replaceChain(chain:Block[]){
        if(chain.length<=this.chain.length){
            console.error('Accept only longest chain');
            return;
        }
        if(!Blockchain.isValidChain(chain)){
            console.error('Invalid longest chain');
            return;
        }
        this.chain=chain;
    }
}
// const blockchain=new Blockchain()
// blockchain.addBlock(['tst'])
// blockchain.addBlock(['ts1','xwc3i'])
// blockchain.addBlock(['ts21t'])
// blockchain.addBlock(['wcni[bcuwbcwu'])


// console.log(blockchain.chain)