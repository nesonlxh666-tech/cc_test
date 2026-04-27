# 部署指南

## 🚀 Vercel Serverless 部署

本项目支持部署到Vercel，无需本地服务器，即可提供完整的AI内容生成功能。

### 前置要求

- Vercel账号 (https://vercel.com/)
- GLM API密钥 (从智谱AI开放平台获取)
- GitHub账号

### 部署步骤

#### 1. 准备代码

确保项目文件结构如下：
```
cc_test/
├── index.html          # 前端页面
├── api/                # Vercel Serverless Functions
│   ├── utils.js
│   ├── generate-topics.js
│   ├── generate-content.js
│   ├── optimize-titles.js
│   └── design-interaction.js
├── vercel.json         # Vercel配置文件
├── package.json
└── .env.example
```

#### 2. 推送到GitHub

```bash
git add .
git commit -m "Add Vercel serverless functions"
git push origin main
```

#### 3. 在Vercel创建新项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择您的 `cc_test` 仓库
5. 点击 "Import"

#### 4. 配置项目

在项目设置页面：

**框架 Preset**: 选择 "Other"

**Root Directory**: 保持默认 `./`

**Build Command**: 留空

**Output Directory**: 留空

#### 5. 设置环境变量

1. 在项目设置中找到 "Environment Variables"
2. 添加以下环境变量：

```
Key: GLM_API_KEY
Value: 您的GLM API密钥
```

**重要**：确保环境变量在所有环境中都可用：
- ☑️ Production
- ☑️ Preview
- ☑️ Development

#### 6. 部署

点击 "Deploy" 按钮，Vercel会自动：
- 安装依赖
- 构建项目
- 部署Serverless Functions
- 分配域名

#### 7. 获取部署URL

部署完成后，Vercel会提供一个URL，例如：
```
https://your-project.vercel.app
```

### 验证部署

1. 访问您的Vercel部署URL
2. 打开浏览器控制台 (F12)
3. 填写表单并点击生成
4. 检查控制台日志，确认API调用成功

## 🌐 GitHub Pages + Vercel 组合部署

如果您想使用GitHub Pages部署前端，同时使用Vercel提供API：

### 步骤1：配置GitHub Pages

1. 在GitHub仓库设置中启用GitHub Pages
2. 选择 `main` 分支作为源
3. 等待GitHub Pages部署完成

### 步骤2：部署Vercel Serverless

按照上面的Vercel部署步骤完成部署

### 步骤3：更新前端API地址

编辑 `index.html`，修改API_BASE_URL配置：

```javascript
const API_BASE_URL = 'https://your-project.vercel.app';
```

或者使用相对路径（如果GitHub Pages和Vercel在同一域名）：

```javascript
const API_BASE_URL = ''; // 使用相对路径
```

## 🔄 本地开发

### 使用本地服务器

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，填入GLM_API_KEY

# 启动服务器
npm start
```

访问 `http://localhost:8080`

### 使用Vercel CLI本地开发

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login

# 本地运行
vercel dev
```

访问 `http://localhost:3000`

## 🐛 常见问题

### 1. 部署后API调用失败

**问题**：前端显示"生成失败"

**解决方案**：
- 检查环境变量是否正确设置
- 查看Vercel的部署日志
- 确认GLM API密钥有效
- 检查网络连接

### 2. CORS错误

**问题**：浏览器控制台显示CORS错误

**解决方案**：
- 确保所有API函数都设置了正确的CORS头
- 检查前端API地址是否正确

### 3. 超时错误

**问题**：API调用超时

**解决方案**：
- GLM API响应可能需要较长时间
- 已在代码中设置30秒超时
- 如果仍然超时，请检查网络连接

### 4. 环境变量未生效

**问题**：API显示"未配置GLM_API_KEY"

**解决方案**：
- 确保环境变量名称完全匹配：`GLM_API_KEY`
- 在Vercel中重新部署项目
- 检查环境变量的作用域

## 📊 监控和日志

### Vercel日志

1. 访问Vercel Dashboard
2. 选择您的项目
3. 点击 "Functions" 标签
4. 查看Serverless Functions的日志

### 性能监控

Vercel自动提供：
- 响应时间统计
- 错误率监控
- 使用量统计

## 🎯 优化建议

1. **减少API调用次数**：考虑缓存结果
2. **优化prompt**：减少生成时间
3. **添加错误重试**：提高可靠性
4. **实现限流**：避免API滥用

## 🔐 安全建议

1. **保护API密钥**：
   - 不要在前端代码中暴露密钥
   - 使用环境变量存储
   - 定期轮换密钥

2. **添加认证**：
   - 考虑添加API密钥验证
   - 实现用户认证系统

3. **限流保护**：
   - 实现速率限制
   - 添加使用配额

## 📞 支持

如有问题，请：
1. 查看Vercel文档
2. 检查项目日志
3. 提交GitHub Issue

---

**祝您部署顺利！** 🎉