const hre = require("hardhat");

async function main() {
  // Detect which network we're deploying to
  const network = hre.network.name;
  const networkNames = {
    sepolia: "Ethereum Sepolia Testnet",
    mumbai: "Polygon Mumbai Testnet",
    localhost: "Local Hardhat Network"
  };
  
  console.log(`\n🚀 Deploying CertificateRegistry to ${networkNames[network] || network}...\n`);

  // Get deployer account info
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  
  console.log("📝 Deployment Details:");
  console.log("   Deployer Address:", deployerAddress);
  console.log("   Account Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("   Network:", network);
  console.log("   Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
  console.log("");

  // Get the contract factory
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  
  console.log("⏳ Deployment in progress...");
  
  // Deploy the contract
  const certificateRegistry = await CertificateRegistry.deploy();
  
  // Wait for deployment to complete
  await certificateRegistry.waitForDeployment();
  
  const contractAddress = await certificateRegistry.getAddress();
  const deploymentTx = certificateRegistry.deploymentTransaction();
  
  console.log("\n✅ CertificateRegistry deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  
  if (deploymentTx) {
    console.log("📤 Transaction Hash:", deploymentTx.hash);
    console.log("⛽ Gas Used:", deploymentTx.gasLimit?.toString() || "N/A");
  }
  
  console.log("\n📋 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Add it to your .env and server/.env files:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  
  // Network-specific links
  if (network === 'sepolia') {
    console.log("\n3. View your contract on Sepolia Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("\n4. View your deployment transaction:");
    console.log(`   https://sepolia.etherscan.io/tx/${deploymentTx?.hash}`);
    console.log("\n5. Monitor your wallet:");
    console.log(`   https://sepolia.etherscan.io/address/${deployerAddress}`);
  } else if (network === 'mumbai') {
    console.log("\n3. View your contract on PolygonScan:");
    console.log(`   https://mumbai.polygonscan.com/address/${contractAddress}`);
    console.log("\n4. View your deployment transaction:");
    console.log(`   https://mumbai.polygonscan.com/tx/${deploymentTx?.hash}`);
  }
  
  console.log("\n6. Restart your server to start using blockchain!");
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
