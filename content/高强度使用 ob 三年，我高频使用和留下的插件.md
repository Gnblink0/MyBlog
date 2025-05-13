+++
author = "关念"
title = "高强度使用 ob 三年，我高频使用和留下的插件"
date = "2024-06-22"
description = ""
categories = [
    "攻略"
]
tags = [
    "obsidian",
	"生产力",
    "攻略",]
image = "https://picture-guan.oss-cn-hangzhou.aliyuncs.com/20240622151037.png"

+++

## 前言

自从 21 年 9 月第一次听说和接触以来，我已经高强度使用 obsidian 三年多。

这三年以来，只要我需要编辑文字内容，只要我摸得到电脑，几乎是每日必用，obsidian 已经成为了我名副其实、必不可少的「第二大脑」。

**而插件又是 obsidian 不可或缺的一部分**。

obsidian的开发者在 [about us](https://obsidian.md/about) 里用几个特点概括了 obsidian，其中之一就是 Malleable（可塑的），we design our tools to be highly customizable and extensible, so you can shape them to your unique needs. 我们设计的工具具有高度的可定制性和可扩展性，你可以根据自己的独特需求进行调整。而另一个特点是 Durable（耐用的）——ob 想要尽可能地兼容原生的 md 格式，所以没有封装太多自带功能，而是开放和鼓励大家开发和使用第三方插件满足个性化需求。

所以，你能想象吗，在ob 里，有一个免费插件可以通过自行配置第三方储存来实现无缝、快速的跨设备同步，比 ob 官方的付费同步还要好用，而同步是 ob 唯二收费的服务 aka 赚钱手段，但ob 官方却对此无所谓。

ob 的高自由度有利有弊，这就像房子一样，有些人喜欢拎包入住，有人喜欢自己装修，喜欢的人觉得折腾 ob 其乐无穷、戏称 ob 为“前端训练营”，不喜欢的人认为 ob 自带功能太少使用变扭、折腾插件很麻烦。

在我看来，虽然原始状态的简洁 ob 并不代表家徒四壁，但是用 ob 却不装任何插件类似买了新房却一直住毛坯，你拥有如此广阔的自定义可拓展空间，you deserve better！

## 如何安装插件

本着不重复制造轮子的原则，请参考前人文章：
- [如何安装obsdiain插件 - Obsidian中文教程 - Obsidian Publish](https://publish.obsidian.md/chinesehelp/01+2021%E6%96%B0%E6%95%99%E7%A8%8B/%E5%A6%82%E4%BD%95%E5%AE%89%E8%A3%85obsdiain%E6%8F%92%E4%BB%B6)
- [2022年3月如何安装obsidian插件（阶段性总结） - Obsidian中文教程 - Obsidian Publish](https://publish.obsidian.md/chinesehelp/01+2021%E6%96%B0%E6%95%99%E7%A8%8B/2022%E5%B9%B43%E6%9C%88%E5%A6%82%E4%BD%95%E5%AE%89%E8%A3%85obsidian%E6%8F%92%E4%BB%B6%EF%BC%88%E9%98%B6%E6%AE%B5%E6%80%A7%E6%80%BB%E7%BB%93%EF%BC%89)

提醒：官方社区打不开，挂个梯子就能解决了

后面的推荐，官方社区可以搜到的请先直接搜索名字，否则再考虑从 GitHub 下载

## 推荐插件

### 备份

备份是最重要的文件管理功能之一，可惜 obsidian 自带的备份并不好用，所以如果决定开始折腾插件，一定要先把备份问题解决。

我把 ob 安利给大学同学的时候，几个人都惨痛丢失过文件，找我帮忙但最后也没有找回来……只能安慰安慰并且帮她们搞好备份防止下一次惨剧。

千言万语汇成一句：**记！得！备！份！**

强烈建议配置下面的 git 备份，只要不到半个小时，之后都不用操心了，而且每几分钟/几十分钟就备份一次，丢失文件概率大大降低，用于版本控制也很方便。

如果你懒得配置下面的自动 git 备份，可以定期手动在本地拷贝一下或者拖进云盘

不能没有备份！
#### 备份插件：Git 

[Vinzent03/obsidian-git: Integrate Git version control with automatic backup and other advanced features in Obsidian.md](https://github.com/Vinzent03/obsidian-git)

详细操作请看：[一种 Obsidian vault 自动备份方法](https://www.edony.ink/auto-backup-obsidian-vault/)


### 同步

同步是一个非必要但是需求很强的功能。

官方同步：一年 400 人民币，不肉疼可以支持一下。我尝试过购买，因为手机等待同步太慢，最后退款了。

很多人用iCloud，但我明确不建议用，因为我一开始就是用的iCloud，受了不少苦吃了不少亏。

#### 同步插件：Remotely Save



#### Auto Link Title

推荐指数：🌕🌕🌕🌑🌑

> [zolrath/obsidian-auto-link-title: Automatically fetch the titles of pasted links](https://github.com/zolrath/obsidian-auto-link-title)
> 
> This plugin automatically fetches the titles of links from the web
>
> 该插件可自动从网上获取链接标题

外链粘贴进 md 之后本身只是一串链接，这个插件可以自动获取网页标题+格式化显示

[![Auto linking example](https://github.com/zolrath/obsidian-auto-link-title/raw/main/auto-link-title.gif)](https://github.com/zolrath/obsidian-auto-link-title/blob/main/auto-link-title.gif)

其实关于这个使用场景，我更推荐一个 chrome 插件，叫做 [TabCopy](https://chromewebstore.google.com/detail/tabcopy/micdllihgoppmejpecmkilggmaagfdmb)，在当前网页上点两下就能生成 md 格式的外链（如下），直接粘贴到 ob 里就好。

![image.png](https://picture-guan.oss-cn-hangzhou.aliyuncs.com/20240622140557.png)

`[TabCopy](https://chromewebstore.google.com/detail/tabcopy/micdllihgoppmejpecmkilggmaagfdmb)`

因为 Auto Link Title 有时抓取失败的概率还挺高，而 TabCopy 则因为已经渲染出了网页，抓取成功率接近 100%。


#### Auto Note Mover

推荐指数：🌕🌕🌕🌑🌑

> [farux/obsidian-auto-note-mover: This is a plugin for Obsidian (https://obsidian.md).](https://github.com/farux/obsidian-auto-note-mover)
> 
> Automatically move the active notes to their respective folders according to rules you set.
> 
> 根据设定的规则，自动将笔记移动到指定的文件夹中。

高频使用的场景：
- 日记笔记，一旦创建格式符合 YYYY-MM-DD 的笔记，就自动移到<日记文件夹>中



### Better Core Plugins

ob 的插件分为核心插件 (core plugins) 和社区插件 (community plugins) ，前者是 ob 安装后自带的，后者是大家自己开发、需要额外下载的，这篇文章只介绍社区插件。

然而，有一类社区插件是专门代替核心插件，使其更好用的，建议无脑下载。

打开社区插件之后，记得把它代替的核心插件关掉，而且修改一下快捷键，避免造成冲突。

#### Quick Switcher++：代替文件跳转

高频使用的场景：
- 把最近使用过的命令放在最上面方便选择
#### Better Command Palette：代替命令面板

高频使用的场景：
- 可以用井号搜 heading 标题


#### Quiet Outline：代替大纲 (Outline)

推荐指数：🌕🌕🌕🌕🌕

> [guopenghui/obsidian-quiet-outline: Improving experience of outline in Obsidian](https://github.com/guopenghui/obsidian-quiet-outline)
> 
> Make outline quiet and more powerful, including no-auto-expand, rendering heading as Markdown, and search support.
> 
> 让大纲更安静、更强大，包括自动展开、将标题显示为 markdown 以及搜索支持。

高频使用的场景：
- 我的首要需求就是一些学习笔记太长了，一页有上万字几十个标题，每次都要在大纲里找知识点找到眼瞎，希望能高亮显示我在的标题。这个插件不仅做到了，而且还能根据所在位置自动展开和折叠大纲层级，很优雅很爽，不愧quiet  
- 支持搜索标题
- 用彩虹色显示标题层级

![ https://raw.githubusercontent.com/guopenghui/obsidian-quiet-outline/master/public/auto_expand.gif ]( https://raw.githubusercontent.com/guopenghui/obsidian-quiet-outline/master/public/auto_expand.gif " https://raw.githubusercontent.com/guopenghui/obsidian-quiet-outline/master/public/auto_expand.gif" )


### 文字编辑

#### ZH 编辑增强 - 蚕子

推荐指数：🌕🌕🌕🌕🌕

[GitHub - obsidian-canzi/Enhanced-editing: Enhanced Editing Plugin](https://github.com/obsidian-canzi/Enhanced-editing)


高频使用的场景：
- ocr 经常把中文逗号识别成英文逗号，它可以「英文标点转中文标点」
- 可以「繁简转换」
-  ocr 经常把换行识别成断行，它可以「修复断行」
- 复制微信公众号文章经常段落间有太多空行，它可以「去除空行」
- kindle 摘录会把段落换行变成空格，几段粘成一坨很不利于阅读，它可以「识别空格拆分成段」（是我提的建议，作者人真的很好）
- 可以「选中文本后一键转换成别名链接」，即 `[[|选中文本]]`（光标自动位于竖线左边）
- 可以「一键选择当前段落」
- 可以「转换和复制无 markdown 语法文本」


#### Easy Type

推荐指数：🌕🌕🌕🌕🌕

[Yaozhuwa/easy-typing-obsidian：这是一个obsidian插件，方便用户打字。](https://github.com/Yaozhuwa/easy-typing-obsidian)

针对中文和各种符号的输入优化，日常在ob输入编辑大量中文必装，大幅提升打字体验

### 日记相关插件
#### Daily Notes Viewer

> [Johnson0907/obsidian-daily-notes-viewer](https://github.com/Johnson0907/obsidian-daily-notes-viewer)
> 
> Help you to view some recent daily notes on one page.
> 
> 帮助您在一页中查看最近的日记。

推荐指数：🌕🌕🌕🌕🌕

用过 logseq 的朋友都知道，logseq 有一个 journal 模式非常好用，会在一页里滚动显示所有 daily note。

用这个插件就可以在 obsidian 里实现这个功能。

[![demo](https://github.com/Johnson0907/obsidian-daily-notes-viewer/raw/master/img/demo.png)](https://github.com/Johnson0907/obsidian-daily-notes-viewer/blob/master/img/demo.png)

体验很不错：
- 是用 `![ ]` 引用的方式显示的，没有额外的 ui，非常原生和简洁
- 可以实时更新新的日记
- 我把 recent quantity 设置到 1000 之后可以显示我的所有日记笔记（其实也才一百多条），不知道更多之后会不会卡

#### Calendar

> [liamcain/obsidian-calendar-plugin: Simple calendar widget for Obsidian.](https://github.com/liamcain/obsidian-calendar-plugin)
> 
> Calendar view of your daily notes
> 
> 日记的日历视图
### 花里胡哨美化插件

#### Buttons

> [shabegom/buttons: Buttons in Obsidian](https://github.com/shabegom/buttons)
> 
> Create Buttons in your Obsidian notes to run commands, open links, and insert templates
> 
> 在 obsidian笔记中创建按钮，以运行命令、打开链接和插入模板

就是字面意思，创建能运行命令的按钮。我觉得适合做主页美化，平时使用的话不如直接命令面板快一点。我下载这个是因为要做一个书库，其中一个按钮是从豆瓣导入书的数据，
### 其他非常出名但我日常并未使用的

由于我喜欢各司其职而不推崇 all in one 概念，所以我只是把 obsidian 当成信息库、知识库、第二大脑、md 文件编辑器使用，并不在 obsidian 内进行任务管理，所以很多类似 kanban、timeline、的插件很火，但我都没有使用。