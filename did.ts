import { cryptoHash } from "./hash"                                 
class Did{
    scheme:string
    method:string
    methodSpecificId:string
    constructor(scheme:string,method:string,methodSpecificId:string){
        this.scheme=scheme
        this.method=method
        this.methodSpecificId=methodSpecificId
    }
    static createDid(pkey:PublicKey){
        const pkHash:string=cryptoHash(pkey.id,pkey.publicKey)
        const did= new Did('did','csi',pkHash)
    }
}
class PublicKey {
    id: string;
    type: string;
    publicKey: string;

    constructor(id: string, type: string, publicKey: string) {
        this.id = id;
        this.type = type;
        this.publicKey = publicKey;
    }
}
class Authentication {
    type: string;
    publicKey: PublicKey;

    constructor(type: string, publicKey: PublicKey) {
        this.type = type;
        this.publicKey = publicKey;
    }
}
class ServiceEndpoint {
    id: string;
    type: string;
    serviceURL: string;

    constructor(id: string, type: string, serviceURL: string) {
        this.id = id;
        this.type = type;
        this.serviceURL = serviceURL;
    }
}


class DidDocument {
    did: Did;
    publicKey: PublicKey;
    authentication: Authentication;
    services: ServiceEndpoint[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        did: Did,
        publicKey: PublicKey,
        authentication: Authentication,
        services: ServiceEndpoint[],
        createdAt: Date,
        updatedAt: Date
    ) {
        this.did = did;
        this.publicKey = publicKey;
        this.authentication = authentication;
        this.services = services;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
}
