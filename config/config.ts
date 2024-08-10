import { Block } from "../helpers/block"
export const difficulty=2;
export const mine_rate=1000;
export const GENESIS:Block={
    timestamp:'1',
    prevHash:'0x000',
    hash:'0x123',
    data:[],
    nonce:0,
    difficulty:difficulty
}
