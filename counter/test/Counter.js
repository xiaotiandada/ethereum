// 首先，`require`合约并将其分配给一个变量`Counter`
const Counter = artifacts.require('Counter');

// 调用“contract”函数，并在回调函数中编写所有测试
// 回调函数提供一个“accounts”变量，表示本地区块链上的所有帐户。

contract('Counter', (accounts) => {
    console.log('accounts', accounts)
  
  // 第1个测试：调用get()函数，检查返回值，测试合约中value初始值是否是: 'myValue'
    it ('initializes with the correct value', async () => {
      // 获取合约实例
      const counter = await Counter.deployed()
      let value = await counter.get()
      value = value.toNumber()
  
      // 使用断言测试value的值
      assert.equal(value, 0)
    })

    // 第2个测试: 调用set()函数来设置value值，然后调用get()函数来确保更新了值
    it('can update the value', async () => {
      const counter = await Counter.deployed()
      await counter.increase()

    })
  
})