pragma solidity >=0.4.21 <0.7.0;

contract Auction {

    // 拍卖名称
    string public auctionName;
    // 拍卖 id
    uint256 public auctionId;

    // 受益者 出售者
    address payable public beneficiary;

    // 结束时间
    uint256 public auctionEndTime;

    // 最高出价格者
    address payable public highestBidder;
    // 最高价格
    uint256 public highestBid;

    // 允许撤回之前的出价
    // 该map记录每个竞价者的最高出价
    mapping(address => uint256) public pendingReturns;

    // 竞价结束标识位
    bool ended;

    // event 最高价发生变化时
    event HighestBidIncreased(address bidder, uint256 amount);

    // 事件二：竞价结束时
    event AuctionEnded(address winner, uint256 amount);

    constructor(uint256 _biddingTime, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        auctionEndTime = _biddingTime;
        auctionName = "炒鸡无敌闪瞎24k纯钛合金狗眼的卡";
        auctionId = 1;
    }

    function get()
        public
        view
        returns (address _beneficiary, uint256 _auctionEndTime, uint256 _now)
    {
        return (beneficiary, auctionEndTime, now);
    }

    function getAuctionInfo() public view returns (string memory) {
        return auctionName;
    }

    function getHighest()
        public
        view
        returns (address _highestBidder, uint256 _highestBid)
    {
        return (highestBidder, highestBid);
    }

    // 拍卖
    // 退还上一个用户的费用
    // 清算

    // 拍卖
    function bid() public payable {
        // 关键字payable用来标明合约函数可以接受Ether币.
        require(now <= auctionEndTime, "Auction already ended.");

        // 如果价格不超过最高价，钱会被退回.
        require(msg.value > highestBid, "There already is a higher bid.");

        if (highestBid != 0) {
            pendingReturns[highestBidder] = highestBid;
            // 退还上一个用户的钱
            withdraw(highestBidder);
        }


        highestBidder = msg.sender;
        highestBid = msg.value;

        emit HighestBidIncreased(msg.sender, msg.value);

    }

    /// 撤回一个被超过的价格.
    function withdraw(address payable account) public {
        // 获取多少钱
        uint256 amount = pendingReturns[account];
        if (amount > 0) {
            // 安全编写须知！！！
            // 一定要先将map中的值清零，因为接收者可以在send()函数返回前利用接受合约重新调用withdraw()函数
            // 从而发生“多转”的bug，即重放攻击！！！

            pendingReturns[account] = 0;

            if (!account.send(amount)) {
                // No need to call throw here, just reset the amount owing
                pendingReturns[account] = amount;
            }
        }
    }

    function auctionEnd() public {
        // 在于其他合约交互时(i.e. 调用合约函数或转账) 可以分成3个阶段:
        // 1. 检查条件；
        // 2. 执行动作； (potentially changing conditions)
        // 3. 与其他合约交互；
        // 安全设计！！！
        // 如果这三个阶段混到一块了，其他合约就可能调回当前合约从而修改状态变量。
        // 这会导致一些过程（i.e. 以太币转账）被执行多次。

        // 如果内部函数有和外部合约交互的过程，那么也该遵循以上准则。

        // 1. conditions
        require(now >= auctionEndTime, "Auction not yet ended.");
        require(!ended, "auctionEnd has already been called.");

        // 2.Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3.Interaction
        beneficiary.transfer(highestBid);
    }
}
