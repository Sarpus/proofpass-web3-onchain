# ProofPass Web3 — Blockchain Workspace

Hardhat 3 + Solidity workspace for **ProofPass Web3 — Onchain Credentials**.

## Commands

```bash
npm install
npm run compile
npm run test
npm run node
npm run deploy:local
npm run issue:local
```

## Core files

- `contracts/CertificateRegistry.sol` — credential registry smart contract
- `test/CertificateRegistry.ts` — issue/verify/revoke tests
- `ignition/modules/CertificateRegistry.ts` — deployment module
- `scripts/issueCredential.ts` — local demo credential issuer
- `hardhat.config.ts` — Hardhat + Base Sepolia configuration

## Base Sepolia

The config supports the variables:

```text
BASE_SEPOLIA_RPC_URL
BASE_SEPOLIA_PRIVATE_KEY
```

Store secrets in the Hardhat keystore or environment variables. Never commit private keys.
