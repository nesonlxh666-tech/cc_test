# AI内容运营助手 🤖

一个帮助自媒体创作者从选题到内容再到互动，一站式生成内容方案的智能网站。基于GLM-4模型驱动，支持Vercel Serverless部署。

## ✨ 功能特点

- 💡 **选题生成**：基于主题、平台、目标用户智能生成5个爆款选题
- 📄 **内容生成**：根据选题生成完整的内容框架（开头+正文+结尾）
- ✨ **标题优化**：生成3种风格的标题（情绪型/信息型/争议型）
- 💬 **互动设计**：设计评论区话术和互动问题，提升用户参与度

## 🚀 快速开始

### 🌐 在线使用 (推荐)

访问部署版本：
- **GitHub Pages**: https://nesonlxh666-tech.github.io/cc_test/
- **Vercel部署**: (需要先完成Vercel部署步骤)

### 💻 本地开发

#### 1. 克隆项目

```bash
git clone https://github.com/nesonlxh666-tech/cc_test.git
cd cc_test
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置环境变量

复制 `.env.example` 为 `.env`，并填入您的GLM API密钥：

```bash
cp .env.example .env
```

在 `.env` 文件中设置：

```env
GLM_API_KEY=your_glm_api_key_here
PORT=8080
```

#### 4. 启动后端服务

```bash
npm start
```

服务器将在 http://localhost:8080 启动

#### 5. 打开前端页面

直接用浏览器打开 `index.html` 文件即可使用。

### 🚀 Vercel Serverless部署

支持一键部署到Vercel，无需本地服务器。详细步骤请查看 [DEPLOYMENT.md](DEPLOYMENT.md)。

#### 快速部署：

1. 将代码推送到GitHub
2. 在Vercel导入项目
3. 设置环境变量 `GLM_API_KEY`
4. 点击部署

部署完成后，您将获得一个可访问的URL，例如：`https://your-project.vercel.app`

## 📋 使用说明

1. **填写表单**：
   - 内容主题：如"原神"
   - 平台选择：小红书/抖音/B站/TikTok
   - 目标用户：如"女性玩家"

2. **点击生成**：系统会自动调用AI生成完整的内容方案

3. **查看结果**：
   - 选题建议（5个选题，点击可选中）
   - 内容框架（开头+正文+结尾）
   - 标题优化（3种风格）
   - 互动设计（话术+问题）

4. **操作功能**：
   - 单独复制每个内容块
   - 重新生成单个模块
   - 一键复制全部内容

## 🔧 技术栈

### 前端
- 原生HTML5 + CSS3 + JavaScript
- 响应式设计
- 实时进度显示
- 自动API地址检测

### 后端
- **本地开发**: Node.js + Express
- **生产部署**: Vercel Serverless Functions
- GLM-4 AI模型
- RESTful API

## 📁 项目结构

```
cc_test/
├── index.html                 # 前端页面
├── api/                       # Vercel Serverless Functions
│   ├── utils.js              # GLM API工具函数
│   ├── generate-topics.js    # 选题生成API
│   ├── generate-content.js   # 内容生成API
│   ├── optimize-titles.js    # 标题优化API
│   └── design-interaction.js # 互动设计API
├── server.js                 # 本地开发服务器
├── vercel.json               # Vercel配置
├── package.json              # 项目依赖
├── .env.example              # 环境变量示例
├── .gitignore                # Git忽略文件
├── .vercelignore             # Vercel忽略文件
├── check-deployment.js       # 部署检查脚本
├── README.md                 # 项目说明
├── DEPLOYMENT.md             # 部署指南
└── VERCEL_SETUP.md           # Vercel详细部署步骤
```

## 🔌 API接口

### Vercel部署版 (推荐)

所有API都通过Vercel Serverless Functions提供：

- `POST /api/generate-topics` - 生成选题
- `POST /api/generate-content` - 生成内容
- `POST /api/optimize-titles` - 优化标题
- `POST /api/design-interaction` - 设计互动

前端会自动检测环境，使用正确的API地址。

### 本地开发版

```
cc_test/
├── index.html          # 前端页面
├── server.js          # 后端API服务器
├── package.json       # 项目依赖
├── .env.example       # 环境变量示例
├── .gitignore         # Git忽略文件
└── README.md          # 项目说明
```

## 🔌 API接口

### 生成选题
- **URL**: `POST /api/generate-topics`
- **Body**:
  ```json
  {
    "topic": "原神",
    "platform": "小红书",
    "audience": "女性玩家"
  }
  ```

### 生成内容
- **URL**: `POST /api/generate-content`
- **Body**:
  ```json
  {
    "topic": "原神",
    "platform": "小红书",
    "audience": "女性玩家",
    "selectedTopic": "原神热度持续攀升，为什么玩家如此疯狂？"
  }
  ```

### 优化标题
- **URL**: `POST /api/optimize-titles`
- **Body**:
  ```json
  {
    "topic": "原神",
    "platform": "小红书",
    "audience": "女性玩家",
    "content": "生成的完整内容..."
  }
  ```

### 设计互动
- **URL**: `POST /api/design-interaction`
- **Body**:
  ```json
  {
    "topic": "原神",
    "platform": "小红书",
    "audience": "女性玩家",
    "content": "生成的完整内容..."
  }
  ```

## 🎯 使用场景

- **自媒体创作者**：快速生成内容方案，降低创作门槛
- **内容运营人员**：批量生成多个平台的内容
- **新媒体运营**：测试不同主题的内容效果

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [GLM-4模型文档](https://open.bigmodel.cn/)
- [智谱AI开放平台](https://open.bigmodel.cn/)

## 📝 更新日志

### v1.0.0 (2024-04-27)
- ✨ 初始版本发布
- ✅ 集成GLM-4模型
- ✅ 实现完整的4步生成流程
- ✅ 美化的UI设计
- ✅ 完善的错误处理

---

**注意**：使用前请确保已获取GLM API密钥。新用户可到[智谱AI开放平台](https://open.bigmodel.cn/)免费获取。