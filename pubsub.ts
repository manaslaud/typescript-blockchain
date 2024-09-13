import { Blockchain } from "./blockchain";

const redis = require("redis");
export const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  REQUEST_CHAIN: "REQUEST_CHAIN",
  RESPONSE_CHAIN: "RESPONSE_CHAIN",
};

export class PubSub {
  publisher: any;
  subscriber: any;
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;

    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;

    this.publisher = redis.createClient({
      host: redisHost,
      port: redisPort,
    });

    this.subscriber = redis.createClient({
      host: redisHost,
      port: redisPort,
    });

    // Handle errors
    this.publisher.on('error', (err:any) => {
      console.error('Redis Publisher Error:', err);
    });

    this.subscriber.on('error', (err:any) => {
      console.error('Redis Subscriber Error:', err);
    });

    // Set up subscriptions
    this.subscriber.on('connect', () => {
      console.log('Connected to Redis Subscriber');
      this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
      this.subscriber.subscribe(CHANNELS.REQUEST_CHAIN);
    });

    this.subscriber.on('message', (channel:string, message:string) => {
      console.log(`Received message from ${channel}: ${message}`);
      if (channel === CHANNELS.BLOCKCHAIN) {
        const receivedChain = JSON.parse(message);
        this.blockchain.replaceChain(receivedChain);
      } else if (channel === CHANNELS.REQUEST_CHAIN) {
        this.handleChainRequest(message);
      }
    });

    // Broadcast the current chain when this node starts
    this.broadcastChain();
  }

  publish(channel:string, message:string) {
    this.publisher.publish(channel, message);
  }

  broadcastChain() {
    this.publish(
      CHANNELS.BLOCKCHAIN,
      JSON.stringify(this.blockchain.chain)
    );
  }

  handleChainRequest(message:string) {
    const request = JSON.parse(message);
    if (request.type === "GET_CHAIN") {
      this.publish(
        CHANNELS.RESPONSE_CHAIN,
        JSON.stringify(this.blockchain.chain)
      );
    }
  }

  requestChain() {
    this.publish(
      CHANNELS.REQUEST_CHAIN,
      JSON.stringify({ type: "GET_CHAIN" })
    );
  }
}
