---
date: 2018-06-13 17:06:39
title: MariaDB Galera Cluster 使用指南
author: Liang Suilong <liangsuilong@gmail.com>
type: post
tags: 
  - mariadb
  - galera
---
## 目录
-----

* [Galera 集群简介] (#galera-cluster-introdution) 
* [安装 MariaDB] (#install-mariadb)
* [配置 Galera] (#setting-galera)
* [初始化 Galera 集群] (#initial-galera-cluster)
* [测试 Galera 集群] (#test-galera-cluster)
* [故障恢复] (#malfunction-recovery)

## <a name="galera-cluster-introduction"></a> Galera 集群简介
-----

Galera Cluster 是 Codership 公司开发的一套开源的 MySQL 高可用方案，其本身具有 Multi-Master 特性，支持多点写入。Galera Cluster的三个（或多个）节点是对等关系，每个节点均支持写入，集群内部会保证写入数据的一致性与完整性，具体实现原理会在本篇中做简要介绍。
官方给出的特性如下：

* 真正的多主集群，Active-Active 架构
* 同步复制，没有复制延迟
* 多线程复制
* 没有主从切换操作，无需使用虚IP
* 热备份，单个节点故障期间不会影响数据库业务
* 支持节点自动加入，无需手动拷贝数据
* 支持InnoDB存储引擎
* 对应用程序透明，原生MySQL接口
* 无需做读写分离
* 部署使用简单

![ MariaDB Galera Cluster 架构图](/images/mariadb-galera-architecture.png)

MariaDB Galear Cluster 原理可参考：[Galera Cluster 原理](https://segmentfault.com/a/1190000013652043)

## <a name="install-mariadb"></a> 安装 MariaDB
-----

本次安装采用两台机器作为 MariaDB 节点。两个节点都是 Ubuntu 16.04，两个节点都执行相同的命令安装 MariaDB。

* mariadb1 192.168.122.239
* mariadb2 192.168.122.97

首先添加 MariaDB 软件源，这里采用清华大学 TUNA 协会的软件源。

```
sudo apt-get install software-properties-common
sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
sudo add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://mirrors.tuna.tsinghua.edu.cn/mariadb/repo/10.3/ubuntu xenial main'
```

然后安装更新软件仓库数据库和安装 MariaDB

```
sudo apt-get update
sudo apt-get install mariadb-server
```

* 注意：安装时输入 MySQL 的 root 密码请保持各个节点一致。

## <a name="setting-galera-cluster"></a> 配置 Galera 集群
-----

打开节点 `mariadb1` 和 `mariadb2` 节点的 `/etc/mysql/my.cnf` 配置文件，编辑 `galera` 段落。内容可参考如下：

```
[galera]
wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so
wsrep_cluster_address="gcomm://192.168.122.239,192.168.122.97"
binlog_format=row
default_storage_engine=InnoDB
innodb_autoinc_lock_mode=2
bind-address=0.0.0.0
wsrep_slave_threads=1
```
* wsrep_on: Galera 开关。
* wsrep_provider: Galera 的库文件地址。
* wsrep_cluster_address: Galera 节点地址。
* binlog_format: 二进制日志格式，Galera 集群要求使用 `row` 格式的二进制日志。
* default_storage_engine: 默认存储引擎，Galera 集群支持 InnoDB 存储引擎的数据表。
* innodb_autoinc_lock_mode: InnoDB 生成自增值的锁模式，需要确保使用交互模式，赋值应该是 `2`。
* bind-address: MariaDB 绑定地址，一般认为需要改成 `0.0.0.0`，但为避免数据库服务器暴露到公网，建议如果有内网通信地址，帮
* wsrep_slave_threads: Galera 复制线程数量。

## <a name="initial-galera-cluster"></a> 初始化 Galera 集群
-----

配置好 Galera 集群以后，在 mariadb1 执行以下命令初始化 Galera 集群。

```
sudo galera_new_cluster
```

mariadb1 节点成功启动后，在 mariadb2 执行以下命令启动 MariaDB 节点。

```
sudo systemctl start mariadb
```

第二个节点启动成功后，至此 MariaDB Galera Cluster 完成部署。

## <a name="test-galera-cluster"></a> 测试 Galera 集群
-----

测试 Galera 集群是为了验证在一个节点上的操作，是否同步到另外一个节点上。

首先在 mariadb1 节点创建名叫 mariadb 的数据库，并创建 mariadb_test 的测试表，写入两条数据库记录。

```
CREATE DATABASE IF NOT EXISTS `mariadb`;

USE mariadb;

CREATE TABLE IF NOT EXISTS `mariadb_test`(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `user` VARCHAR(100) NOT NULL,
   `title` VARCHAR(40) NOT NULL,
   `date` DATE,
   PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `mariadb_test`(`id`, `user`, `title`, `date`) VALUE (1, `test_user`, `test`, now());
INSERT INTO `mariadb_test`(`id`, `user`, `title`, `date`) VALUE (1, `test_user`, `test`, now());
```

在 mariadb2 节点查看数据库列表。

```
SHOW DATABASES;
```

结果显示 mariadb 已经从 mariadb1 节点同步到 mariadb2 节点。

```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mariadb            |
| mysql              |
| performance_schema |
+--------------------+
```

在 mariadb2 节点查看 mariadb 数据库下的数据表列表。

```
USE `mariadb`;
SHOW TABLES;
```

结果显示 `mariadb_test` 也从 mariadb1 节点同步到 mariadb2 节点。

```
+-------------------+
| Tables_in_mariadb |
+-------------------+
| mariadb_test      |
+-------------------+
```

在 mariadb2 节点查询 mariadb_test 数据表的数据。

```
SELECT * FROM `mariadb_test`;
```

结果显示两条记录已经从 mariadb1 节点同步到 mariadb2 节点。

```
+----+-----------+-------+------------+
| id | user      | title | date       |
+----+-----------+-------+------------+
|  1 | test_user | test  | 2018-06-22 |
|  2 | test_user | test  | 2018-06-22 |
+----+-----------+-------+------------+
```

在 mariadb2 节点删除 mariadb_test 数据表的一条记录。

```
DELETE FROM `mariadb_test` where `id`=1;
```

在 mariadb1 节点查询数据表的数据。

```
SELECT * FROM `mariadb_test`;
```

mariadb1 上的 mariadb_test 数据表已经同步删除同一条记录。

```
+----+-----------+-------+------------+
| id | user      | title | date       |
+----+-----------+-------+------------+
|  2 | test_user | test  | 2018-06-22 |
+----+-----------+-------+------------+
```

在 mariadb2 节点删除 mariadb_test 数据表。

```
DROP TABLE `mariadb_test`;
```

在 mariadb1 节点查看数据表。

```
SHOW TABLES;
```

结果显示 mariadb1 节点已经删除 mariadb_test 数据表。

```
Empty set (0.000 sec)
```

在 mariadb2 节点删除 mariadb 测试数据库。

```
DROP DATABASE `mariadb`;
```

在 mariadb1 节点查询数据库列表。

```
SHOW DATABASES;
```

结果显示 mariadb1 节点已经删除数据库。

```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
```

测试结果显示，MariaDB Galera 集群两个节点之间的数据同步能正常工作。

## <a name="malfunction-recovery"></a> 故障恢复
-----

一般情况下，如果集群中部分节点因故障离线，修复好重新启动就会自动重新加入集群并同步数据。如果出现所有节点离线，则需要在第一个启动的节点进行处理。

打开 `/var/lib/mysql/grastate.dat`，把 `safe_to_bootstrap` 的值从 `0` 改成 `1` 并保存。

```
# GALERA saved state
version: 2.1
uuid:    a74a2d75-6ee1-11e8-8316-fb2d1c77f8cd
seqno:   -1
safe_to_bootstrap: 1
```

下一步是重新启动集群。执行 `galera_new_cluster` 命令。

```
sudo galera_new_cluster
```

成功启动集群后，`/var/lib/mysql/grastate.dat` 中的 `safe_to_boostrap` 值会从 `1` 自动变成 `0`。然后逐一正常启动其余节点，MariaDB Galera Cluster 就会自动恢复起来。

常见的 MariaDB Galera Cluster 故障恢复场景可参考这篇文章： [Galera 集群恢复的七种场景](http://zjzone.cc/index.php/2017/04/16/galera-ji-qun-hui-fu-di-chang-jian-qi-zhong-chang-jing/)。
