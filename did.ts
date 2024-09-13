import { sign } from "crypto";
import { cryptoHash } from "./hash"
export class Did{
    scheme:string
    method:string
    methodSpecificId:string
    constructor(scheme:string,method:string,methodSpecificId:string){
        this.scheme=scheme
        this.method=method
        this.methodSpecificId=methodSpecificId
    }
    static createMid(pkey:PublicKey){
        const Mid:string=cryptoHash(pkey.publicKey)
        return Mid
    }
}
export class PublicKey {
    type: string;
    publicKey: string;

    constructor(type: string, publicKey: string) {
        this.type = type;
        this.publicKey = publicKey;
    }
}
// export class Authentication {
//     type: string;
//     publicKey: PublicKey;

//     constructor(type: string, publicKey: PublicKey) {
//         this.type = type;
//         this.publicKey = publicKey;
//     }
// }
// export class ServiceEndpoint {
//     id: string;
//     type: string;
//     serviceURL: string;

//     constructor(id: string, type: string, serviceURL: string) {
//         this.id = id;
//         this.type = type;
//         this.serviceURL = serviceURL;
//     }
// }


export class DidDocument {
    did: Did;
    publicKey: PublicKey;
    // authentication: Authentication;
    // services?: ServiceEndpoint[];
    createdAt: Date;
    isValid:boolean

    constructor(
        did: Did,
        publicKey: PublicKey,
        // authentication: Authentication,
        createdAt: Date,
        isValid:boolean
        // services?: ServiceEndpoint[]
    ) {
        this.did = did;
        this.publicKey = publicKey;
        this.isValid=isValid
        // this.authentication = authentication;
        // this.services = services;
        this.createdAt = createdAt;
    }
    
}
export class Signature{
    r:string
    s:string
    constructor(r:string,s:string){
        this.r=r
        this.s=s
    }
}
export class Transaction{
    signature:Signature
    createdAt:Date
    did:Did|null
    publicKey:string
    createdBy:string
    constructor(signature:Signature,createdBy:string,createdAt:Date,publicKey:string,did:Did|null){
        this.signature=signature
        this.createdAt=createdAt
        this.publicKey=publicKey
        this.createdBy=createdBy
        this.did=did || null
    }
}