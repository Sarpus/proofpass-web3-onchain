import { network } from "hardhat";
import { keccak256, toBytes } from "viem";

const { viem } = await network.connect({
  network: "localhost",
});

const registry = await viem.getContractAt(
  "CertificateRegistry",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
);

const documentHash = keccak256(
  toBytes("proofpass-web3-onchain-advanced-web-development")
);

const tx = await registry.write.issueCertificate([
  "PP-2026-A8F912",
  "S. Sechilia",
  "Advanced Web Development",
  documentHash,
]);

const publicClient = await viem.getPublicClient();

await publicClient.waitForTransactionReceipt({
  hash: tx,
});

console.log("ProofPass Web3 credential issued successfully ✅");
console.log("Credential ID: PP-2026-A8F912");
console.log("Transaction:", tx);