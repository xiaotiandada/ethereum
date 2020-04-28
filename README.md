# Ethereum

Ethereum study notes


学习资料
- https://ethereum.org/
- https://solidity.readthedocs.io/en/v0.6.6/introduction-to-smart-contracts.html
- https://www.qikegu.com/docs/4733
- https://www.trufflesuite.com/tutorials/pet-shop

## 总结(一) 配置本地的开发环境以及遇到的坑

首先看看这里 https://ethereum.org/

然后开发可以参照这篇文章进行学习和实战 https://www.qikegu.com/docs/4733

在``truffle init``的时候遇到一个connect x.x.x.x:443的错误

官方给出来的答复是 GFW ``It's all GFW's fault, when i crossed GFW, everything work.`` [issues/2995](https://github.com/trufflesuite/truffle/issues/2995)

我目前的解决方案是直接clone [repo](https://github.com/truffle-box/bare-box)然后一些基本的目录都有了,然后在继续参考教程跑流程
