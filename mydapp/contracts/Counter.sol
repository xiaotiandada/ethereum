pragma solidity >=0.4.21 <0.7.0;

// 声明
contract Counter {
  uint256 counter;

  // 部署时调用
  constructor() public {
    counter = 0;
  }

  // 增加
  function increase() public {
    counter += 1;
  }

  // 返回counter
  function get() public view returns(uint256) {
    return counter;
  }

}