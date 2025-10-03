const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.apiSecret = process.env.PINATA_API_SECRET;
    this.baseUrl = 'https://api.pinata.cloud';
    this.gateway = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud';
  }

  async testAuthentication() {
    try {
      const response = await axios.get(`${this.baseUrl}/data/testAuthentication`, {
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret
        }
      });
      console.log('✅ Pinata authentication successful');
      return response.data;
    } catch (error) {
      console.error('❌ Pinata authentication failed:', error.message);
      throw error;
    }
  }

  async uploadFile(filePath, metadata = {}) {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.warn('⚠️  Pinata credentials not configured, skipping IPFS upload');
        return {
          success: false,
          mock: true,
          IpfsHash: 'mock-ipfs-hash',
          message: 'Pinata not configured - using mock data'
        };
      }

      const formData = new FormData();
      const fileStream = fs.createReadStream(filePath);
      const fileName = path.basename(filePath);
      
      formData.append('file', fileStream);

      // Add metadata
      const pinataMetadata = {
        name: metadata.name || fileName,
        keyvalues: {
          certificateId: metadata.certificateId || '',
          learnerName: metadata.learnerName || '',
          courseName: metadata.courseName || '',
          issueDate: metadata.issueDate || '',
          uploadDate: new Date().toISOString()
        }
      };

      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      // Add pinata options
      const pinataOptions = {
        cidVersion: 1,
      };
      formData.append('pinataOptions', JSON.stringify(pinataOptions));

      const response = await axios.post(
        `${this.baseUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.apiSecret
          }
        }
      );

      console.log(`✅ File uploaded to IPFS: ${response.data.IpfsHash}`);

      return {
        success: true,
        IpfsHash: response.data.IpfsHash,
        PinSize: response.data.PinSize,
        Timestamp: response.data.Timestamp,
        ipfsUrl: `${this.gateway}/ipfs/${response.data.IpfsHash}`,
        publicUrl: `https://ipfs.io/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading to Pinata:', error.message);
      throw error;
    }
  }

  async uploadJSON(jsonObject, metadata = {}) {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.warn('⚠️  Pinata credentials not configured, skipping IPFS upload');
        return {
          success: false,
          mock: true,
          IpfsHash: 'mock-ipfs-json-hash',
          message: 'Pinata not configured - using mock data'
        };
      }

      const data = {
        pinataContent: jsonObject,
        pinataMetadata: {
          name: metadata.name || 'certificate-metadata',
          keyvalues: {
            type: 'certificate-metadata',
            certificateId: metadata.certificateId || '',
            uploadDate: new Date().toISOString()
          }
        },
        pinataOptions: {
          cidVersion: 1
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.apiSecret
          }
        }
      );

      console.log(`✅ JSON uploaded to IPFS: ${response.data.IpfsHash}`);

      return {
        success: true,
        IpfsHash: response.data.IpfsHash,
        PinSize: response.data.PinSize,
        Timestamp: response.data.Timestamp,
        ipfsUrl: `${this.gateway}/ipfs/${response.data.IpfsHash}`,
        publicUrl: `https://ipfs.io/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error.message);
      throw error;
    }
  }

  async unpinFile(ipfsHash) {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return { success: false, message: 'Pinata not configured' };
      }

      await axios.delete(`${this.baseUrl}/pinning/unpin/${ipfsHash}`, {
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret
        }
      });

      console.log(`✅ File unpinned from IPFS: ${ipfsHash}`);
      return { success: true };
    } catch (error) {
      console.error('Error unpinning from Pinata:', error.message);
      throw error;
    }
  }

  async getPinnedFiles(filters = {}) {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return { success: false, message: 'Pinata not configured' };
      }

      const response = await axios.get(`${this.baseUrl}/data/pinList`, {
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret
        },
        params: filters
      });

      return response.data;
    } catch (error) {
      console.error('Error getting pinned files:', error.message);
      throw error;
    }
  }

  getIPFSUrl(ipfsHash) {
    return `${this.gateway}/ipfs/${ipfsHash}`;
  }

  getPublicIPFSUrl(ipfsHash) {
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
}

module.exports = new PinataService();
