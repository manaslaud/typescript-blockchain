import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import apiRoutes from './api/routes';
import { Blockchain } from './blockchain';
import { connectToDatabase } from './db';
import { PubSub } from './pubsub';
import { Db } from 'mongodb';
import { CHANNELS } from './pubsub';
dotenv.config();

export const blockchain:Blockchain = new Blockchain();
export const pubSub:PubSub=new PubSub(blockchain)
pubSub.requestChain();
pubSub.subscriber.on('message', (channel:string, message:string) => {
    if (channel === CHANNELS.RESPONSE_CHAIN) {
      const receivedChain = JSON.parse(message);
      blockchain.replaceChain(receivedChain);
    }
  });
let db: Db;

async function main() {
    const app = express();

    try {
        db = await connectToDatabase();
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }

    app.use(bodyParser.json());
    app.use('/api', apiRoutes);

    const PORT = process.env.EXPRESS_PORT || 3000;
    if (process.env.GENERATE_PEER_PORT === 'true') {
        app.listen(3005, () => {
            console.log('Listening on port 3005');
        });
    } else {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    }
}

main();

export { db };
