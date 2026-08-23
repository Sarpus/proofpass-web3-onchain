import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { keccak256, toBytes } from "viem";

describe("CertificateRegistry", async function () {
  const { viem } = await network.connect();

  const publicClient = await viem.getPublicClient();

  const credentialId = "PP-2026-A8F912";
  const recipient = "S. Sechilia";
  const certificateName = "Advanced Web Development";

  const documentHash = keccak256(
    toBytes("proofpass-certificate-demo")
  );

  // =========================
  // DEPLOYMENT
  // =========================

  it("sets deployer as owner and authorized issuer", async function () {
    const registry = await viem.deployContract(
      "CertificateRegistry"
    );

    const [owner] = await viem.getWalletClients();

    const contractOwner = await registry.read.owner();

    const isAuthorized =
      await registry.read.authorizedIssuers([
        owner.account.address,
      ]);

    assert.equal(
      contractOwner.toLowerCase(),
      owner.account.address.toLowerCase()
    );

    assert.equal(isAuthorized, true);
  });

  // =========================
  // ISSUE + VERIFY
  // =========================

  it("issues and verifies a credential", async function () {
    const registry = await viem.deployContract(
      "CertificateRegistry"
    );

    const transactionHash =
      await registry.write.issueCertificate([
        credentialId,
        recipient,
        certificateName,
        documentHash,
      ]);

    await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });

    const result =
      await registry.read.verifyCertificate([
        credentialId,
      ]);

    const [exists, valid, revoked] = result;

    assert.equal(exists, true);
    assert.equal(valid, true);
    assert.equal(revoked, false);

    const certificate =
      await registry.read.getCertificate([
        credentialId,
      ]);

    assert.equal(
      certificate.credentialId,
      credentialId
    );

    assert.equal(
      certificate.recipient,
      recipient
    );

    assert.equal(
      certificate.certificateName,
      certificateName
    );

    assert.equal(
      certificate.documentHash,
      documentHash
    );

    assert.equal(
      certificate.revoked,
      false
    );
  });

  // =========================
  // UNKNOWN CREDENTIAL
  // =========================

  it("returns invalid for unknown credential", async function () {
    const registry = await viem.deployContract(
      "CertificateRegistry"
    );

    const result =
      await registry.read.verifyCertificate([
        "PP-DOES-NOT-EXIST",
      ]);

    const [exists, valid, revoked] = result;

    assert.equal(exists, false);
    assert.equal(valid, false);
    assert.equal(revoked, false);
  });

  // =========================
  // REVOKE
  // =========================

  it("can revoke an issued credential", async function () {
    const registry = await viem.deployContract(
      "CertificateRegistry"
    );

    const issueTx =
      await registry.write.issueCertificate([
        credentialId,
        recipient,
        certificateName,
        documentHash,
      ]);

    await publicClient.waitForTransactionReceipt({
      hash: issueTx,
    });

    const revokeTx =
      await registry.write.revokeCertificate([
        credentialId,
      ]);

    await publicClient.waitForTransactionReceipt({
      hash: revokeTx,
    });

    const result =
      await registry.read.verifyCertificate([
        credentialId,
      ]);

    const [exists, valid, revoked] = result;

    assert.equal(exists, true);
    assert.equal(valid, false);
    assert.equal(revoked, true);
  });

  // =========================
  // DUPLICATE
  // =========================

  it("rejects duplicate credential IDs", async function () {
    const registry = await viem.deployContract(
      "CertificateRegistry"
    );

    const transactionHash =
      await registry.write.issueCertificate([
        credentialId,
        recipient,
        certificateName,
        documentHash,
      ]);

    await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });

    await assert.rejects(async () => {
      await registry.write.issueCertificate([
        credentialId,
        recipient,
        certificateName,
        documentHash,
      ]);
    });
  });
});