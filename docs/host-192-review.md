# 1.9.2 宿主兼容性修复验证

## #46：图片只出现在工作室，会话工具卡片没有图

1.9.1 仍受影响。后端 `output.render` 刻意保持文本，图片引用放进 `output.presentationMeta`；旧前端 `imageRefsOf` 只查看 `block.content` 中的图片。DSH Web 客户端使用原始内容和持久 metadata，不消费后端 `presentResult()` 投影，导致后端单测通过而真实会话没有图。

前端现在同时识别图片内容块、`block.meta.images` 和已有 JSON 工具结果中的引用，校验并去重。文生图、图生图、任务查询复用同一渲染器。保留附件读取路由、模型纯文本输出及不追加会话消息的行为。异步图片加载在卸载或其他图片失败后释放迟到的对象 URL。

回归在 jsdom 中通过真实插槽注册、React 组件与附件读取路由检查三种工具渲染的 img 和原图链接。另检查旧会话 JSON 回放、内容/metadata 去重、运行中及失败状态、无效引用。之前测试只检查后端 presentResult，未覆盖现代 Web 的 metadata 读取路径，本次已补足。

## PPT：消息在转换启动前被拒绝

用户提供的任务在 85ms 内失败，错误与 DSH v4 的来源准入校验完全一致。插件使用已退役的 `{ kind: 'plugin', plugin: 'dsh-imagegen' }`。v4 原生消息必须使用生产方自己的 kind；上游迁移规则将外部插件映射成 `plugin:` 加完整插件名。

改为 `{ kind: 'plugin:dsh-imagegen' }`，不伪装成人类输入，也不绕过 v4 校验。共享 Agent 适配器同时覆盖 PPT 和无限画布重型 skill。

使用 npm 发布的官方 `@deepseek-ai/dsh-session-format-v3-to-v4@0.2.1-rc.2` 的 `releasedV4SessionFormatCodec.encodeEvent` 实测：旧来源重现原错误，新来源可编码。项目回归还让真实 `createCanvasSkillAgent` 的 followup 经过同样准入条件并校验实际提交字段。没有使用真实模型凭据，未将通过消息校验夸大为完成真实 PPT 转换。

参考：DeepSeek Harness commit `687f282e8625c6b8d11ff58211a90524be2e4317`：

- `packages/core/tools/README.md`（Web 展示派生契约）
- `packages/client/ui-conversation/src/client/contract/records.ts`（ToolResultNode.meta）
- `packages/session/session-format-v3-to-v4/src/message-sources.ts`（来源校验）
- `packages/session/session-format-v3-to-v4/README.md`（外部插件来源迁移）
