---
create_date: "2018-02-25 14:23:29"
update_date: "2018-05-14 10:36:39"
title: "开发组约定规范"
type: "guide"
---

## 目录
-----

* 前言
  * [说明](#what)
  * [系统说明](#systems)
  * [关于「能愿动词」说明](#on-the-use-of-verbs-of-will)
  * [使用软件](#softwares)
* 项目规范
  * [开发和线上环境](#development-environment)
  * [项目代码管理与部署](#version-control-and-deploy)
  * [提交规范](#submit)
* 编码规范
  * [代码风格](#code-styles)
  * [Commit信息指南](#commit)
* 工作规范
  * [协作](#work-together)
* 附录
  * [语义化版本](#tips)

## <a name="what"></a> 说明
-----
这是一套我们约定好的规范，为了:

- 减少不必要的讨论，把精力专注在开发上，提高生产效率
- 最大程度统一开发团队代码书写风格和思路，代码阅读起来如出一辙
- 让其他工程师更容易加入到开发，避免新手错误
- 让我们的累计更多经验，并让其更好传承

## <a name="systems"></a> 名称说明
----
文档中使用了一些系统名称，对应的系统如下:

* 协作系统 - Worktother(Redmine)
* 版本管理系统 - 自建的Gitlab服务
* 聊天软件 - Telegram

## <a name="on-the-use-of-verbs-of-will"></a> 关于「能愿动词」说明
-----
文档中包含一些「能愿动词」，对应解释如下:

* `必须(MUST)` - 绝对，严格遵循
* `绝不(MUST NOT)` - 禁令，严令禁止
* `应该(SHOULD)` - 强烈建议这样做，但不强求
* `不该(SHOULD NOT)` - 强烈建议不这样做，但不强求
* `可以(MAY)` - 可选

详细可以看 [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt)

##### 这是所有参与开发的人员都 **必须** 遵守的唯一规范，有异议可以讨论改正，但在执行的时候 **必须** 严格遵守。

## <a name="softwares"></a> 使用软件
-----

* 系统 - MacOS 10.13
* 开发编辑器 - [Visual Studio Code](https://code.visualstudio.com/)
* MySQL - [Sequel Pro](https://www.sequelpro.com/)
* 开发环境 - [Laradock][3]
* 命令行 - [iTerm](https://www.iterm2.com/)
* 浏览器 - [Google Chrome](https://www.google.com/chrome/)
* git - [Gitkraken](https://www.gitkraken.com/)
* 通信软件 - [Telegram](https://www.telegram.org/)
* api测试 - [Postman](https://www.getpostman.com/)
* 文档 - [Dash](https://kapeli.com/dash)
* 软件管理 - [Brew](https://brew.sh/) & [Cask](https://caskroom.github.io/)
* 效率 - [Alfred](https://www.alfredapp.com/)

目前公司以 **php** 语言为主，在新系统开发时 **应该** 优先选择php实现，一些微服务 **可以** 使用其他语言(python, go)。

* 服务器系统 - ubuntu 14.04/16.04 LTS版本
* PHP - 7.x
* MySQL - 5.7
* 框架 - 优先选择Laravel5.5，[Laravel项目开发规范][2]

## <a name="development-environment"></a> 开发和线上环境
-----
一般情况下，一个项目 **应该** 有以下三个基本环境:

#### Local 开发环境

统一使用[laradock][3]来运行应用

#### Staging 线上测试环境

除了域名和特有配置外，**应该** 和生成环境保持高度一致性

#### Product 线上生产环境

所有在 生产环境 中不需要的东西，为了避免无用的负载，必须严格控制其安装和加载。

出于安全考虑，线上环境 **必须** 只开放以下端口

* 80 HTTP
* 443 HTTPS
* 22 SSH 或其他自定端口

## 项目代码管理与部署
-----

项目代码都 **必须** 上传到 **版本管理系统** 服务器，**版本管理系统** 中项目命名除了专有名字，其他全使用小写，单词使用`-`符号间隔。比如：`dcshop-server` `dcshop-iOS`

同时还会使用 **版本管理系统** 的 **tags**, **milestones** 和 **issues** 功能。

每个版本的文档都会对应一个 **milestone**，优先处理当前版本的 **issues**，并使用 **tags** 标签来标记。

### <a name="tags"></a> Tags 标签说明

* `help wanted` - 在版本内有这个label的优先处理，如果准备处理就去掉`help wanted`然后 **留言**
* `enhancement` - 一些增强功能，属于`feat`或者`perf`类型
* `bug` - 出现的错误，属于`fix`类型
* `documentation` - 文档，属于`docs`类型
* `suggestion` - 意见或建议
* `discussion` - 待定

### 代码版本管理

使用类似git-flow的工作流迭代项目，需维护 `master` 和 `develop` 两个长分支。

分支说明：

* `master` - 针对线上生产环境，**绝不** 直接在此分支提交commit
* `develop` - 对应线上测试环境，也 **绝不** 直接在此分支提交commit
* `hotfix-*` - 基于 `master` 分支，当需要修复生产环境出现的bug的时候会使用，完成后会合并到 `master` 和 `develop` 分支
* `others` - 其他分支已实际的功能来命名，完成后发起 **PR** 请求合并到 `develop` 分支。比如：`fix-array-parse-error` `add-some-feature`

在完成一个版本后会生成 **changelog** 和打上 **tag**

### 项目部署

所以的项目都 **必须** 通过 **CI/CD** 来部署，**绝不** 直接登录到服务器手动更新。步骤为：`提交 -> 测试 -> 部署`

* 线上测试环境 - 当 **develop** 分支更新时触发。除了域名等其他独立应用配置以外，环境 **必须** 和 生产环境 保持高度一致性。
* 线上生产环境 - 当 **master** 分支更新时触发，生产环境不会每天更新，一般会在周一和三更新。

## <a name="submit-guide"></a> 提交规范
-----
### <a name="submit-issue"></a> 如何提交Issue

在你提交一个issue之前，先看issues列表中有没有存在相同的issue，有的话直接在上面留言。<br>
提交的问题确认后会根据紧急程度标记版本里程碑，并会尽快的修复。<br>

提交问题的人麻烦提交尽量详细的信息：

* 比如系统或浏览器信息，什么系统类型android还是iOS
* 想要进行的操作
* 本来应该的结果是怎样
* 实际的结果是怎样
* 有截图那就最好

**一句话的问题会被无视。**

```
啊，不能登录了。。。
```

### <a name="submit-pr"></a> 提交Pull Request (PR)

在 **版本管理系统** 上发起 **PR** 后都 **不该** 自行关闭，需要更新也在当前的 **PR** 中更新。

在你提交一个PR之前，请遵循下列步骤：

1. 在对应的issue中回复说明你正在处理这个issue
2. 使用最新的develop分支创建新的分支
3. 代码遵循[代码风格](#code-styles)
4. 在提交前，功能测试过没有问题
5. PR

提交后如果需要修改：

* 按需求更新代码
* 确保更新代码后，需要提交的功能没有错误
* rebase你的分支和强推到 **版本管理系统**，PR会自动更新

```
git rebase develop -i
git push -f
```

提交的PR合并后，删除分支别留在 **版本管理系统** 上，同时记得更新本地的项目

## <a name="code-styles"></a> 代码风格
-----

* 文档统一使用 **markdown** 格式
* 使用 **editorconfig** 统一IDE的配置
* 遵循统一的代码风格 `@PSR2` `standard`
* 代码中 **可以** 使用一些关键字：`TODO` `FIXME` `NOTE` 等

## <a name="commit"></a> Commit信息规范
-----
`commit` 提交信息 **必须** 遵守格式规范，确保每个 `commit` 都只处理单纯的一个问题

### Commit信息格式

名词说明:

* `type(scope?): subject` - 页头
* `type` - 类型
* `scope` - 作用域
* `subject` - 主题
* `body` - 内容
* `footer` - 页脚

每个 `commit` 信息包含一个 **页头**，一个 **内容** 和一个 **页脚**。**页头** 有一个特定的格式包含一个 **类型**，一个 **作用域** 和一个 **主题**:

```
type(scope?): subject
空行
body?
空行
footer?
```

页头必填，除了 **作用域** 选填

如果有需要[关闭某个issues][1]，在页脚 **footer** 中填写

例子:

```
feat: 添加google登录功能
```

或者:

```
fix(login): 修复cookies引起用户不能登录

巴拉巴拉，快速登录时cookies会导致用户无法登录。。。
```

### Revert回退

如果需要回退之前的 `commit`，页头 **应该** 已`revert:`开头，后面跟已经回退的那个commit的页头信息，在内容中带上回退的 `commit` 的 `hash` 值。

*gitkraken的revert功能会自动commit，没有revert开头，带有hash值*

### Type类型

页头中的类型 **必须** 是下列其中一个：

* `chore` - 杂事，不会显示到log
* `fix` - 修复bug
* `feat` - 新的功能
* `docs` - 文档更新
* `ci` - 更新CI配置和脚本的时候
* `perf` - 更新代码提高性能
* `refactor` - 重构，更新代码既不是修复bug也不是添加新功能
* `test` - 添加新的测试或更新现有的
* `style` - 更新风格而且不影响代码功能（空格，格式，引号等）
* `build` - 更新构建系统或其它依赖库（gulp, composer, npm等）

### Scope作用域

作用域应该是一些库和模块定义的名词

* 模块名称，使用项目中模块文件夹或类的名称
* 第三方库的名词，使用包管理工具上的名词，怎么安装的用怎么名字
* 一些类型可以留空，比如`style`,`test`和`refactor`的更新可能涉及到所有的模块

### Subject主题

主题尽量简短的描述清楚提交的内容，不要使用标点符号，可以使用 `\`` 符号

### Body内容

如需要提交内容信息，内容中需要描述清楚和更改之前有什么更新。

如果这个提交改了很多东西，比如改了接口会直接让其他模块或用户无法使用。需要在内容开始加`BREAKING CHANGE:`，字母全大写。

### Footer页脚

页脚的带一些需要关联的 **版本管理系统** 任务，或者需要关闭的任务。（比如：close, fix, fixes, resolve...)

详情可以看关闭任务的关键字 [closing-issues-using-keywords][1]

### 为什么要规范提交

* 自动生成日志
* 自动遵守语义化版本规范
* 传达准确的信息给其他工程师
* 掌握开发和发布的过程

## <a name="work-together"></a> 协作
-----

### 出勤

* 无论前一天加班或者其他一些情况，正常时间 **09:40** 无法到公司，**必须** 通知负责人，**可以** 发个信息通知

### 请假

* 请假 **必须** 提前在 协作系统 中提交申请，由负责人批准后才是正常申请，口头通知无效
* 特殊情况也 **应该** 及时通知负责人，并事后补请假申请。没有提前申请的属于无故旷工，会根据情况追究责任

请假任务格式：姓名 + 日期 + 理由
```
黄小明 4月4号上午 去银行办事
```

### 工作交流

* 一般的工作交流 **应该** 在 **聊天软件** 中沟通，**绝不** 大小事情都直接跑去问人
* 有需要讨论的事情，到会议室讨论，会议前 **应该** 问对方是否有空或 **提前** 通知
* 发现问题 **及时反馈**，避免浪费时间影响项目进度

### 资源分享

* 工作文档无论向谁汇报都 **必须** 抄送给负责人
* 执行的文档 **必须** 保证唯一性
* 文件 **必须** 在 **Google Dirve** 项目下统一管理，分享链接和控制权限

### 工作指派

项目开发 **必须** 严格遵守产品文档，一切以确定过的文档为主，聊天信息无效

* 需求不明确，没有确定过产品文档的情况下，工程师 **必须** 拒绝进行开发
* 开发和交付都 **必须** 严格按照文档进行，功能如果需要调整只能做减法，不做加法，确保版本按时或提前上线
* 如果工程师偏离了文档开发，其成本由工程师额外承担
* 工程师 **必须** 拒绝添加当前版本文档外的新功能
* 开发任务都会在 **版本管理系统** 指派，其他任务在 **协作系统**，其余方式的指派都 **应该** 不执行
* 其他部门需要协助 **必须** **提前** 通知负责人，其他工程师 **必须** 拒绝执行

什么时候应该马上动手？

* 直接影响系统运营问题
* 系统或服务器发现安全问题

## 附录
-----
### <a name="semver"></a> 语义化版本

[语义化版本 SemVer](https://semver.org/lang/zh-CN/)

### <a name="#git"></a> git

工程师需要熟悉git的使用，如果命令行不熟，可以使用工具来操作。[gitkraken](https://www.gitkraken.com/)

* [git-tips](https://github.com/git-tips/tips)
* [git-scm](https://git-scm.com/book/zh/v2)
* [猴子都能懂的git教程](http://backlogtool.com/git-guide/cn/)
* [git-flow](https://github.com/nvie/gitflow)
* [git-flow-cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html)

[1]: https://help.github.com/articles/closing-issues-using-keywords/ "用关键字关闭issues"
[2]: https://laravel-china.org/docs/laravel-specification/5.5 "laravel项目开发规范"
[3]: https://github.com/laradock/laradock "docker开发环境"
