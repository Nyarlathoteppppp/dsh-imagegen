# npm 可信发布配置

GitHub Actions 的 `release.yml` 先完成类型检查、构建、冒烟测试和安装包校验，再使用同一个已校验安装包发布到 npm。

## npm 官网首次绑定

由包管理员登录 https://www.npmjs.com/package/@dickpy/dsh-imagegen/access ，在 Trusted publishing 添加 GitHub Actions，填写：

| 字段 | 值 |
| --- | --- |
| Organization or user | `dickpy` |
| Repository | `dsh-imagegen` |
| Workflow filename | `release.yml` |
| Environment name | 留空 |
| Allowed actions | 启用 `npm publish`，允许直接发布 |

文件名只填 `release.yml`，不要填写 `.github/workflows/` 前缀。

首次管理信任关系需要在 npm 账号启用 2FA，并在官网按提示完成验证。邮箱登录验证码不能替代发布和信任管理的二次验证。不要禁用已有安全设置，也不需要提供长期 npm Token。

npm CLI 的等效命令（同样需要交互式二次验证）：

```bash
npm trust github @dickpy/dsh-imagegen --file release.yml --repository dickpy/dsh-imagegen --allow-publish --yes
```

## 触发发布

绑定后，在 GitHub → Actions → Validate, package and release → Run workflow 中选择 `main` 执行。首次可信发布须在 npm 信任关系创建后两天内成功，以完成绑定。

之后主分支的 `package.json` 版本更新会触发发布。GitHub Release 已存在时不会覆盖它，仍会继续执行独立的 npm 发布任务；npm 上的同版本已存在时也不会覆盖或调整 dist-tag。

## 权限与校验

- 构建任务：`contents: write` 用于创建 GitHub Release。
- npm 发布任务：`contents: read` 和 `id-token: write`，仅在 `main` 分支运行，使用 GitHub-hosted runner。
- 不设置 `NPM_TOKEN` 或 `NODE_AUTH_TOKEN` 密钥；npm CLI 使用 GitHub OIDC 获取短期发布凭据。
- 发布前校验构建产物 SHA256。仅 npm 明确返回版本不存在（E404）时才执行发布；网络、权限等错误直接终止。
- OIDC 发布附带 provenance，用于说明包来自哪个仓库和工作流。

官方文档：https://docs.npmjs.com/trusted-publishers/
