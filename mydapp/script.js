const MyContract = artifacts.require("MyContract");

module.exports = async function(callback) {
  // web3.eth.getBlock('latest').then(console.log)

  const contract = await MyContract.deployed()
  const value = await contract.get()

  console.log('Value', value)
}