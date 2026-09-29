# Dopa Drill 非官方中文体验版

在小学计算练习中，逐位输入答案，享受逐渐丰富的音乐、角色动作和庆祝动画。

**通用计算练习，教材适配中。** 当前沿用原项目课程编排，尚未对应中国教材具体版本、年级学期和单元。能力初测仅用于安排练习。

## 本地运行

无需安装依赖或构建：

```sh
python3 -m http.server 8000 -d app
```

打开 http://localhost:8000/ 。默认简体中文；设置中可切换日语，也可使用 `?lang=ja`。切换语言刷新页面，已保存的进度保留。

分数先输入分母，再输入分子；带分数先输入整数部分。竖式按高亮位置逐位输入。错误不会扣分，完成基础练习可得 100 分，首次答对率达到 80% 可进入加赛。

## 记录与隐私

记录仅保存在当前浏览器的 localStorage。没有账号、服务器存储或跨设备同步。清除站点数据会丢失记录，更换域名不会自动迁移。

技能 ID 与原版保持一致。同源部署替换时可继续读取原版存档；不同网站间不自动共享进度。

## 测试与实现

```sh
node --test tests/*.test.mjs
```

- [中文术语与文案清单](docs/zh-CN/GLOSSARY.md)
- [实现范围与结构](docs/zh-CN/IMPLEMENTATION.md)
- [课程配置接口](docs/curriculum-architecture.md)
- [验证与部署记录](docs/zh-CN/VERIFICATION.md)

## 上游与许可

基于 [grmchn/dopa-drill](https://github.com/grmchn/dopa-drill)，这是非官方、非商业体验版本。
代码适用 MIT，角色 Dopakichi、Dopa Drill 名称及 Logo 不在 MIT 授权范围内，商业使用须按 [LICENSE](LICENSE) 处理；字体沿用各自 OFL 许可。
