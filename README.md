# ProofPass Web3 — Onchain Credentials

A full-stack Web3 credential verification project built with **Next.js 16**, **TypeScript**, **Solidity**, **Hardhat 3**, and **viem**.

ProofPass lets an authorized issuer create a credential record, store its cryptographic proof in a smart contract, verify it publicly by credential ID, and revoke it when necessary.

## Current project status

- Premium ProofPass frontend ✅
- Credential verification flow ✅
- Solidity `CertificateRegistry` ✅
- Hardhat compile + tests ✅
- Local Hardhat deployment ✅
- Demo credential issuance ✅
- Frontend onchain reads ✅
- Wallet-powered issuer dashboard ✅
- Base Sepolia deployment ⏳

## Project structure

```text
proofpass-web3-onchain/
├─ src/                         # Next.js frontend
│  ├─ app/
│  ├─ components/
│  └─ lib/proofpassContract.ts
├─ blockchain/                  # Solidity + Hardhat workspace
│  ├─ contracts/CertificateRegistry.sol
│  ├─ ignition/modules/CertificateRegistry.ts
│  ├─ scripts/issueCredential.ts
│  └─ test/CertificateRegistry.ts
├─ .env.example
└─ package.json
```

## Local development

Start from a fresh local Hardhat node when using the default contract address in `.env.example`.

Install frontend dependencies:

```bash
npm install
```

Install blockchain dependencies:

```bash
cd blockchain
npm install
cd ..
```

Run the local blockchain in terminal 1:

```bash
npm run blockchain:node
```

Deploy the registry in terminal 2:

```bash
npm run blockchain:deploy:local
```

Issue the demo credential:

```bash
npm run blockchain:issue:local
```

Run the web app in terminal 3:

```bash
npm run dev
```

Open `http://localhost:3000` and verify:

```text
PP-2026-A8F912
```

## Smart-contract capabilities

`CertificateRegistry.sol` supports:

- `authorizeIssuer(address)`
- `removeIssuer(address)`
- `issueCertificate(...)`
- `verifyCertificate(string)`
- `getCertificate(string)`
- `revokeCertificate(string)`

## Local contract

The default local deployment address is configured as:

```text
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

The frontend can override the RPC URL, network label, and contract address through `.env.local`. Copy `.env.example` if you need custom values.

## Security

Never commit or share a wallet private key, seed phrase, or Hardhat keystore password. Testnet/mainnet deployment secrets should stay outside the repository.

## Next milestone

Build the **Issuer Dashboard + Connect Wallet** flow so authorized institutions can issue and revoke credentials directly from the web interface.
