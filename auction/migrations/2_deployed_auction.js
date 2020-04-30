const Auction = artifacts.require("Auction");

module.exports = function(deployer) {
  // 2020-05-01 00:00:00
  deployer.deploy(Auction, 1588243414, '0x0261dB84d76B0D498618bDa1d8ce3A75878591D5');
};
