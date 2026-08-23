"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = credentialId.trim();

    if (!id) return;

    router.push(`/certificate/${encodeURIComponent(id)}`);
  }

  return (
    <main className="verify-page">
      <div className="verify-page-grid" />

      <nav className="verify-nav">
        <a href="/" className="verify-logo">
          PROOFPASS®
        </a>

        <a href="/">← BACK</a>
      </nav>

      <section className="verify-page-content">
        <div className="verify-page-heading">
          <span>VERIFICATION TERMINAL / V.01</span>

          <h1>
            VERIFY
            <br />
            <em>CREDENTIAL.</em>
          </h1>

          <p>
            Enter a ProofPass Web3 credential ID to inspect its onchain verification
            record.
          </p>
        </div>

        <form className="verify-terminal-large" onSubmit={handleSubmit}>
          <div className="verify-terminal-head">
            <span>● SYSTEM ONLINE</span>
            <span>HARDHAT LOCAL</span>
          </div>

          <label htmlFor="credential">
            CREDENTIAL IDENTIFIER
          </label>

          <div className="verify-terminal-input">
            <input
              id="credential"
              value={credentialId}
              onChange={(event) => setCredentialId(event.target.value)}
              placeholder="PP-2026-A8F912"
              autoComplete="off"
            />

            <button type="submit">
              VERIFY ↗
            </button>
          </div>

          <div className="verify-example">
            TRY / PP-2026-A8F912
          </div>
        </form>
      </section>
    </main>
  );
}