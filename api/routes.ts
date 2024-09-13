import { Router } from 'express';
import { createDidDocumentController } from '../controllers/createDidDocumentController';
import { revokeDidDocumentController } from '../controllers/revokeDidDocumentController';
import { blockchain } from '..';
const router = Router();

router.post('/createDidDocument', createDidDocumentController);
router.post('/revokeDidDocument', revokeDidDocumentController);

router.get('/getAllBlocks', (req,res)=>{
    res.json(blockchain.chain)
    });

export default router;
