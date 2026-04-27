# Vercel部署详细步骤

## 📋 部署前准备清单

- [ ] 已将代码推送到GitHub
- [ ] 已注册Vercel账号
- [ ] 已获取GLM API密钥
- [ ] 已完成所有部署检查

## 🚀 详细部署步骤

### 步骤1：推送代码到GitHub

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "Add Vercel serverless functions support"

# 推送到GitHub
git push origin main
```

### 步骤2：登录Vercel

1. 访问 [Vercel.com](https://vercel.com/)
2. 使用GitHub账号登录
3. 授权Vercel访问您的GitHub仓库

### 步骤3：创建新项目

1. 登录后，点击 "Add New" → "Project"
2. 在 "Import Git Repository" 部分：
   - 找到并选择 `cc_test` 仓库
   - 点击 "Import" 按钮

### 步骤4：配置项目

在项目配置页面，填写以下信息：

**Project Name**: `ai-content-assistant` (或您喜欢的名称)

**Framework Preset**: 选择 `Other`

**Root Directory**: 保持默认 `./`

**Build Command**: 留空（不需要构建命令）

**Output Directory**: 留空

**Install Command**: 保持默认 `npm install`

### 步骤5：设置环境变量

1. 在项目配置页面，找到 "Environment Variables" 部分
2. 点击 "Add New" 添加环境变量：

```
Name: GLM_API_KEY
Value: 您的GLM API密钥（例如：c6149f05875b48779d67e87d7bd29e26.ieg8yeiPykGK3Yq4）
```

3. **重要**：确保环境变量在所有环境中都勾选：
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

4. 如果有其他环境变量，同样添加：
   ```
   Name: NODE_ENV
   Value: production
   ```

### 步骤6：部署设置

在 "Environment" 部分（可选）：

**Node.js Version**: 选择 `18.x` 或更高

### 步骤7：部署

1. 检查所有配置是否正确
2. 点击 "Deploy" 按钮
3. 等待部署完成（通常需要1-2分钟）

### 步骤8：获取部署URL

部署完成后，Vercel会提供：
- **Production URL**: 例如 `https://ai-content-assistant.vercel.app`
- **预览URL**: 每次部署都有不同的预览URL

### 步骤9：验证部署

1. 访问您的Production URL
2. 按F12打开浏览器控制台
3. 填写表单测试：
   - 主题：原神
   - 平台：小红书
   - 用户：女性玩家
4. 点击"生成内容方案"
5. 检查控制台日志，确认API调用成功

## 🔍 验证检查清单

部署完成后，检查以下内容：

### 前端检查
- [ ] 页面正常加载
- [ ] 样式显示正确
- [ ] 表单可以正常填写
- [ ] 按钮点击有响应

### API检查
- [ ] 控制台显示API基础地址为相对路径
- [ ] 点击生成后显示进度条
- [ ] 每个步骤都成功完成
- [ ] 生成的内容正确显示

### 功能检查
- [ ] 选题生成正常
- [ ] 内容生成正常
- [ ] 标题优化正常
- [ ] 互动设计正常
- [ ] 复制功能正常
- [ ] 重新生成功能正常

## 🐛 常见问题解决

### 问题1：部署失败

**症状**：部署过程中出现错误

**解决方案**：
1. 检查Vercel的部署日志
2. 确保所有文件都已推送到GitHub
3. 检查package.json是否正确
4. 确保Node.js版本兼容

### 问题2：环境变量未生效

**症状**：API显示"未配置GLM_API_KEY"

**解决方案**：
1. 在Vercel项目中重新添加环境变量
2. 确保环境变量名称完全匹配（区分大小写）
3. 重新部署项目
4. 检查环境变量的作用域是否正确

### 问题3：API调用失败

**症状**：前端显示"生成失败"

**解决方案**：
1. 打开浏览器控制台查看详细错误
2. 检查Vercel Functions日志
3. 确认GLM API密钥有效
4. 检查网络连接

### 问题4：CORS错误

**症状**：浏览器控制台显示CORS错误

**解决方案**：
1. 检查API函数的CORS设置
2. 确认前端API地址正确
3. 查看Vercel的CORS配置

### 问题5：超时错误

**症状**：API调用超时

**解决方案**：
1. 检查网络连接
2. 查看Vercel的函数执行日志
3. 确认GLM API服务正常

## 📊 监控和维护

### 查看部署日志

1. 登录Vercel Dashboard
2. 选择您的项目
3. 点击 "Deployments" 标签
4. 点击具体的部署记录查看日志

### 查看函数日志

1. 在项目页面点击 "Functions" 标签
2. 选择具体的函数
3. 查看执行日志和错误信息

### 更新项目

当您修改代码后：

```bash
# 提交更改
git add .
git commit -m "描述您的更改"
git push origin main
```

Vercel会自动检测到新的提交并重新部署。

### 回滚部署

如果新版本有问题：

1. 在Vercel Dashboard找到之前的成功部署
2. 点击 "Promote to Production" 按钮
3. 确认回滚操作

## 🎯 性能优化

### 1. 减少冷启动时间

- 保持函数代码简洁
- 减少不必要的依赖
- 使用函数缓存

### 2. 优化API响应

- 添加响应缓存
- 优化GLM prompt
- 实现并发请求

### 3. 监控使用量

- 在Vercel Dashboard查看使用统计
- 设置预算警告
- 监控API调用次数

## 🔐 安全建议

1. **定期轮换API密钥**
2. **实施速率限制**
3. **添加用户认证**
4. **监控异常访问**
5. **设置使用配额**

## 📞 获取帮助

如果遇到问题：

1. 查看 [Vercel文档](https://vercel.com/docs)
2. 检查项目的部署日志
3. 在GitHub提交Issue
4. 联系Vercel支持

## 🎉 部署成功后

恭喜！您的AI内容运营助手现在已经成功部署到Vercel了！

您可以：
- 分享您的部署URL给其他人使用
- 持续监控性能和错误
- 根据用户反馈优化功能
- 添加更多AI功能

---

**祝您部署顺利，使用愉快！** 🚀