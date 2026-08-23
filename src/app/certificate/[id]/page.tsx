import {
  PROOFPASS_CONTRACT_ADDRESS,
  PROOFPASS_NETWORK_LABEL,
  proofPassAbi,
  proofPassClient,
} from "@/lib/proofpassContract";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

function OfflineState({ credentialId }: { credentialId: string }) {
  return (
    <main className="pp-result-page">
      <div className="pp-result-grid" />
      <div className="pp-result-glow pp-result-glow-a" />
      <div className="pp-result-glow pp-result-glow-b" />

      <nav className="pp-result-nav">
        <a href="/" className="pp-result-brand">
          PROOFPASS<span>®</span>
        </a>

        <a href="/#verify" className="pp-result-back">
          ← BACK TO VERIFY
        </a>
      </nav>

      <section className="pp-result-shell">
        <div className="pp-result-status pp-result-status-invalid">
          <span className="pp-result-status-icon">!</span>
          <div>
            <span>ONCHAIN CONNECTION</span>
            <strong>LOCAL NODE OFFLINE</strong>
          </div>
        </div>

        <div className="pp-result-not-found">
          <p className="pp-result-index">RPC / CONNECTION REQUIRED</p>
          <h1>
            Blockchain
            <br />
            <em>is offline.</em>
          </h1>
          <p>
            ProofPass could not reach the local Hardhat network while checking{" "}
            <strong>{credentialId}</strong>. Start the blockchain node, then try
            again.
          </p>
          <div className="pp-result-actions">
            <a className="pp-result-primary" href={`/certificate/${encodeURIComponent(credentialId)}`}>
              Retry verification <span>↗</span>
            </a>
            <a className="pp-result-secondary" href="/">
              Back home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function CertificatePage({ params }: Props) {
  const { id } = await params;
  const credentialId = decodeURIComponent(id)
  .trim()
  .toUpperCase();

  const verification = await proofPassClient
    .readContract({
      address: PROOFPASS_CONTRACT_ADDRESS,
      abi: proofPassAbi,
      functionName: "verifyCertificate",
      args: [credentialId],
    })
    .catch(() => null);

  if (!verification) {
    return <OfflineState credentialId={credentialId} />;
  }

  const [exists, valid, revoked] = verification;

  if (!exists) {
    return (
      <main className="pp-result-page">
        <div className="pp-result-grid" />
        <div className="pp-result-glow pp-result-glow-a" />
        <div className="pp-result-glow pp-result-glow-b" />

        <nav className="pp-result-nav">
          <a href="/" className="pp-result-brand">
            PROOFPASS<span>®</span>
          </a>
          <a href="/#verify" className="pp-result-back">
            ← VERIFY ANOTHER
          </a>
        </nav>

        <section className="pp-result-shell">
          <div className="pp-result-status pp-result-status-invalid">
            <span className="pp-result-status-icon">×</span>
            <div>
              <span>ONCHAIN RESULT</span>
              <strong>CREDENTIAL NOT FOUND</strong>
            </div>
          </div>

          <div className="pp-result-not-found">
            <p className="pp-result-index">REGISTRY / NOT FOUND</p>
            <h1>
              No proof
              <br />
              <em>was found.</em>
            </h1>
            <p>
              Credential <strong>{credentialId}</strong> does not exist in the
              ProofPass Web3 onchain registry.
            </p>
            <div className="pp-result-actions">
              <a className="pp-result-primary" href="/#verify">
                Try another ID <span>↗</span>
              </a>
              <a className="pp-result-secondary" href="/">
                Back home
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const blockchainData = await Promise.all([
    proofPassClient.readContract({
      address: PROOFPASS_CONTRACT_ADDRESS,
      abi: proofPassAbi,
      functionName: "getCertificate",
      args: [credentialId],
    }),
    proofPassClient.getChainId(),
  ]).catch(() => null);

  if (!blockchainData) {
    return <OfflineState credentialId={credentialId} />;
  }

  const [credential, chainId] = blockchainData;

  const issuedDate = new Date(Number(credential.issuedAt) * 1000).toLocaleDateString(
    "en-GB",
    { day: "2-digit", month: "long", year: "numeric" },
  );

  return (
    <main className="pp-result-page">
      <div className="pp-result-grid" />
      <div className="pp-result-glow pp-result-glow-a" />
      <div className="pp-result-glow pp-result-glow-b" />

      <nav className="pp-result-nav">
        <a href="/" className="pp-result-brand">
          PROOFPASS<span>®</span>
        </a>
        <div className="pp-result-nav-meta">
          <span>{PROOFPASS_NETWORK_LABEL.toUpperCase()}</span>
          <span>CHAIN / {chainId}</span>
        </div>
        <a href="/#verify" className="pp-result-back">
          ← VERIFY ANOTHER
        </a>
      </nav>

      <section className="pp-result-shell">
        <div
          className={`pp-result-status ${
            revoked ? "pp-result-status-revoked" : "pp-result-status-verified"
          }`}
        >
          <span className="pp-result-status-icon">{revoked ? "!" : "✓"}</span>
          <div>
            <span>ONCHAIN RESULT</span>
            <strong>
              {revoked
                ? "CREDENTIAL REVOKED"
                : valid
                  ? "VERIFIED ON-CHAIN"
                  : "INVALID CREDENTIAL"}
            </strong>
          </div>
        </div>

        <div className="pp-result-layout">
          <div className="pp-result-copy">
            <p className="pp-result-index">{credential.credentialId}</p>
            <h1>{credential.certificateName}</h1>
            <p className="pp-result-description">
              This credential was read directly from the ProofPass Web3 smart
              contract. The result is coming from the onchain registry, not a
              frontend demo dataset.
            </p>
            <div className="pp-result-actions">
              <a className="pp-result-primary" href="/#verify">
                Verify another <span>↗</span>
              </a>
              <a className="pp-result-secondary" href="/">
                Back to ProofPass
              </a>
            </div>
          </div>

          <article className="pp-proof-card">
            <div className="pp-proof-card-shine" />
            <div className="pp-proof-scan" />

            <div className="pp-proof-card-head">
              <div>
                <span className="pp-proof-mark">P</span>
                <div>
                  <strong>PROOFPASS WEB3</strong>
                  <small>ONCHAIN CREDENTIAL RECORD</small>
                </div>
              </div>
              <span>PP / {revoked ? "REVOKED" : "VERIFIED"}</span>
            </div>

            <div className="pp-proof-seal">
              <div className="pp-proof-ring pp-proof-ring-one" />
              <div className="pp-proof-ring pp-proof-ring-two" />
              <div className="pp-proof-core">PP</div>
            </div>

            <div className="pp-proof-card-body">
              <div className="pp-proof-state">
                <i />
                {revoked ? "REVOKED RECORD" : "AUTHENTIC RECORD"}
              </div>

              <div className="pp-proof-data">
                <div>
                  <span>RECIPIENT</span>
                  <strong>{credential.recipient}</strong>
                </div>
                <div>
                  <span>ISSUER</span>
                  <strong>
                    {credential.issuer.slice(0, 6)}...{credential.issuer.slice(-4)}
                  </strong>
                </div>
                <div>
                  <span>ISSUED</span>
                  <strong>{issuedDate}</strong>
                </div>
                <div>
                  <span>NETWORK</span>
                  <strong>{PROOFPASS_NETWORK_LABEL.toUpperCase()}</strong>
                </div>
                <div>
                  <span>CHAIN ID</span>
                  <strong>{chainId}</strong>
                </div>
                <div>
                  <span>STATUS</span>
                  <strong>{revoked ? "REVOKED" : "VALID"}</strong>
                </div>
              </div>
            </div>

            <div className="pp-proof-hash">
              <span>DOCUMENT HASH / BYTES32</span>
              <code>{credential.documentHash}</code>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
