// scripts/deploy_upgradeable_box.js
import { ethers, upgrades } from "hardhat";

async function main() {
  const Box = await ethers.getContractFactory("Box");
  console.log("Deploying Box...");
  const box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
  await box.deployed();
  console.log("Box deployed to:", box.address);
}

main();

/**
 * 0x2D797565b0E373a7aB9Dae991af5462734dB4Ca7
 */
