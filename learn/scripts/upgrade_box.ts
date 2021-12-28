import { ethers, upgrades } from "hardhat";

async function main() {
  const BoxV2 = await ethers.getContractFactory("BoxV2");
  console.log("Upgrading Box...");
  await upgrades.upgradeProxy(
    "0x2D797565b0E373a7aB9Dae991af5462734dB4Ca7",
    BoxV2
  );
  console.log("Box upgraded");
}

main();
