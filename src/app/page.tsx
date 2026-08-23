"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import MoltenMetal from "@/components/MoltenMetal";

export default function Home() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState("");

  function handleVerify(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const id = credentialId.trim().toUpperCase();

    if (!id) return;

    router.push(`/certificate/${encodeURIComponent(id)}`);
  }

  return (
    <main className="pp-site">
      {/* =========================
          NAVIGATION
      ========================== */}

      <nav className="pp-nav">
        <a className="pp-brand" href="#">
          PROOFPASS<span>®</span>
        </a>

        <div className="pp-nav-links">
          <a href="#protocol">Protocol</a>
          <a href="#verify">Verify</a>
          <a href="#about">About</a>
        </div>

        <a
          className="pp-wallet"
          href="/issuer"
          style={{ textDecoration: "none" }}
        >
          <span className="pp-live-dot" />

          Issuer Console

          <span>↗</span>
        </a>
      </nav>

      {/* =========================
          HERO
      ========================== */}

      <section className="pp-hero">
        <div className="pp-grid" aria-hidden="true" />

        <div className="pp-molten" aria-hidden="true">
          <MoltenMetal
            color1="#3B0764"
            color2="#7C3AED"
            color3="#E9D5FF"
            speed={0.14}
            scale={4.7}
            detail={3}
            glow={1.2}
            coreSize={0.11}
            swirl={0.8}
            fold={-0.16}
            blackPoint={0.08}
            brightness={1}
            colorMode="molten"
            grain
            grainIntensity={0.025}
            mouseInteraction
            mouseStrength={0.16}
            opacity={0.95}
          />
        </div>

        <div className="pp-hero-copy">
          <div className="pp-kicker">
            <span>01</span>

            <i />

            WEB3 / ONCHAIN CREDENTIAL INFRASTRUCTURE
          </div>

          <h1>
            Proof,
            <br />
            without the
            <br />
            <em>paper chase.</em>
          </h1>

          <p className="pp-lead">
            Issue and verify digital credentials with an immutable blockchain
            record — designed for institutions, students, and anyone who needs
            proof they can trust.
          </p>

          <div className="pp-actions">
            <a className="pp-primary" href="#verify">
              Verify credential
              <span>↗</span>
            </a>

            <a className="pp-secondary" href="#protocol">
              Explore protocol
            </a>
          </div>

          <div className="pp-hero-stats">
            <div>
              <span>NETWORK</span>
              <strong>Hardhat Local</strong>
            </div>

            <div>
              <span>CHAIN ID</span>
              <strong>31337</strong>
            </div>

            <div>
              <span>PROTOCOL</span>
              <strong className="pp-online">● Online</strong>
            </div>
          </div>
        </div>

        {/* =========================
            HERO CREDENTIAL
        ========================== */}

        <div className="pp-visual">
          <div className="pp-visual-caption pp-caption-top">
            LIVE CREDENTIAL / 001
          </div>

          <div className="pp-certificate">
            <div className="pp-card-glow" />
            <div className="pp-scan-line" />

            <div className="pp-card-top">
              <div className="pp-card-brand">
                <span className="pp-mark">P</span>

                <div>
                  <strong>PROOFPASS</strong>
                  <small>VERIFIABLE CREDENTIAL</small>
                </div>
              </div>

              <span className="pp-card-id">PP / 001</span>
            </div>

            <div className="pp-seal" aria-hidden="true">
              <div className="pp-ring pp-ring-1" />
              <div className="pp-ring pp-ring-2" />

              <div className="pp-seal-core">PP</div>
            </div>

            <div className="pp-card-content">
              <div className="pp-verified">
                <i />
                VERIFIED ON-CHAIN
              </div>

              <h2>
                Advanced
                <br />
                Web Development
              </h2>

              <div className="pp-card-data">
                <div>
                  <span>RECIPIENT</span>
                  <strong>S. SECHILIA</strong>
                </div>

                <div>
                  <span>ISSUER</span>
                  <strong>PROOFPASS WEB3 LAB</strong>
                </div>

                <div>
                  <span>NETWORK</span>
                  <strong>LOCAL / 31337</strong>
                </div>

                <div>
                  <span>HASH</span>
                  <strong>8F21...A19C</strong>
                </div>
              </div>
            </div>

            <div className="pp-card-footer">
              <span>SHA-256 VERIFIED</span>
              <span>21.08.2026</span>
            </div>
          </div>

          <div className="pp-visual-caption pp-caption-bottom">
            CRYPTOGRAPHIC PROOF / ACTIVE
          </div>
        </div>
      </section>

      {/* =========================
          NETWORK TICKER
      ========================== */}

      <section className="pp-ticker" aria-label="Protocol status">
        <span>BLOCK / 31,884,201</span>
        <span>CONSENSUS / CONFIRMED</span>
        <span>HASH / 8F21.A19C</span>
        <span>NETWORK / HARDHAT LOCAL</span>
      </section>

      {/* =========================
          PROTOCOL
      ========================== */}

      <section className="pp-protocol" id="protocol">
        <div className="pp-section-heading">
          <p>02 / PROTOCOL</p>

          <h2>
            Trust should be
            <br />
            <em>inspectable.</em>
          </h2>
        </div>

        <div className="pp-steps">
          <article>
            <span className="pp-step-no">01</span>

            <div className="pp-step-copy">
              <span>ISSUE</span>

              <h3>Create the record.</h3>

              <p>
                An authorized issuer generates a credential and anchors its
                cryptographic fingerprint on-chain.
              </p>
            </div>

            <span className="pp-arrow">↗</span>
          </article>

          <article>
            <span className="pp-step-no">02</span>

            <div className="pp-step-copy">
              <span>VERIFY</span>

              <h3>Check the proof.</h3>

              <p>
                A credential ID can be checked against the blockchain record
                without trusting a central database.
              </p>
            </div>

            <span className="pp-arrow">↗</span>
          </article>

          <article>
            <span className="pp-step-no">03</span>

            <div className="pp-step-copy">
              <span>TRUST</span>

              <h3>Know what is real.</h3>

              <p>
                The result is independently verifiable, transparent, and
                resistant to silent modification.
              </p>
            </div>

            <span className="pp-arrow">↗</span>
          </article>
        </div>
      </section>

      {/* =========================
          LIVE VERIFICATION
      ========================== */}

      <section className="pp-verify" id="verify">
        <div
          className="pp-grid pp-grid-verify"
          aria-hidden="true"
        />

        <div className="pp-verify-copy">
          <p>03 / LIVE VERIFICATION</p>

          <h2>
            Verify.
            <br />
            <em>In seconds.</em>
          </h2>

          <span>
            Enter a ProofPass credential ID to inspect its blockchain record.
          </span>
        </div>

        <div className="pp-terminal">
          <div className="pp-terminal-bar">
            <span>
              <i />
              VERIFICATION TERMINAL
            </span>

            <span>V.01</span>
          </div>

          <form
            className="pp-terminal-body"
            onSubmit={handleVerify}
          >
            <label htmlFor="credential-id">
              CREDENTIAL ID
            </label>

            <div className="pp-input-row">
              <input
                id="credential-id"
                type="text"
                placeholder="PP-2026-A8F912"
                value={credentialId}
                onChange={(event) =>
                  setCredentialId(event.target.value)
                }
                autoComplete="off"
                spellCheck={false}
              />

              <button
                type="submit"
                disabled={!credentialId.trim()}
              >
                VERIFY ↗
              </button>
            </div>

            <div className="pp-terminal-meta">
              <div>
                <span>NETWORK</span>
                <strong>HARDHAT LOCAL</strong>
              </div>

              <div>
                <span>CHAIN</span>
                <strong>31337</strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong className="pp-online">
                  ● ONLINE
                </strong>
              </div>
            </div>

            <div className="pp-hash">
              0x8F21A19C · 7D82B090 · 21FC8349 · A9180FF1 · 31337
            </div>
          </form>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="pp-footer" id="about">
        <a className="pp-brand" href="#">
          PROOFPASS<span>®</span>
        </a>

        <span>
          WEB3 / ONCHAIN CREDENTIAL INFRASTRUCTURE
        </span>

        <span>© 2026</span>
      </footer>
    </main>
  );
}