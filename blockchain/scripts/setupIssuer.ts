import hre from "hardhat";

const WALLET_ADDRESS =
  "0xba9F8A57B71E9eD396D959614e1f7528841F2ED4";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const { viem, networkHelpers } =
  await hre.network.connect({
    network: "localhost",
  });

// kasih 10 ETH lokal ke wallet MetaMask
await networkHelpers.setBalance(
  WALLET_ADDRESS,
  10n * 10n ** 18n
);

const [owner] =
  await viem.getWalletClients();

const registry =
  await viem.getContractAt(
    "CertificateRegistry",
    CONTRACT_ADDRESS,
    {
      client: {
        wallet: owner,
      },
    }
  );

const tx =
  await registry.write.authorizeIssuer([
    WALLET_ADDRESS,
  ]);

const publicClient =
  await viem.getPublicClient();

await publicClient.waitForTransactionReceipt({
  hash: tx,
});

console.log("✅ Dev wallet funded with 10 local ETH");
console.log("✅ Wallet authorized as ProofPass issuer");
console.log("Wallet:", WALLET_ADDRESS);