pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Auction {

  // 拥有者
  string owner = '';

  // 账户地址
  address account;

  struct Owner {
    address account;
  }
  mapping(address => Owner) ccc;

  constructor() public {
    //
  }

  // 买
  function buy (Owner memory _account) public payable {
    ccc[msg.sender] = _account;
  }

  // 得到拥有者
  function getOwner () public view returns (string memory) {
    return owner;
  }

    // 得到拥有者地址
  function getOwnerAddress () public view returns (address) {
    return account;
  }
}