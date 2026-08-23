"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createWalletClient,
  custom,
  keccak256,
  toBytes,
  type Address,
} from "viem";
import { foundry } from "viem/chains";

import {
  PROOFPASS_CONTRACT_ADDRESS,
  proofPassAbi,
  proofPassClient,
} from "@/lib/proofpassContract";

type Eip1193Provider = {
  isMetaMask?: boolean;
  providers?: Eip1193Provider[];
  request: (args: {
    method: string;
    params?: readonly unknown[] | object;
  }) => Promise<unknown>;
};

function getMetaMaskProvider(): Eip1193Provider | null {
  if (typeof window === "undefined") return null;

  const injected = (
    window as unknown as {
      ethereum?: Eip1193Provider;
    }
  ).ethereum;

  if (!injected) return null;

  if (Array.isArray(injected.providers)) {
    const metamask = injected.providers.find(
      (provider) => provider.isMetaMask
    );

    if (metamask) return metamask;
  }

  if (injected.isMetaMask) return injected;

  return null;
}

function getErrorCode(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    return Number(
      (error as { code?: number | string }).code
    );
  }

  return undefined;
}

export default function IssuerPage() {
  const [account, setAccount] =
    useState<Address | null>(null);

  const [authorized, setAuthorized] =
    useState(false);

  const [credentialId, setCredentialId] =
    useState("");

  const [recipient, setRecipient] =
    useState("");

  const [certificateName, setCertificateName] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [issuedId, setIssuedId] =
    useState("");

  const [revokeId, setRevokeId] =
    useState("");

  const [revokeStatus, setRevokeStatus] =
    useState("");

  const [revoking, setRevoking] =
    useState(false);

  const shortAccount = useMemo(() => {
    if (!account) return "";

    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  }, [account]);

  async function checkAuthorization(address: Address) {
    try {
      const isAuthorized =
        await proofPassClient.readContract({
          address: PROOFPASS_CONTRACT_ADDRESS,
          abi: proofPassAbi,
          functionName: "authorizedIssuers",
          args: [address],
        });

      setAccount(address);
      setAuthorized(isAuthorized);

      setStatus(
        isAuthorized
          ? "Wallet connected · Authorized issuer ✓"
          : "Wallet connected · Wallet belum authorized"
      );
    } catch (error) {
      console.error("AUTHORIZATION CHECK ERROR:", error);

      setAuthorized(false);

      setStatus(
        "Wallet terhubung, tetapi status issuer tidak dapat dibaca. Pastikan Hardhat node masih hidup."
      );
    }
  }

  async function ensureHardhatNetwork(
    provider: Eip1193Provider
  ) {
    const HARDHAT_CHAIN_ID = "0x7a69";

    let chainId = String(
      await provider.request({
        method: "eth_chainId",
      })
    ).toLowerCase();

    if (chainId === HARDHAT_CHAIN_ID) {
      return true;
    }

    setStatus("Switching MetaMask to Hardhat Local...");

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: HARDHAT_CHAIN_ID,
          },
        ],
      });
    } catch (error) {
      const code = getErrorCode(error);

      if (code !== 4902) {
        console.error("SWITCH NETWORK ERROR:", error);

        setStatus(
          "Pilih network Hardhat Local di MetaMask, lalu coba lagi."
        );

        return false;
      }

      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: HARDHAT_CHAIN_ID,
            chainName: "Hardhat Local",
            nativeCurrency: {
              name: "Local ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [
              "http://127.0.0.1:8545",
            ],
          },
        ],
      });
    }

    chainId = String(
      await provider.request({
        method: "eth_chainId",
      })
    ).toLowerCase();

    if (chainId !== HARDHAT_CHAIN_ID) {
      setStatus(
        `Network belum benar. Chain ID yang dibaca: ${chainId}.`
      );

      return false;
    }

    return true;
  }

  useEffect(() => {
    async function restoreWallet() {
      const provider = getMetaMaskProvider();

      if (!provider) return;

      try {
        const chainId = String(
          await provider.request({
            method: "eth_chainId",
          })
        ).toLowerCase();

        if (chainId !== "0x7a69") return;

        const accounts =
          (await provider.request({
            method: "eth_accounts",
          })) as Address[];

        const address = accounts[0];

        if (!address) return;

        await checkAuthorization(address);
      } catch (error) {
        console.error("RESTORE WALLET ERROR:", error);
      }
    }

    void restoreWallet();
  }, []);

  async function connectWallet() {
    try {
      setStatus("Connecting to MetaMask...");

      const provider = getMetaMaskProvider();

      if (!provider) {
        setStatus(
          "MetaMask tidak terdeteksi. Pastikan extension MetaMask aktif."
        );
        return;
      }

      const networkReady =
        await ensureHardhatNetwork(provider);

      if (!networkReady) {
        setAccount(null);
        setAuthorized(false);
        return;
      }

      const accounts =
        (await provider.request({
          method: "eth_requestAccounts",
        })) as Address[];

      const address = accounts[0];

      if (!address) {
        setStatus(
          "Tidak ada account MetaMask yang dipilih."
        );
        return;
      }

      await checkAuthorization(address);
    } catch (error) {
      console.error("CONNECT WALLET ERROR:", error);

      setAccount(null);
      setAuthorized(false);

      setStatus(
        "Gagal menghubungkan MetaMask. Pastikan Hardhat node masih hidup."
      );
    }
  }

  async function issueCredential(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const provider = getMetaMaskProvider();

    if (!provider) {
      setStatus("MetaMask tidak terdeteksi.");
      return;
    }

    if (!account) {
      setStatus(
        "Klik CONNECT WALLET terlebih dahulu."
      );
      return;
    }

    if (!authorized) {
      setStatus(
        "Wallet ini bukan authorized issuer."
      );
      return;
    }

    const normalizedCredentialId =
      credentialId.trim().toUpperCase();

    const cleanRecipient =
      recipient.trim();

    const cleanCertificateName =
      certificateName.trim();

    if (
      !normalizedCredentialId ||
      !cleanRecipient ||
      !cleanCertificateName
    ) {
      setStatus(
        "Lengkapi semua data credential."
      );
      return;
    }

    try {
      setLoading(true);
      setIssuedId("");

      const networkReady =
        await ensureHardhatNetwork(provider);

      if (!networkReady) return;

      setStatus(
        "Menunggu konfirmasi MetaMask..."
      );

      const walletClient =
        createWalletClient({
          account,
          chain: foundry,
          transport: custom(provider as any),
        });

      const documentHash =
        keccak256(
          toBytes(
            `${normalizedCredentialId}|${cleanRecipient}|${cleanCertificateName}`
          )
        );

      const hash =
        await walletClient.writeContract({
          address: PROOFPASS_CONTRACT_ADDRESS,
          abi: proofPassAbi,
          functionName: "issueCertificate",
          args: [
            normalizedCredentialId,
            cleanRecipient,
            cleanCertificateName,
            documentHash,
          ],
        });

      setStatus(
        "Transaction submitted · waiting for confirmation..."
      );

      await proofPassClient.waitForTransactionReceipt({
        hash,
      });

      setIssuedId(normalizedCredentialId);

      setStatus(
        "Credential issued on-chain ✓"
      );

      setCredentialId("");
      setRecipient("");
      setCertificateName("");
    } catch (error) {
      console.error("ISSUE CREDENTIAL ERROR:", error);

      setStatus(
        "Issue gagal. Cek apakah ID sudah dipakai, wallet authorized, dan Hardhat node masih hidup."
      );
    } finally {
      setLoading(false);
    }
  }

  async function revokeCredential(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const provider = getMetaMaskProvider();

    if (!provider) {
      setRevokeStatus(
        "MetaMask tidak terdeteksi."
      );
      return;
    }

    if (!account) {
      setRevokeStatus(
        "Klik CONNECT WALLET terlebih dahulu."
      );
      return;
    }

    if (!authorized) {
      setRevokeStatus(
        "Wallet ini bukan authorized issuer."
      );
      return;
    }

    const normalizedRevokeId =
      revokeId.trim().toUpperCase();

    if (!normalizedRevokeId) {
      setRevokeStatus(
        "Masukkan Credential ID yang ingin direvoke."
      );
      return;
    }

    try {
      setRevoking(true);

      const networkReady =
        await ensureHardhatNetwork(provider);

      if (!networkReady) return;

      setRevokeStatus(
        "Menunggu konfirmasi MetaMask..."
      );

      const walletClient =
        createWalletClient({
          account,
          chain: foundry,
          transport: custom(provider as any),
        });

      const hash =
        await walletClient.writeContract({
          address: PROOFPASS_CONTRACT_ADDRESS,
          abi: proofPassAbi,
          functionName: "revokeCertificate",
          args: [normalizedRevokeId],
        });

      setRevokeStatus(
        "Transaction submitted · waiting for confirmation..."
      );

      await proofPassClient.waitForTransactionReceipt({
        hash,
      });

      setRevokeStatus(
        `Credential ${normalizedRevokeId} revoked on-chain ✓`
      );

      setRevokeId("");
    } catch (error) {
      console.error("REVOKE CREDENTIAL ERROR:", error);

      setRevokeStatus(
        "Revoke gagal. Pastikan ID ada, belum direvoke, dan wallet berhak."
      );
    } finally {
      setRevoking(false);
    }
  }

  return (
    <main className="pp-issuer-page">
      <div className="pp-issuer-grid" />

      <nav className="pp-result-nav">
        <a
          href="/"
          className="pp-result-brand"
        >
          PROOFPASS<span>®</span>
        </a>

        <div className="pp-result-nav-meta">
          <span>ISSUER CONSOLE</span>
          <span>HARDHAT / 31337</span>
        </div>

        <a
          href="/"
          className="pp-result-back"
        >
          ← BACK HOME
        </a>
      </nav>

      <section className="pp-issuer-shell pp-issuer-shell-final">
        <aside className="pp-issuer-intro pp-issuer-intro-final">
          <div className="pp-issuer-eyebrow">
            <span>04 / ISSUER</span>
            <i />
            SMART CONTRACT CONSOLE
          </div>

          <h1>
            Issue proof.
            <br />
            <em>Control trust.</em>
          </h1>

          <p className="pp-issuer-description">
            Create and manage verifiable credentials
            through the ProofPass smart contract.
            Every action is signed through MetaMask.
          </p>

          <div className="pp-wallet-console">
            <div className="pp-wallet-console-top">
              <span>WALLET</span>

              <span
                className={
                  authorized
                    ? "pp-wallet-live"
                    : "pp-wallet-idle"
                }
              >
                ● {authorized ? "AUTHORIZED" : "NOT CONNECTED"}
              </span>
            </div>

            <button
              className="pp-issuer-wallet pp-issuer-wallet-final"
              onClick={connectWallet}
              type="button"
            >
              {account
                ? shortAccount
                : "CONNECT METAMASK ↗"}
            </button>

            <div className="pp-wallet-console-meta">
              <div>
                <span>NETWORK</span>
                <strong>HARDHAT LOCAL</strong>
              </div>

              <div>
                <span>CHAIN</span>
                <strong>31337</strong>
              </div>
            </div>
          </div>

          {status && (
            <div
              className={`pp-action-message ${
                status.includes("✓")
                  ? "success"
                  : ""
              }`}
            >
              <span>
                {status.includes("✓") ? "✓" : "•"}
              </span>

              <p>{status}</p>
            </div>
          )}
        </aside>

        <div className="pp-issuer-panels pp-issuer-panels-final">
          <form
            className="pp-issuer-form pp-issuer-form-final"
            onSubmit={issueCredential}
          >
            <div className="pp-issuer-form-head">
              <div>
                <span>NEW CREDENTIAL</span>
                <strong>Issue on-chain</strong>
              </div>

              <span>01 / ISSUE</span>
            </div>

            <label>
              CREDENTIAL ID

              <input
                value={credentialId}
                onChange={(event) => {
                  setCredentialId(
                    event.target.value
                  );
                  setIssuedId("");
                }}
                placeholder="PP-2026-X92K1"
                autoComplete="off"
              />
            </label>

            <label>
              RECIPIENT

              <input
                value={recipient}
                onChange={(event) =>
                  setRecipient(
                    event.target.value
                  )
                }
                placeholder="S. Sechilia"
                autoComplete="off"
              />
            </label>

            <label>
              CERTIFICATE NAME

              <input
                value={certificateName}
                onChange={(event) =>
                  setCertificateName(
                    event.target.value
                  )
                }
                placeholder="Blockchain Development"
                autoComplete="off"
              />
            </label>

            <button
              className="pp-issuer-submit"
              type="submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "PROCESSING TRANSACTION..."
                  : "ISSUE CREDENTIAL"}
              </span>

              <span>↗</span>
            </button>

            {issuedId && (
              <div className="pp-success-panel">
                <div>
                  <span>TRANSACTION CONFIRMED</span>
                  <strong>{issuedId}</strong>
                </div>

                <a
                  href={`/certificate/${encodeURIComponent(
                    issuedId
                  )}`}
                >
                  VIEW PROOF ↗
                </a>
              </div>
            )}
          </form>

          <form
            className="pp-issuer-form pp-issuer-form-final pp-revoke-form"
            onSubmit={revokeCredential}
          >
            <div className="pp-issuer-form-head">
              <div>
                <span>REVOKE CREDENTIAL</span>
                <strong>Invalidate proof</strong>
              </div>

              <span>02 / REVOKE</span>
            </div>

            <p className="pp-revoke-copy">
              Mark an issued credential as permanently
              revoked while preserving its immutable
              blockchain history.
            </p>

            <label>
              CREDENTIAL ID

              <input
                value={revokeId}
                onChange={(event) => {
                  setRevokeId(
                    event.target.value
                  );
                  setRevokeStatus("");
                }}
                placeholder="PP-2026-WEB301"
                autoComplete="off"
              />
            </label>

            <button
              className="pp-issuer-submit pp-revoke-submit"
              type="submit"
              disabled={revoking}
            >
              <span>
                {revoking
                  ? "PROCESSING REVOCATION..."
                  : "REVOKE CREDENTIAL"}
              </span>

              <span>↗</span>
            </button>

            {revokeStatus && (
              <div
                className={`pp-action-message pp-revoke-message ${
                  revokeStatus.includes("✓")
                    ? "success"
                    : ""
                }`}
              >
                <span>
                  {revokeStatus.includes("✓")
                    ? "✓"
                    : "•"}
                </span>

                <p>{revokeStatus}</p>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}