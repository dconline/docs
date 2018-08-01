---
date: 2018-07-27 15:13:39
title: Telos 环境搭建指南
author: Liang Suilong <liangsuilong@gmail.com>
type: post
tags: 
  - telos
  - eosio
  - blockchain
---
## 目录
-----

* [Telos 简介] (#telos-introdution) 
* [准备操作系统环境] (#prepare-operation-system)
* [编译和安装 Telos] (#build-and-install-telos)
* [创建钱包和公私钥] (#create-wallet-and-keypair)
* [创建配置文件] (#create-config-file)
* [注册 BP 节点和帐号] (#register-block-producer-node-and-account)

## <a name="telos-introduction"></a> Telos 简介
-----

`Telos`, 是由 EOS 区块生产节点社区中的有经验的节点们合作而推出的项目，它的目的是推出第一个基于 EOSIO 的真正意义上的去中心化，并可持续保持去中心化的区块链。

[Telos 区块链白皮书](http://resources.telosfoundation.io/telos_white_paper_7_17.pdf)

## <a name="preparing-operation-system"></a> 准备操作系统
-----

1. Amazon 2017.09 或更高
2. Centos 7
3. Fedora 25 或更高（建议 Fedora 27）
4. Mint 18
5. Ubuntu 16.04（建议Ubuntu 16.10）
6. Ubuntu 18.04
7. Mac OS X 10.12 或更高（建议 Mac OS X 10.13.x）

本文以腾讯云云服务器标准型 S2 为例子。硬件配置如下：

* CPU：双核心
* 内存：8GB
* 磁盘：系统盘 50GB，数据盘 50GB
* 网络：100Mbps

启动机器后，执行以下命令更新系统。

```
sudo apt-get update
sudo apt-get dist-upgrade
```

完成更新以后，安装 Ubuntu 的编译环境。

```
sudo apt-get install build-essential git cmake
```

## <a name="build-and-install-telos"></a> 编译和安装 Telos
-----

首先下载 `Telos` 代码。

```
git clone https://github.com/Telos-Foundation/telos
```

然后切换至 `Stage1.1` 分支。

```
git checkout Stage1.1
```

初始化和下载代码库的子模块。

```
git submodule update --init --recursive
```

执行编译脚本开始编译，大约需要一个多小时，中间会调用 `sudo` 命令，需要输入当前用户密码。

```
./telos_build.sh
```

编译不出错完成后，安装编译好的二进制代码。

```
cd build && sudo make install
```

## <a name="create-wallet-and-keypair"></a> 创建钱包和公私钥
-----

完成安装后，首先创建钱包。

```
teclos wallet create
```

此时会输出 53 位字母大小写和数字组合的密码，这个就是你钱包的密码，请保存好。

```
"/usr/local/bin/keosd" launched
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5JAWCENstiZcfYjX16bXS3VYihT4xnAKrrHQKg4CK3qF7mnwSBZ"
```

`Telos` 本地钱包每隔一段时间不操作就会自动锁定，进行操作前需要解锁钱包。

```
teclos wallet unlock
```

输入前面的密码后，钱包就会被解锁。

然后生成公私钥。

```
teclos create key
```

执行命令，输出一对公私钥。请保存好公私钥

```
Private key: 5JCvjJiD2Dfz5qxown8qE656bbxXfhVmMe3t3QWzuNSjMFNHUdi
Public key: TLOS6iheATEZvPMTf5i6EyvU4wAFhG3UNcttF6o7B3qrxh8SYSwLA1
```

导入私钥匙到钱包。

```
teclos wallet import 5JCvjJiD2Dfz5qxown8qE656bbxXfhVmMe3t3QWzuNSjMFNHUdi
```

执行命令后返回结果。

```
imported private key for: TLOS6iheATEZvPMTf5i6EyvU4wAFhG3UNcttF6o7B3qrxh8SYSwLA1
```

查看已经导入的公私。

```
[
  "TLOS6iheATEZvPMTf5i6EyvU4wAFhG3UNcttF6o7B3qrxh8SYSwLA1"
]
```

根据 `Telos` 官网注册节点的要求，需要三个公私钥用于 `Producer`、`Owner` 和 `Active`。这里需要的三对公私钥可以同时用同一对公私钥，但是最好还是使用不同的公私钥。因此建议分别生成三对公私钥并导入本地钱包。

## <a name="create-config-file"></a> 创建配置文件
-----

运行 `nodeos` 创建配置文件，运行片刻后立刻停止，就能得到一个全新的配置文件。

```
/usr/local/bin/nodeos --config-dir ./
```

必须向配置文件添加的配置选项。

```
producer-name = prodname1234
signature-provider = TLOS[public key]=KEY:[private key]
http-server-address = 0.0.0.0:8888
p2p-listen-endpoint = 0.0.0.0:9876
p2p-server-address = [external IP address]:9876
p2p-peer-address = stage1_1.telosfoundation.io:9876
plugin = eosio::http_plugin
plugin = eosio::chain_plugin
plugin = eosio::chain_api_plugin
plugin = eosio::history_plugin
plugin = eosio::history_api_plugin
plugin = eosio::net_plugin
plugin = eosio::net_api_plugin
plugin = eosio::producer_plugin
```

注释：

* producer-name 的规则是小写字母 a-z 和数字 1-5 的 12 位字符串组合。
* signature-provider 填写 Telos 公私钥，允许填写多个。可以根据前文生成公私钥的方法生成公私钥。
* http-server-address 是提供对外 HTTP 查询的地址，默认采用 0.0.0.0:8888。
* p2p-listen-endpoint 是用来接受 P2P 请求的地址，默认采用 0.0.0.0:9876。
* p2p-server-address 是用来识别本机节点的地址，默认与 p2p-listen-endpoint 相同，可以设置成服务器的公网地址加上 9876 端口。
* p2p-peer-address 是对外连接 P2P 节点的地址，可以填写多个。
* plugin 是 Telos 使用的插件。

## <a name="register-block-producer-node-and-account"></a> 注册 BP 节点和帐号
-----

打开 [Telos Testnet 主页](http://testnet.telosfoundation.io/)，点击 Register Node。在表格中填写对应的节点信息，如图所示。

![Telos 节点注册表格](/images/telos-register-node.png)

点击 Register 按钮，页面会返回一个注册 regproducer 的命令。请保存好这个命令。

```
teclos system regproducer prodname1234 TLOS6iheATEZvPMTf5i6EyvU4wAFhG3UNcttF6o7B3qrxh8SYSwLA1
```

从 `Testnet` 上下载[genesis.json](http://testnet.telosfoundation.io/resources/genesis.json)，请不要修改文件的内容。

然后启动 `nodeos 程序`，第一次启动需要加上 `--genesis-json` 和 `--delete-all-blocks` 选项。前者是记录主网最新信息，后者是启动时清理所有旧的区块。当下一次启动 `nodeos` 进程时，就不需要添加这两个参数。

```
nodeos --config-dir ./ -c config.ini --data-dir ./telos-data/ --genesis-json genesis.json --delete-all-blocks
```

启动 `nodeos` 后，需要等待从 P2P 节点上同步区块。这可能需要等待较长的时间。可以尝试查看区块网络能否查询刚才在 `Testnet` 创建的帐号。

```
teclos get account prodname1234
```

如果没有返回错误，就可以执行上面的注册 `producer` 的命令。

```
teclos system regproducer prodname1234 TLOS6iheATEZvPMTf5i6EyvU4wAFhG3UNcttF6o7B3qrxh8SYSwLA1
```

注册 `producer` 后，投票选举区块的生产者。一次最多可以投票 30 个。

```
teclos system voteproducer prods prodname1234 prodname1234
```

至此，`Telos` 环境搭建完成。
