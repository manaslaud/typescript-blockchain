import { GENESIS, mine_rate } from "../config/config";
import hexToBinary from "hex-to-binary";
import { cryptoHash } from "../hash";
export class Block{
    timestamp:string;
    prevHash:string;
    hash:string;
    data:string[];
    nonce:number;
    difficulty:number;
    constructor(timestamp:string,prevHash:string,hash:string,data:string[],nonce:number,difficulty:number){
        this.timestamp=timestamp;
        this.hash=hash;
        this.prevHash=prevHash;
        this.data=data;
        this.nonce=nonce;
        this.difficulty=difficulty;
    }
    static genesis(){
        return new this(GENESIS.timestamp,GENESIS.prevHash,GENESIS.hash,GENESIS.data,GENESIS.nonce,GENESIS.difficulty)
    }
    static mineBlock(prevBlock:Block,data:string[]){
        let hash,timestamp;
        let {difficulty}=prevBlock
        const prevHash:string=prevBlock.hash.toString();
        let nonce=0;
        do{
            nonce++;
            timestamp=Date.now().toString();
            difficulty=Block.adjustDifficulty(prevBlock,timestamp)
            hash=cryptoHash(timestamp,prevHash,...data,nonce,difficulty)
        }while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty))
        return new this(timestamp,prevHash,hash,data,nonce,difficulty)
    }
    static adjustDifficulty(originalBlock:Block,timestamp:string):number{
        const {difficulty}=originalBlock;
        const difference=Number(timestamp)- Number(originalBlock.timestamp);
        if(difficulty<1) return difficulty+1;
        if(difference>mine_rate) return difficulty-1;
        return difficulty+1;
    }
}
// const genesisBlock:Block=Block.genesis();
// const result:Block=Block.mineBlock(genesisBlock,['a','c'])
// console.log(result)