---
date: 2018-03-29 18:21:32
title: 在销售订单创建时使用默认仓库位置
type: post
author: Mino Zang<minoscc+dev@gmail.com>
tags:
  - odoo11
---

首先必须开启开发者模式，找到`Settings -> Technical -> Actions -> User-defined Defaults`路径下，

![](/images/settings-actions.png)

新建一个新的默认值

![](/images/user-defined-defaults.png)

点 Field 搜索更多，`Model`选择`Quotation`, `Field`选`warehouse_id` <br>
Default Value 就是默认值，需要知道目标仓库的id <br>
User和Company是筛选条件，有选的话之后在条件下才会使用默认值 <br>

目标仓库id可以在仓库列表中查看仓库详情，然后看浏览器地址`...web?debug=#id=7&view_type=form...`

然后在sales模块新建Quotations的时候Other Information下的Warehouse就会默认设置好仓库
