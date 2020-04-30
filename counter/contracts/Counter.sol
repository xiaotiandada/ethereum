pragma solidity >=0.4.21 <0.7.0;

// 声明
contract Counter {
  // 声明计数器变量
  uint256 counter;

  // 部署时调用 初始化
  constructor() public {
    counter = 0;
  }

  // 增加方法
  function increase() public {
    counter += 1;
  }

  // 返回counter uint256是类型
  function get() public view returns(uint256) {
    return counter;
  }

}