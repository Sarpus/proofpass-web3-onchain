// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateRegistry {
    address public owner;

    struct Certificate {
        string credentialId;
        string recipient;
        string certificateName;
        bytes32 documentHash;
        address issuer;
        uint256 issuedAt;
        bool revoked;
        bool exists;
    }

    mapping(string => Certificate) private certificates;
    mapping(address => bool) public authorizedIssuers;

    event IssuerAuthorized(address indexed issuer);

    event IssuerRemoved(address indexed issuer);

    event CertificateIssued(
        string indexed credentialId,
        address indexed issuer,
        string recipient,
        string certificateName,
        bytes32 documentHash
    );

    event CertificateRevoked(
        string indexed credentialId,
        address indexed issuer
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner can perform this action"
        );

        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender],
            "Not an authorized issuer"
        );

        _;
    }

    constructor() {
        owner = msg.sender;

        // ProofPass deployer is automatically authorized as the first issuer
        authorizedIssuers[msg.sender] = true;
    }

    // =========================
    // ISSUER MANAGEMENT
    // =========================

    function authorizeIssuer(
        address issuer
    ) external onlyOwner {
        require(
            issuer != address(0),
            "Invalid issuer address"
        );

        authorizedIssuers[issuer] = true;

        emit IssuerAuthorized(issuer);
    }

    function removeIssuer(
        address issuer
    ) external onlyOwner {
        authorizedIssuers[issuer] = false;

        emit IssuerRemoved(issuer);
    }

    // =========================
    // ISSUE CERTIFICATE
    // =========================

    function issueCertificate(
        string calldata credentialId,
        string calldata recipient,
        string calldata certificateName,
        bytes32 documentHash
    ) external onlyAuthorizedIssuer {
        require(
            bytes(credentialId).length > 0,
            "Credential ID is required"
        );

        require(
            !certificates[credentialId].exists,
            "Credential already exists"
        );

        certificates[credentialId] = Certificate({
            credentialId: credentialId,
            recipient: recipient,
            certificateName: certificateName,
            documentHash: documentHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            revoked: false,
            exists: true
        });

        emit CertificateIssued(
            credentialId,
            msg.sender,
            recipient,
            certificateName,
            documentHash
        );
    }

    // =========================
    // GET CERTIFICATE
    // =========================

    function getCertificate(
        string calldata credentialId
    )
        external
        view
        returns (Certificate memory)
    {
        require(
            certificates[credentialId].exists,
            "Credential not found"
        );

        return certificates[credentialId];
    }

    // =========================
    // VERIFY CERTIFICATE
    // =========================

    function verifyCertificate(
        string calldata credentialId
    )
        external
        view
        returns (
            bool exists,
            bool valid,
            bool revoked
        )
    {
        Certificate memory certificate =
            certificates[credentialId];

        if (!certificate.exists) {
            return (
                false,
                false,
                false
            );
        }

        return (
            true,
            !certificate.revoked,
            certificate.revoked
        );
    }

    // =========================
    // REVOKE CERTIFICATE
    // =========================

    function revokeCertificate(
        string calldata credentialId
    ) external {
        Certificate storage certificate =
            certificates[credentialId];

        require(
            certificate.exists,
            "Credential not found"
        );

        require(
            certificate.issuer == msg.sender ||
                msg.sender == owner,
            "Not allowed to revoke"
        );

        require(
            !certificate.revoked,
            "Credential already revoked"
        );

        certificate.revoked = true;

        emit CertificateRevoked(
            credentialId,
            msg.sender
        );
    }
}