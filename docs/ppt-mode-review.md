# 图片转可编辑 PPT · 1.9.0

新增模式直接接入官方 [image-to-editable-ppt](https://github.com/ningzimu/image-to-editable-ppt-skill)，不内置另一套重建算法。检查上游版本：b7be494e31a0ed56ef98716891db5474606b8cdf；安装按钮从官方仓库获取 skill，完整保留 references、prompts、scripts 和 cli。

## 使用

1. 安装1.9.0后完全重启 DSH。
2. 设置 → 生图配置 → 图片转可编辑 PPT：安装官方 skill，再安装运行环境（需要 Python 3.10+，首次联网下载安装依赖）。已有 skill 可更新，再修复运行环境。
3. 配置 PaddleOCR token（可选）和兼容图像 API（已有有效 Codex OAuth 时可省略），点「保存并应用」。配置写入 skill 自己的 `~/.editppt/config.yaml`；secret 不回显，不写入任务清单或提示词。
4. DSH 设置默认模型；技能开关和长任务开关需开启。Agent 预设应包含文件/命令工具，多页转换还需要子 Agent。模型配置与生图模型配置是两回事：前者驱动重建 Agent，图像 API 用于修复背景/分离素材。
5. 打开图片转 PPT，上传、排序图片，选择 OCR 方式，生成；也可从文生图/图生图/多模型结果点击「生成可编辑 PPT」带入图片。画廊、历史的放大预览同样可带入。

## 界面

以下截图来自真实 React 组件及 CSS，内容与完成状态使用本地夹具，不代表真实模型转换结果。

![PPT模式](images/ppt-mode.png)

![PPT配置](images/ppt-settings.png)

## 运行及验证边界

转换复用现有 SkillRunner 的串行队列、宿主默认 Agent 预设和取消机制；输入落盘为按顺序命名的图片。提示词包含完整 skill 原文及绝对入口路径，要求按原流程 finalize 后仅交付最终文件。离线选择使用上游 prepare --no-text-hints + page hints，不修改全局 OCR 配置。结果存储复用现有资产接口，独立记录保存在数据目录 ppt-tasks。

已检查：类型、构建、完整 smoke；新增回归覆盖输入校验、顺序、官方 skill 路径、有效/无效产物、页数、不产出PPTX、排队及运行取消、重启恢复。实际界面回归覆盖生图结果跳转、缩略图排序、转换和下载；Chromium覆盖上传、取消、结果、配置保存及390/800/1280宽度。上游CLI在独立Python环境实际安装成功，doctor、单页prepare、离线hints和run next均运行成功，无付费模型调用。

未验证：真实用户 Electron 宿主的 Agent 权限、真实图像 API/PaddleOCR 服务质量、复杂页面最终可编辑程度。Windows 路径和Python启动器有专门分支，但未在Windows机器实测。

本功能随1.9.0发布。
