const Auction = artifacts.require('Auction');
const Web3 = require('web3');

const BN = web3.utils.BN;
const towei = web3.utils.toWei;

contract('Auction', accounts => {
    // console.log('accounts', accounts)
    const sleep = time => new Promise(resolve => setTimeout(resolve, time))
    it ('get auction owner', async () => {
      // 获取合约实例
      const auction = await Auction.deployed()
      const value = await auction.get()
      console.log('value', value._beneficiary)
      console.log('value', value._auctionEndTime.toString())
      console.log('value', value._now.toString())
      

      // 开始拍卖

      await auction.bid({
        from: accounts[1],
        value: web3.utils.toWei('0.01', 'ether')
      })
      // await sleep(3000)

      await auction.bid({
        from: accounts[2],
        value: web3.utils.toWei('0.02', 'ether')
      })
      // await sleep(3000)

      await auction.bid({
        from: accounts[3],
        value: web3.utils.toWei('0.03', 'ether')
      })
      // await sleep(3000)
      
      const highest = await auction.getHighest()
      console.log('getHighest', highest._highestBidder)
      console.log('getHighest', BN(highest._highestBid).toString())

      await auction.auctionEnd()

    })
  
})