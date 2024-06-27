import { createClient } from "redis";
import { Blockchain } from "./blockchain";
import { Block } from "./block";
const CHANNELS = {
  TEST: "TEST",
  PROD:'PROD'
};
export class PubSub {
  publisher;
  subscriber;
  blockchain
  constructor(blockchain:Blockchain) {
    this.publisher = createClient();
    this.subscriber = createClient();
    this.blockchain=blockchain;

    this.publisher.connect().then(() => {
      console.log("Publisher connected");
    }).catch((error) => {
      console.error("Publisher connection error:", error);
    });

    this.subscriber.connect().then(() => {
      console.log("Subscriber connected");
      this.subscriber.subscribe(CHANNELS.TEST, (message,channel)=>this.handleMessage(message,channel));
    }).catch((error) => {
      console.error("Subscriber connection error:", error);
    });
  }
  handleMessage(message:string,channel:string){
    console.log(message)
    const parseMessage:Block[]=JSON.parse(message)
    if(channel==='PROD'){
        this.blockchain.replaceChain(parseMessage)
    }
  }
  publish(message:string,channel:string){
    this.publisher.publish(message,channel)
  }
  broadcastChain(){
    this.publish(JSON.stringify(this.blockchain.chain),CHANNELS.PROD)
  }
}
