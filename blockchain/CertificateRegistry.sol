// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateRegistry
 * @dev Store and verify certificate hashes on blockchain
 */
contract CertificateRegistry {
    struct Certificate {
        string certificateHash;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(string => Certificate) private certificates;
    
    event CertificateStored(
        string indexed certificateHash,
        uint256 timestamp
    );
    
    /**
     * @dev Store a new certificate hash
     * @param certificateHash The hash of the certificate to store
     */
    function storeCertificate(string memory certificateHash) public returns (bool) {
        require(bytes(certificateHash).length > 0, "Certificate hash cannot be empty");
        require(!certificates[certificateHash].exists, "Certificate already exists");
        
        certificates[certificateHash] = Certificate({
            certificateHash: certificateHash,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit CertificateStored(certificateHash, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Verify if a certificate exists
     * @param certificateHash The hash to verify
     * @return exists Whether the certificate exists
     * @return timestamp When the certificate was stored
     */
    function verifyCertificate(string memory certificateHash) 
        public 
        view 
        returns (bool exists, uint256 timestamp) 
    {
        Certificate memory cert = certificates[certificateHash];
        return (cert.exists, cert.timestamp);
    }
    
    /**
     * @dev Get certificate details
     * @param certificateHash The hash to lookup
     * @return certificateHash The certificate hash
     * @return timestamp When it was stored
     * @return exists Whether it exists
     */
    function getCertificate(string memory certificateHash)
        public
        view
        returns (
            string memory,
            uint256,
            bool
        )
    {
        Certificate memory cert = certificates[certificateHash];
        return (cert.certificateHash, cert.timestamp, cert.exists);
    }
}
