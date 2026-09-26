# GaoTianlee 个人网站

GitHub Pages 用户站点，仓库：`GaoTianlee/gaotianlee.github.io`。

目标网址：https://gaotianlee.github.io/

## 目录

- `src/`：React + TypeScript 源码。
- `public/`：图片、下载附件和四张政治研读项目预览图。
- `docs/`：已构建的静态网站，GitHub Pages 发布目录。
- `scripts/prepare-pages.mjs`：生成五个子页面入口、404 页面和 `.nojekyll`。

## GitHub Pages 设置

在 Settings → Pages 中选择 Deploy from a branch，分支 `main`，目录 `/docs`。

首页为 `docs/index.html`。教育、工作、荣誉、社媒、商店均提供独立目录入口，直接访问或刷新子页面不依赖服务器回退规则。`.nojekyll` 禁用 Jekyll 处理。

## 修改与构建

需要 Node.js 22.12 或更新的受支持版本。

```sh
npm ci
npm run dev
npm run build
```

修改源码后运行构建，再提交源码和 `docs/`。推送到 `main` 后由 GitHub Pages 发布。

## 本地预览静态发布文件

```sh
python -m http.server 18882 --bind 127.0.0.1 --directory docs
```

访问 http://127.0.0.1:18882/ 。网站没有服务器后端，作品集的本地编辑保存在当前浏览器，不会同步到 GitHub；对外发布内容需要修改源码并重新构建。外部字体、社媒和项目链接需要联网。

项目不包含 `.env`、账号密码、本地日志、测试截图或 `node_modules`。

## 本次内容更新

- To B项目：个人公司向 / 个人IP向标签，需求线与供给线预览。
- 经济研读：流动性图谱。
- 公司经管实务：公司顶层设计、战略战术、财务体系、经营体系、募资体系、投资体系。战略战术和投资体系链接待补充。
- 小店：筑站（网站制作及其数据接口）、云舵（海外数字基建）。商品价格及服务说明参考用户指定站点；云舵网站入口待补充。
- 参考站：https://gaotianlee.ok.kimi.link/ 。供需及经管图片使用用户提供的附件，经济预览图来自参考站。
