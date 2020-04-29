// https://solidity-cn.readthedocs.io/zh/develop/solidity-by-example.html
// https://solidity.readthedocs.io/en/v0.6.6/solidity-by-example.html

pragma solidity >=0.4.22 <0.7.0;

// @title 委托投票
contract Ballot {
  // 这里声明了一个新的复合类型用于稍后的变量
  // 它用来表示一个选民
  struct Voter {
    uint weight; // 计票的权重
    bool voted; // 若为真，代表该人已投票
    address delegate; // 被委托人
    uint vote; // 投票提案的索引
  }

  // 提案的类型
  struct Proposal {
    bytes32 name; // 简称（最长32个字节）
    uint voteCount; // 得票数
  }

  address public chairperson;

  // 这声明了一个状态变量，为每个可能的地址存储一个 `Voter`。
  mapping(address => Voter) public voters;

  // 一个 `Proposal` 结构类型的动态数组
  Proposal[] public proposals;

  // 为 `proposalNames` 中的每个提案，创建一个新的（投票）表决
  constructor(bytes32[] memory proposalNames) public {
    chairperson = msg.sender;
    voters[chairperson].weight = 1;

    // For each of the provided proposal names,
    // create a new proposal object and add it
    // to the end of the array.
    for (uint i = 0; i < proposalNames.length; i++) {
        // `Proposal({...})` creates a temporary
        // Proposal object and `proposals.push(...)`
        // appends it to the end of `proposals`.
        proposals.push(Proposal({
            name: proposalNames[i],
            voteCount: 0
        }));
    }
  }

  // 授权 `voter` 对这个（投票）表决进行投票
  // 只有 `chairperson` 可以调用该函数。
  function giveRightToVote(address voter) public {
    // 若 `require` 的第一个参数的计算结果为 `false`，
    // 则终止执行，撤销所有对状态和以太币余额的改动。
    // 在旧版的 EVM 中这曾经会消耗所有 gas，但现在不会了。
    // 使用 require 来检查函数是否被正确地调用，是一个好习惯。
    // 你也可以在 require 的第二个参数中提供一个对错误情况的解释。
    require(
      msg.sender == chairperson,
      "Only chairperson can give right to vote."
    );

    require(voters[voter].weight == 0, "voter weight is 0");

    voters[voter].weight = 1;

  }

  // 把你的投票委托到投票者 `to`。
  function delegate(address to) public {
      // assigns reference
      Voter storage sender = voters[msg.sender];
      require(!sender.voted, "You already voted.");

      require(to != msg.sender, "Self-delegation is disallowed.");

      // Forward the delegation as long as
      // `to` also delegated.
      // In general, such loops are very dangerous,
      // because if they run too long, they might
      // need more gas than is available in a block.
      // In this case, the delegation will not be executed,
      // but in other situations, such loops might
      // cause a contract to get "stuck" completely.
      while (voters[to].delegate != address(0)) {
          to = voters[to].delegate;

          // We found a loop in the delegation, not allowed.
          require(to != msg.sender, "Found loop in delegation.");
      }

      // Since `sender` is a reference, this
      // modifies `voters[msg.sender].voted`
      sender.voted = true;
      sender.delegate = to;
      Voter storage delegate_ = voters[to];
      if (delegate_.voted) {
          // If the delegate already voted,
          // directly add to the number of votes
          proposals[delegate_.vote].voteCount += sender.weight;
      } else {
          // If the delegate did not vote yet,
          // add to her weight.
          delegate_.weight += sender.weight;
      }
  }

  /// 把你的票(包括委托给你的票)，
  /// 投给提案 `proposals[proposal].name`.

  function vote(uint proposal) public {
      Voter storage sender = voters[msg.sender];
      require(!sender.voted, "Already voted.");
      sender.voted = true;
      sender.vote = proposal;

      // 如果 `proposal` 超过了数组的范围，则会自动抛出异常，并恢复所有的改动
      proposals[proposal].voteCount += sender.weight;
  }

  // @dev 结合之前所有的投票，计算出最终胜出的提案
  function winningProposal() public view returns (uint winningProposal_) {
      uint winningVoteCount = 0;
      for (uint p = 0; p < proposals.length; p++) {
          if (proposals[p].voteCount > winningVoteCount) {
              winningVoteCount = proposals[p].voteCount;
              winningProposal_ = p;
          }
      }
  }
  // 调用 winningProposal() 函数以获取提案数组中获胜者的索引，并以此返回获胜者的名称
  function winnerName() public view returns (bytes32 winnerName_) {
    winnerName_ = proposals[winningProposal()].name;
  }
}