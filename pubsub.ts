const redis = require("redis");
import { Blockchain } from "./blockchain";
const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};
export class PubSub {
  publisher;
  subscriber
  blockchain;
  constructor( blockchain:Blockchain ) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(CHANNELS.TEST);
    this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

    this.subscriber.on("message", (channel:string, message:string) =>
      this.handleMessage(channel, message)
    );
  }
  handleMessage(channel:string, message:string) {
    console.log(`Message recieved.Channel: ${channel} Message:${message}`);
    const parseMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parseMessage);
    }
  }
  publish(channel:string, message:string) {
    this.publisher.publish(channel, message);
  }
  broadcastChain() {
    this.publish(
     CHANNELS.BLOCKCHAIN,
    JSON.stringify(this.blockchain.chain),
    );
  }
}
