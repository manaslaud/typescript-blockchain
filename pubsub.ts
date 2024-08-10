const redis = require("redis");
import { Blockchain } from "./blockchain";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

export class PubSub {
  publisher: any;
  subscriber: any;
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;

    // Use environment variables to configure Redis connection
    const redisHost = process.env.REDIS_HOST || 'localhost';
    let redisPort;
    if(process.env.REDIS_PORT){
       redisPort = parseInt(process.env.REDIS_PORT, 10);
    }
    else{
       redisPort=6379;
    }

    this.publisher = redis.createClient({
      host: redisHost,
      port: redisPort,
     
    });
    
    this.subscriber = redis.createClient({
      host: redisHost,
      port: redisPort,
    });

    this.subscriber.subscribe(CHANNELS.TEST);
    this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

    this.subscriber.on("message", (channel: string, message: string) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel: string, message: string) {
    console.log(`Message received. Channel: ${channel} Message: ${message}`);
    const parseMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parseMessage);
    }
  }

  publish(channel: string, message: string) {
    this.publisher.publish(channel, message);
  }

  broadcastChain() {
    this.publish(
      CHANNELS.BLOCKCHAIN,
      JSON.stringify(this.blockchain.chain)
    );
  }
}
