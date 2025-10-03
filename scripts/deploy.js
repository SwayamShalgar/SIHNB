const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CertificateRegistry to Polygon Mumbai Testnet...\n");

  // Get the contract factory
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  
  console.log("⏳ Deployment in progress...");
  
  // Deploy the contract
  const certificateRegistry = await CertificateRegistry.deploy();
  
  // Wait for deployment to complete
  await certificateRegistry.waitForDeployment();
  
  const contractAddress = await certificateRegistry.getAddress();
  
  console.log("\n✅ CertificateRegistry deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("\n📋 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Add it to your server/.env file:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n3. View your contract on PolygonScan:");
  console.log(`   https://mumbai.polygonscan.com/address/${contractAddress}`);
  console.log("\n4. Restart your server to start using blockchain!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
