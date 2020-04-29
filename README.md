# Ethereum

Ethereum study notes


学习资料
- https://ethereum.org/
- https://solidity.readthedocs.io/en/v0.6.6/introduction-to-smart-contracts.html
- https://www.qikegu.com/docs/4733
- https://www.trufflesuite.com/tutorials/pet-shop

## 总结(一) 

### 配置本地的开发环境以及遇到的坑

首先看看这里 https://ethereum.org/

然后开发可以参照这篇文章进行学习和实战 https://www.qikegu.com/docs/4733

在``truffle init``的时候遇到一个connect x.x.x.x:443的错误

官方给出来的答复是 GFW ``It's all GFW's fault, when i crossed GFW, everything work.`` [issues/2995](https://github.com/trufflesuite/truffle/issues/2995)

我目前的解决方案是直接clone [repo](https://github.com/truffle-box/bare-box)然后一些基本的目录都有了,然后在继续参考教程跑流程

## 总结(二)

### 本地部署多个项目的合约无法成功

本地执行 ``truffle compile`` 显示是成功的

执行 ``truffle migrate`` 显示是最新的

但是实际在 ``truffle console`` || ``truffle test`` 里面调用时错误的

解决方案是 ``truffle migrate --reset`` 增加 ``--reset`` !!!

看到一篇文章有写到这个问题 https://www.jianshu.com/p/42479ede6730 

> 这个命令会执行所有migrations目录下的js文件。如果之前执行过truffle migrate命令，再次执行，只会部署新的js文件，如果没有新的js文件，不会起任何作用。如果使用--reset参数，则会重新的执行所有脚本的部署。truffle migrate --reset。





