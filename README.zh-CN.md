# Dopa Drill 非官方中文体验版

在小学与初一计算练习中，逐位输入答案，享受逐渐丰富的音乐、角色动作和庆祝动画。

**通用计算 + 苏州教材计算专项。** 首页可选择苏教版三年级上册（2025 秋目录）或苏科版七年级上册（2024 修订目录），分别提供 15 项计算专项与 6 项有理数专项。只覆盖列明的技能，未覆盖单元会明确标注；目录依据见[教材适配基准](docs/zh-CN/TEXTBOOK-BASELINE.md)。通用课程保留原项目编排，能力初测仅用于安排练习。

[打开中文体验版](https://williamwue.github.io/dopa-drill/) · [切换日语](https://williamwue.github.io/dopa-drill/?lang=ja)

## 本地运行

无需安装依赖或构建：

```sh
python3 -m http.server 8000 -d app
```

打开 http://localhost:8000/ 。默认简体中文；设置中可切换日语，也可使用 `?lang=ja`。切换语言刷新页面，已保存的进度保留。

负数使用屏幕 − 键或键盘 `-`。有理数答案约成最简分数，分母为 1 时写整数。分数先输入分母，再输入含负号的分子；带分数先输入整数部分。竖式按高亮位置逐位输入。错误不会扣分，完成基础练习可得 100 分，首次答对率达到 80% 可进入加赛。

## 记录与隐私

记录仅保存在当前浏览器的 localStorage。没有账号、服务器存储或跨设备同步。清除站点数据会丢失记录，更换域名不会自动迁移。

原有技能 ID 保持不变；教材专项使用新增的独立 ID。同源部署替换时可继续读取原版存档；不同网站间不自动共享进度。

## 测试与实现

```sh
node --test tests/*.test.mjs
```

- [中文术语与文案清单](docs/zh-CN/GLOSSARY.md)
- [实现范围与结构](docs/zh-CN/IMPLEMENTATION.md)
- [课程配置接口](docs/curriculum-architecture.md)
- [第一轮验证与部署记录](docs/zh-CN/VERIFICATION.md)
- [教材专项验证与部署记录](docs/zh-CN/TEXTBOOK-VERIFICATION.md)

## 更新体验站

完成源码修改并提交后，运行测试，再构建带内容版本的静态发布包：

```sh
node --test tests/*.test.mjs
git push origin HEAD:zh-cn-preview
release_dir=$(mktemp -d)
python3 tools/build_preview.py "$release_dir"
pages_dir=$(mktemp -d)
git clone --single-branch --branch gh-pages https://github.com/williamwue/dopa-drill.git "$pages_dir"
cp -R "$release_dir/." "$pages_dir/"
git -C "$pages_dir" add --all
git -C "$pages_dir" commit -m "Publish textbook preview"
git -C "$pages_dir" push origin HEAD:gh-pages
```

GitHub Pages 不使用 `_headers` 中的缓存设置。构建工具将脚本、全部相对导入、字典、样式及字体放入同一个 `assets/<内容版本>/` 路径，避免旧缓存与新版混用。不要直接发布未经构建的 `app/` 子树。保留已有版本资源可让已打开的页面继续运行；不强制覆盖远端历史。发布后检查 Pages 构建提交及 `release.json` 版本，并在原域名验证存档升级。

## 上游与许可

基于 [grmchn/dopa-drill](https://github.com/grmchn/dopa-drill)，这是非官方、非商业体验版本。
代码适用 MIT，角色 Dopakichi、Dopa Drill 名称及 Logo 不在 MIT 授权范围内，商业使用须按 [LICENSE](LICENSE) 处理；字体沿用各自 OFL 许可。
