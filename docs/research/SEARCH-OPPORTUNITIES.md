# 英文站方向：Google Trends 与 Bing 复查

采集日期：2026-09-30。原始页面数据见 `search-opportunities-2026-09-30.json`。

## 结论

值得做一个独立品牌的小规模英文试玩站，首个测试方向为有连击、奖励演出和可分享成绩的短局心算挑战。搜索数据支持继续验证心算需求，但没有证明 Dopa Drill 品牌搜索已经爆发，也没有证明新站容易排名或能够盈利。

英文翻译、免费免登录、技能树、每日任务本身均不是充分差异。把短局体验和复玩率作为首轮验证目标，再扩展针对运算类型的独立页面。

## 原站与直接竞争

- [原作者站](https://dopa-drill.tanosix.com/)：此次打开为日文；首页有 1–6 年级、58 技能、306 奖杯、收藏、每日任务和连续记录。设置有题数、声音、动效强度、演示播放，本次未见语言切换。不据此断言全站永远不支持英文。
- [非官方英文 fork](https://github.com/elatd/math-drill)：已被 Bing 收录。直接读取 README，确认英文默认、日英切换、英文题意和数字单位适配，但年级依然按日本课程。README 不能证明实际使用量。
- Bing 的 `dopa drill` 结果还包括原站、英文介绍文章、英文版发布帖和同域攻略书。搜索结果数量不等于需求量；本文没有将其用于估算搜索量。
- 原项目代码 MIT，品牌与角色另有条款。独立正式品牌应采用自己的名称和角色，或取得所需授权。

## Google Trends

设置：全球、过去五年、所有类别、网页搜索、搜索字词（不是 Topic）。比较最近 52 个完整周（2025-09-28 至 2026-09-20）与之前 52 周（2024-09-29 至 2025-09-21），排除 2026-09-27 开始的不完整周。均值由页面时间序列表计算。

[主要比较组](https://trends.google.com/trends/explore?date=today%205-y&q=mental%20math,multiplication%20games,math%20facts,speed%20math,arithmetic%20game&hl=en)：

| 字词 | 前 52 周均值 | 最近 52 周均值 | 变化 |
|---|---:|---:|---:|
| mental math | 27.46 | 48.27 | +75.8% |
| speed math | 20.79 | 41.85 | +101.3% |
| math facts | 34.38 | 39.92 | +16.1% |
| multiplication games | 31.63 | 32.54 | +2.9% |
| arithmetic game | 2.60 | 16.92 | +551.9% |

`arithmetic game` 基数小，且 Bing 对应 Zetamac 的具体产品标题，不能把其增长全算作通用市场。`mental math` 相关查询中同时有 Zetamac 和明显不相关的噪声。`speed math` 的相关查询出现 `speed math test`，与限时练习产品形态匹配。

[需求细分组](https://trends.google.com/trends/explore?date=today%205-y&q=math%20facts,math%20fluency,times%20tables%20games,math%20games%20for%20adults,math%20games%20for%20kids&hl=en)：`math fluency` 同比约 +18.9%；`times tables games` +11.4%；`math games for kids` +3.8%。`math games for adults` +200%，但均值仅从 1.42 到 4.27，基数小，不宜凭增长率把产品全面转向成人。

[品牌组](https://trends.google.com/trends/explore?date=today%203-m&q=dopa%20drill,%E3%83%89%E3%83%91%E3%83%89%E3%83%AA%E3%83%AB,dopamine%20math&hl=en)：全球过去 90 天，数据稀疏，相关查询不足。日文词 9 月 28、29 日有小幅信号；英文词出现早于原帖的孤立峰值，不能归因于这次传播。`dopamine math` 的信号也早于原帖，而且 Bing 意图混杂。当前无法据此验证品牌搜索爆发。

美国地区补查的时间序列卡片返回错误，仅部分地区/相关词卡片可见，因此未计算美国增长，也未据此做美英市场强弱判断。

Trends 是归一化、抽样、取整的相对指数，不是搜索次数、用户数或收入。不同组的指数不可直接比较。近一年增长早于此次帖子，不能归因为帖子影响。

## Bing 搜索意图与方向

本次用英文界面和美国地区参数查首屏结果；它是竞争与意图抽样，不能代表全球排名，也不提供关键词搜索量或排名难度。

| 查询 | 实际出现的结果 | 对上线方向的含义 |
|---|---|---|
| [dopa drill](https://www.bing.com/search?q=dopa+drill&setlang=en-US&cc=US) | 原站、英文 fork、介绍文章、攻略书 | 官方去向已经明确，英文也已有供给；不推荐依赖原品牌导航搜索 |
| [dopamine math game](https://www.bing.com/search?q=dopamine+math+game&setlang=en-US&cc=US) | 神经科学模拟器、心理健康游戏、DopaMath 项目、点击游戏 | 意图分散，不足以成为主 SEO 词；适合当传播描述测试 |
| [speed math test online](https://www.bing.com/search?q=speed+math+test+online&setlang=en-US&cc=US) | speedmathtest.com、mathspeedtest.com、Math is Fun、Zetamac | 可直接玩的工具型结果，需求匹配，但已有大量竞争 |
| [multiplication games free no login](https://www.bing.com/search?q=multiplication+games+free+no+login&setlang=en-US&cc=US) | Timestables.com、times-tables.org、FreeMathPractice 等 | 适合做乘法表专项；免费和免登录已常见 |
| [math facts practice no login](https://www.bing.com/search?q=math+facts+practice+no+login&setlang=en-US&cc=US) | Play Math Facts、Math Minute、Num Drill、练习纸工具 | 按技能选择、短练习和进度记录是常见供给；需要玩法区别 |
| [integer operations game negative numbers](https://www.bing.com/search?q=integer+operations+game+negative+numbers&setlang=en-US&cc=US) | Math Minute、COKOGAMES、Math Salamanders、Math Play、教学材料 | 可利用现有负数题型做后续专题；本轮没有验证其搜索量或增长 |

直接访问 [Zetamac](https://arithmetic.zetamac.com/) 确认它有四则运算、数值范围和 30/60/120/300/600 秒选择。访问 [Speed Math Test](https://speedmathtest.com/) 确认有按运算与难度划分的入口；页面介绍已有免注册、本地统计等功能。这些页面自述的教学效果和用户构成未作独立验证。

## 建议首发范围

1. 首个主体验：60 秒心算挑战，英文，手机/键盘可用，自有视觉品牌，连击与奖励升级，结果可分享。60 秒是待测试的产品选择，不是 Trends 证明的最优时长。
2. 首批搜索入口：`/speed-math/`、`/multiplication-games/`、`/math-facts/`。每页预设相应玩法并提供独立说明，不做只有关键词不同的重复页面。
3. 后续入口：`/integer-games/`，复用已经实现的带符号运算，但先验证使用情况。
4. 域名优先短且可扩展的独立品牌；本轮没有核验候选域名可注册性、价格或商标，不建议为抢热点购买高价域名。
5. 先看访问到开始、开始到完成、完成到再玩以及次日回访，再用 Search Console/Bing Webmaster Tools 的真实查询与展示决定扩展页面。当前是研究建议，尚未实施或购买域名。
