# Typescript Blockchain

## Table of Contents
- [Overview](#overview)
- [Blockchain Project](#blockchain-project)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Setup](#setup)
  - [Features](#features-1)
  - [Technologies Used](#technologies-used-1)

## Overview
1. A TypeScript implementation of a Proof-of-Work (PoW) based blockchain.
2. Use this as a service for handling DID-based authentication, integrate with a wallet.

## Blockchain Project

### Features
- Each container is deployed on individual machines or can be deployued on the same machine and configured to different ports to work as an individual node
- Developed from scratch using TypeScript.
- Implements a Proof-of-Work (PoW) consensus mechanism.
- Utilizes Docker and Docker Compose for multi-stage builds.
- Employs Redis Pub/Sub for inter-node communication, enabling a decentralized network.

### Technologies Used
- TypeScript
- Docker
- Docker Compose
- Redis Pub/Sub

### Setup
Follow these steps to set up and run the blockchain project:

1. **Clone the repository and navigate to the blockchain project directory:**
   ```bash
   git clone https://github.com/manaslaud/typescript-blockchain
   
2. **Build and run the docker container**
   ```bash
   docker-compose up --build

### Workflow
1. User Registration

    User Submits a Registration Request
        The user fills out a registration form and submits it to the backend server.
        The request includes user details required for registration.

    Admin Approves the Request and Assigns an Initial Role
        An admin reviews the registration request in an admin panel or interface.
        Upon approval, the admin assigns an initial role (e.g., "Editor") to the user.
        The admin's action triggers the creation of a DID for the user.

    DID Creation and Storage
        The backend generates a DID Document based on the approved registration details.
        This DID Document includes user identification details and public keys.
        The DID Document is then created and stored on the blockchain, ensuring it’s immutable and verifiable.

2. User Login

    User Requests to Log In
        The user attempts to log in by sending a login request to the backend server.

    Server Generates a Challenge
        The server generates a challenge (a random string or token) and sends it to the user. This challenge is used to verify the user's identity.

    User Signs the Challenge
        The user signs the challenge using their private key.
        The signed challenge is sent back to the server.

    Server Verifies the Signature
        The server retrieves the user’s public key from the DID Document stored on the blockchain.
        The server verifies the signed challenge using the public key.
        If the verification is successful, the user is authenticated.

    Cleanup
        The challenge is removed from temporary storage or invalidated after successful verification or expiration.

3. Role Assignment

    Admin Assigns a Role
        The admin assigns a specific role (e.g., "Editor") to the user in the backend system.
        This role assignment is stored in the backend database, not on the blockchain.

4. Role Update

    Admin Promotes the User
        The admin decides to promote the user to a new role (e.g., "Manager").
        A role update request is processed by the backend system.

    Database or Ledger Update
        The backend database is updated to reflect the new role.
        This update is specific to the backend and does not affect the DID or blockchain.

5. User Login with Role Verification

    User Logs In
        The user logs in as described in the login workflow.

    Server Retrieves Role and Permissions
        Upon successful login, the server retrieves the user’s role and permissions from the backend database.

    Access Control
        Access to resources is granted or denied based on the user’s role and permissions.

6. Role Verification

    User Attempts an Action
        The user attempts to perform an action, such as editing a document.

    Server Checks Role and Permissions
        The server verifies the user’s role and permissions before allowing the action.
        The system checks the user’s current role stored in the backend database.


   
