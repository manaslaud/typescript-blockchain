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


   
