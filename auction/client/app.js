var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    account: '', // 当前账号
    auctionName: '', // 拍卖名称
    beneficiary: '', // 受益者/卖家
    auctionEndTime: '', // 结束时间
    highestBidder: '', // 最高出价格者
    highestBid: '', // 最高价格
    countdown: 0, // 倒计时
    timer: null,
    bidValue: 0,
  },
  mounted() {
    this.init()
  },
  computed: {
    time() {
      return this.auctionEndTime ? moment(this.auctionEndTime).format('YYYY-MM-DD H:mm:ss') : ''
    },
    selfCard() {
      return this.account.toLocaleLowerCase() === this.highestBidder.toLocaleLowerCase()
    },
    highestBidFormat() {
      return this.highestBid ? web3.utils.fromWei(this.highestBid, 'ether') : ''
    }
  },
  methods: {
    async init() {
      await this.loadWeb3()
      await this.render()
      await this.btnEvent()
    },
    async loadWeb3() {

      if (typeof Web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider)
        window.web3 = web3
      } else {
        window.alert("Please connect to Metamask.")
      }

      // MetaMask new version
      if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(ethereum)
        try {
          // 向用户请求帐户访问
          ethereum.enable();
        } catch (e) {
          // 用户拒绝使用账户
        }

      } else if (window.web3) {
        // MetaMask老版本…

        window.web3 = new Web3(web3.currentProvider)
      } else {
        // 没有安装以太坊钱包插件(MetaMask)...

        console.log('需要安装以太坊钱包插件(例如MetaMask)才能使用!')
      }

    },
    async render() {

      try {
        const abi = [{"inputs":[{"internalType":"uint256","name":"_biddingTime","type":"uint256"},{"internalType":"address payable","name":"_beneficiary","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AuctionEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"bidder","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"HighestBidIncreased","type":"event"},{"inputs":[],"name":"auctionEnd","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"auctionEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"auctionId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"auctionName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bid","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"get","outputs":[{"internalType":"address","name":"_beneficiary","type":"address"},{"internalType":"uint256","name":"_auctionEndTime","type":"uint256"},{"internalType":"uint256","name":"_now","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAuctionInfo","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHighest","outputs":[{"internalType":"address","name":"_highestBidder","type":"address"},{"internalType":"uint256","name":"_highestBid","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"highestBid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"highestBidder","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pendingReturns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"account","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        const contract = new web3.eth.Contract(abi, '0x6e3d2991839C16226DDa4f756296f05d7Ce9a042')
        window.contract = contract

        // 设置当前区块链帐户
        const accounts = await ethereum.enable()
        this.account = accounts[0]

        // 得到一些信息

        this.auctionName = await contract.methods.auctionName().call()
        this.beneficiary = await contract.methods.beneficiary().call()
        const time = await contract.methods.auctionEndTime().call()
        this.auctionEndTime = Number(time) * 1000
        this.highestBidder = await contract.methods.highestBidder().call()
        this.highestBid = await contract.methods.highestBid().call()

        this.bidValue = web3.utils.fromWei(this.highestBid, 'ether')
      } catch (e) {
        console.log(e)
      }

      this.countdownTimer()

    },
    countdownTimer() {

      let time = this.auctionEndTime / 1000 - Date.now() / 1000
      // console.log(time)

      if (time < 0) {
        this.countdown = `已结束`
        return
      }

      const countdownFormat = time => {
        let day = Math.floor(time / 3600 / 24)
        let hour = Math.floor(time / 3600 % 24)
        let minute = Math.floor(time / 60 % 60)
        let second = Math.floor(time % 60)
        return `${day}天 ${hour}时 ${minute}分 ${second}秒`
      }
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        time--
        this.countdown = countdownFormat(time)
        if (time <= 0) {
          clearInterval(this.timer)
        }
      }, 1000)

    },
    btnEvent() {
      document.querySelector('#bid').addEventListener('click', () => {
        if (Date.now() > this.auctionEndTime) {
          // if ('') {
          alert('拍卖已结束')
        } else if (this.selfCard) {
          alert('已经是您的了')
        } else {
          if (Number(this.bidValue) === 0) {
            alert('必须大于0')
          } else if (Number(this.bidValue <= Number(this.highestBidFormat))) {
            alert('不能小于当或等于前最高价格')
          } else {
            contract.methods.bid().send({
              from: this.account,
              value: web3.utils.toWei(this.bidValue, 'ether')
            }).then(res => {
              console.log('res', res)
            }).catch(e => {
              console.log('e', e)
            })
          }

        }
      })
    }
  }
})