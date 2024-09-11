import { Router } from 'express';
import { mineController } from '../controllers/mineController';
import { blockchain } from '..';
const router = Router();

router.post('/mine', mineController);
router.get('/getAllBlocks', (req,res)=>{
    res.json(blockchain.chain)
    });

export default router;
