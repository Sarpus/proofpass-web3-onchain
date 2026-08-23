import {
  createPublicClient,
  http,
} from "viem";

import { foundry } from "viem/chains";

export const PROOFPASS_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;

export const PROOFPASS_NETWORK_LABEL =
  "Hardhat Local";

export const proofPassAbi = [
  // =========================
  // VERIFY
  // =========================

  {
    type: "function",
    name: "verifyCertificate",
    stateMutability: "view",

    inputs: [
      {
        name: "credentialId",
        type: "string",
      },
    ],

    outputs: [
      {
        name: "exists",
        type: "bool",
      },
      {
        name: "valid",
        type: "bool",
      },
      {
        name: "revoked",
        type: "bool",
      },
    ],
  },

  // =========================
  // GET CERTIFICATE
  // =========================

  {
    type: "function",
    name: "getCertificate",
    stateMutability: "view",

    inputs: [
      {
        name: "credentialId",
        type: "string",
      },
    ],

    outputs: [
      {
        name: "",
        type: "tuple",

        components: [
          {
            name: "credentialId",
            type: "string",
          },
          {
            name: "recipient",
            type: "string",
          },
          {
            name: "certificateName",
            type: "string",
          },
          {
            name: "documentHash",
            type: "bytes32",
          },
          {
            name: "issuer",
            type: "address",
          },
          {
            name: "issuedAt",
            type: "uint256",
          },
          {
            name: "revoked",
            type: "bool",
          },
          {
            name: "exists",
            type: "bool",
          },
        ],
      },
    ],
  },

  // =========================
  // ISSUE CERTIFICATE
  // =========================

  {
    type: "function",
    name: "issueCertificate",
    stateMutability: "nonpayable",

    inputs: [
      {
        name: "credentialId",
        type: "string",
      },
      {
        name: "recipient",
        type: "string",
      },
      {
        name: "certificateName",
        type: "string",
      },
      {
        name: "documentHash",
        type: "bytes32",
      },
    ],

    outputs: [],
  },

  // =========================
  // REVOKE
  // =========================

  {
    type: "function",
    name: "revokeCertificate",
    stateMutability: "nonpayable",

    inputs: [
      {
        name: "credentialId",
        type: "string",
      },
    ],

    outputs: [],
  },

  // =========================
  // AUTHORIZED ISSUER
  // =========================

  {
    type: "function",
    name: "authorizedIssuers",
    stateMutability: "view",

    inputs: [
      {
        name: "",
        type: "address",
      },
    ],

    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },
] as const;

export const proofPassClient =
  createPublicClient({
    chain: foundry,

    transport: http(
      "http://127.0.0.1:8545"
    ),
  });