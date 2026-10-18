# 桌面端插件在线更新修复

1.8.0/1.8.1对桌面端仅提供管理提示并禁用按钮，没有接入实际安装能力。本次从宿主取得pluginManager.installBundle，向宿主提交官方固定版本Release tgz URL及saveExact选项，由宿主管理包管理器、profile锁、安装失败恢复和加载；不卸载自身，不对desktop profile运行CLI。

## 宿主行为依据

核对DeepSeek-Harness源码提交 `687f282e8625c6b8d11ff58211a90524be2e4317`：

- `packages/boot/plugin-manager/src/index.ts` 的installBundle使用profile.packageManager，内置变更锁和失败恢复；HMR下registry名字覆盖已安装包会拒绝，包名在安装后才明确的tarball替换走宿主现有重组流程。
- `packages/boot/plugin-manager/README.md`描述tarball替换及restart-required语义；`tests/package-reload.spec.ts`覆盖无HMR时tarball替换保留运行版本、等待重启。
- 因而不采用removeBundle再安装：那会停止插件自身的更新路由。不会在宿主拒绝后退回裸pnpm或猜测desktop CLI。

## 结果与兼容

检查application、error、packageResult退出码、bundle及实际version。仅applied/restart-required可成功；旧管理器不返回version时检查当前profile实际安装的package.json。取消、覆盖、错误、版本不符或无法核验均不能提示成功。错误经过原脱敏规则记录并展示。

检查更新接口只发送可序列化的host能力标识；本地安装回调不传给浏览器。具备接口时面板恢复在线更新；缺少接口的旧桌面宿主明确提示升级DSH。Web没有宿主接口时保留CLI后备路径。

## 验证范围

类型检查、构建、85项完整回归及实际tgz校验通过。新增原生安装成功/失败/取消/覆盖/版本不符/包名不符/未知结果/版本缺失回退与凭据脱敏；路由测试覆盖host能力、非最新版拦截和错误传播；面板测试验证桌面按钮可点击、请求成功后提示版本和重启。安装均使用隔离假宿主，不执行真实包安装。

尚未在用户的Electron宿主实际安装验收。本文归档1.8.2发布前的审核验证，正式安装见[发布说明](releases/v1.8.2.md)。1.8.0/1.8.1旧按钮已禁用，首次须通过宿主支持的安装方式装入修复包并重启，后续才可使用新按钮。
