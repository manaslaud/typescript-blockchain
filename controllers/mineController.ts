import { Request, Response } from 'express';
import { Blockchain } from '../blockchain';
import { PubSub } from '../pubsub';

export const mineBlock = (req: Request, res: Response) => {
    const blockchain = new Blockchain();
    const pubsub = new PubSub(blockchain);
    const { data } = req.body;
    blockchain.addBlock(data);
    pubsub.broadcastChain();
    res.redirect('/api/getAllBlocks');
};
