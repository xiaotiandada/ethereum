const Auction = artifacts.require('Auction');

contract('Auction', (accounts) => {
    console.log('accounts', accounts)

    it ('get auction owner', async () => {
      // 获取合约实例
      const auction = await Auction.deployed()

      const owner = await auction.getOwner()
      console.log('owner value', owner)

      const ownerAddress = await auction.getOwnerAddress()
      console.log('owner address', ownerAddress)
    })

    it ('set auction owner', async () => {
      // 获取合约实例
      const auction = await Auction.deployed()

      await auction.buy('1323')

      const owner = await auction.getOwner()
      console.log('owner value', owner)

    })

  
})