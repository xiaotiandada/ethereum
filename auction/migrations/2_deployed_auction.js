const Auction = artifacts.require("Auction");

module.exports = function(deployer) {
  deployer.deploy(Auction, 1589195641, '0x3484040A7c337A95d0eD7779769ffe3e14ecCcA6');
};
