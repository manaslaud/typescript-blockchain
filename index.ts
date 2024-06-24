import { GENESIS } from "./config";
import { cryptoHash } from "./hash";
export class Block{
    timestamp:string;
    prevHash:string;
    hash:string;
    data:string[];
    constructor(timestamp:string,prevHash:string,hash:string,data:string[]){
        this.timestamp=timestamp;
        this.hash=hash;
        this.prevHash=prevHash;
        this.data=data;
    }
    static genesis(){
        return new this(GENESIS.timestamp,GENESIS.prevHash,GENESIS.hash,GENESIS.data)
    }
    static mineBlock(prevBlock:Block,data:string[]){
        const timestamp:string=Date.now().toString();
        const prevHash:string=prevBlock.hash.toString();
        return new this(timestamp,prevHash,cryptoHash(timestamp,prevHash,data),data)
    }
}
const genesisBlock:Block=Block.genesis();
const result:Block=Block.mineBlock(genesisBlock,['a','c'])
console.log(result)