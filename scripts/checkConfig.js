const { ethers } = require('ethers');
require('dotenv').config();

async function checkConfiguration() {
  console.log('\n🔍 Checking Ethereum Sepolia Configuration...\n');
  
  let allGood = true;
  
  // Check 1: RPC URL
  console.log('1️⃣  Checking RPC URL...');
  if (!process.env.BLOCKCHAIN_RPC_URL) {
    console.log('   ❌ BLOCKCHAIN_RPC_URL not set in .env');
    allGood = false;
  } else if (process.env.BLOCKCHAIN_RPC_URL.includes('YOUR_ALCHEMY_API_KEY')) {
    console.log('   ❌ Please replace YOUR_ALCHEMY_API_KEY with your actual Alchemy key');
    console.log('   📝 Get one at: https://www.alchemy.com/');
    allGood = false;
  } else {
    console.log('   ✅ RPC URL configured');
    
    // Try to connect
    try {
      const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
      const network = await provider.getNetwork();
      console.log(`   ✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      if (network.chainId === 11155111n) {
        console.log('   ✅ Confirmed: This is Sepolia testnet');
      } else {
        console.log(`   ⚠️  Warning: Expected Sepolia (11155111) but got ${network.chainId}`);
      }
    } catch (error) {
      console.log('   ❌ Cannot connect to RPC:', error.message);
      allGood = false;
    }
  }
  
  console.log('');
  
  // Check 2: Private Key
  console.log('2️⃣  Checking Private Key...');
  if (!process.env.PRIVATE_KEY) {
    console.log('   ❌ PRIVATE_KEY not set in .env');
    console.log('   📝 Export from MetaMask: Account Details → Show Private Key');
    allGood = false;
  } else if (process.env.PRIVATE_KEY === 'your_private_key_here' || 
             process.env.PRIVATE_KEY === 'your_private_key_without_0x_prefix') {
    console.log('   ❌ Please replace with your actual private key');
    allGood = false;
  } else if (process.env.PRIVATE_KEY.startsWith('0x')) {
    console.log('   ⚠️  Warning: Private key should not include 0x prefix');
    console.log('   💡 Remove the 0x from the beginning');
    allGood = false;
  } else {
    console.log('   ✅ Private key configured');
    
    // Check wallet
    try {
      const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const address = await wallet.getAddress();
      console.log(`   ✅ Wallet address: ${address}`);
      
      if (address.toLowerCase() === '0xC438024bC86820DfBc874A571813E896330c5376'.toLowerCase()) {
        console.log('   ✅ Confirmed: This is your expected address!');
      } else {
        console.log(`   ⚠️  Note: Expected 0xC438024bC86820DfBc874A571813E896330c5376`);
        console.log(`   ⚠️  Got: ${address}`);
      }
      
      // Check balance
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      console.log(`   💰 Balance: ${balanceInEth} ETH`);
      
      if (balance === 0n) {
        console.log('   ⚠️  Warning: Wallet has 0 balance');
        console.log('   📝 Get Sepolia ETH from: https://sepoliafaucet.com/');
        allGood = false;
      } else if (parseFloat(balanceInEth) < 0.01) {
        console.log('   ⚠️  Warning: Low balance. Recommended: at least 0.01 ETH');
      } else {
        console.log('   ✅ Sufficient balance for deployment and transactions');
      }
    } catch (error) {
      console.log('   ❌ Cannot access wallet:', error.message);
      allGood = false;
    }
  }
  
  console.log('');
  
  // Check 3: Contract Address
  console.log('3️⃣  Checking Contract Address...');
  if (!process.env.CONTRACT_ADDRESS) {
    console.log('   ⚠️  CONTRACT_ADDRESS not set (will be set after deployment)');
    console.log('   📝 Deploy with: npx hardhat run scripts/deploy.js --network sepolia');
  } else if (process.env.CONTRACT_ADDRESS === 'your_contract_address_after_deployment' ||
             process.env.CONTRACT_ADDRESS === 'will_be_filled_after_deployment') {
    console.log('   ⚠️  CONTRACT_ADDRESS placeholder not replaced');
    console.log('   📝 Deploy with: npx hardhat run scripts/deploy.js --network sepolia');
  } else {
    console.log(`   ✅ Contract address: ${process.env.CONTRACT_ADDRESS}`);
    
    // Try to interact with contract
    try {
      const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
      const code = await provider.getCode(process.env.CONTRACT_ADDRESS);
      
      if (code === '0x') {
        console.log('   ❌ No contract found at this address');
        console.log('   📝 Redeploy with: npx hardhat run scripts/deploy.js --network sepolia');
        allGood = false;
      } else {
        console.log('   ✅ Contract exists and is deployed');
        console.log(`   🔗 View on Etherscan: https://sepolia.etherscan.io/address/${process.env.CONTRACT_ADDRESS}`);
      }
    } catch (error) {
      console.log('   ❌ Cannot verify contract:', error.message);
      allGood = false;
    }
  }
  
  console.log('');
  
  // Final Summary
  console.log('📊 Configuration Summary\n');
  
  if (allGood) {
    console.log('✅ ✅ ✅ All checks passed! ✅ ✅ ✅');
    console.log('\n🎉 Your Ethereum Sepolia integration is ready!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start server: cd server && npm start');
    console.log('   2. Issue a test certificate');
    console.log('   3. Check transaction on Etherscan');
    console.log('\n🔗 Monitor your address:');
    console.log('   https://sepolia.etherscan.io/address/0xC438024bC86820DfBc874A571813E896330c5376');
  } else {
    console.log('❌ Some issues found. Please fix the errors above.');
    console.log('\n📚 Helpful resources:');
    console.log('   • Setup Guide: SEPOLIA_SETUP.md');
    console.log('   • Quick Start: QUICKSTART_SEPOLIA.md');
    console.log('   • Get Sepolia ETH: https://sepoliafaucet.com/');
    console.log('   • Get Alchemy Key: https://www.alchemy.com/');
  }
  
  console.log('');
}

checkConfiguration().catch(error => {
  console.error('\n❌ Error running configuration check:', error.message);
  process.exit(1);
});
