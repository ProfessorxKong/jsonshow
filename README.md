# JsonShow - 文件展示工具

一个现代化的文件展示工具，专门用于在线查看和分析 JSON 和 Excel 文件。

## 🚀 主要功能

- **JSON 文件查看器**：支持 JSON 格式的可视化展示，带有语法高亮和折叠功能
- **Excel 文件查看器**：支持 Excel (xlsx/xls) 和 CSV 文件的表格展示
- **多工作表支持**：Excel 文件的多个工作表以标签页形式展示
- **文件管理**：拖拽上传、文件列表管理、历史记录
- **响应式设计**：适配桌面和移动设备
- **数据导出**：支持 JSON 复制和 CSV 导出功能

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **UI 组件**：Ant Design 5
- **状态管理**：Redux Toolkit
- **路由管理**：React Router 6
- **构建工具**：Vite
- **代码规范**：ESLint + Prettier + Husky
- **文件处理**：
  - JSON 查看：react-json-view
  - Excel 处理：xlsx
  - 日期处理：dayjs

## 📦 安装与运行

### 环境要求

- Node.js >= 16.0.0
- Yarn >= 1.22.0

### 克隆项目

\`\`\`bash
git clone <repository-url>
cd jsonshow
\`\`\`

### 安装依赖

\`\`\`bash
yarn install
\`\`\`

### 启动开发服务器

\`\`\`bash
yarn dev
\`\`\`

访问 http://localhost:3000 查看应用。

### 构建生产版本

\`\`\`bash
yarn build
\`\`\`

### 预览生产版本

\`\`\`bash
yarn preview
\`\`\`

## 📁 项目结构

\`\`\`
jsonshow/
├── public/ # 静态资源
├── src/
│ ├── components/ # 可复用组件
│ │ └── Layout/ # 布局组件
│ ├── pages/ # 页面组件
│ │ ├── Home.tsx # 首页
│ │ ├── JsonViewer.tsx # JSON 查看器
│ │ └── ExcelViewer.tsx# Excel 查看器
│ ├── store/ # Redux 状态管理
│ │ ├── slices/ # Redux slices
│ │ └── index.ts # Store 配置
│ ├── hooks/ # 自定义 Hooks
│ ├── router/ # 路由配置
│ ├── types/ # TypeScript 类型定义
│ ├── constants/ # 常量定义
│ ├── utils/ # 工具函数
│ ├── styles/ # 样式文件
│ └── main.tsx # 应用入口
├── package.json
├── vite.config.ts # Vite 配置
├── tsconfig.json # TypeScript 配置
└── README.md
\`\`\`

## 🎯 使用指南

### 上传文件

1. 在首页点击上传区域或拖拽文件到上传区域
2. 支持的文件格式：
   - JSON 文件：\`.json\`
   - Excel 文件：\`.xlsx\`, \`.xls\`
   - CSV 文件：\`.csv\`

### JSON 文件查看

- 自动语法高亮和格式化
- 支持对象展开/折叠
- 一键复制 JSON 内容
- 支持下载处理后的文件

### Excel 文件查看

- 多工作表标签页展示
- 表格分页和搜索功能
- 响应式表格设计
- 支持导出为 CSV 格式

### 文件管理

- 左侧导航栏显示已上传文件列表
- 点击文件名快速切换查看
- 支持文件删除和重新上传

## ⚙️ 开发规范

### 别名使用

项目配置了 \`@\` 别名指向 \`src/\` 目录：

\`\`\`typescript
// ✅ 推荐：使用别名
import { useAppSelector } from '@/hooks/useAppDispatch';
import type { FileInfo } from '@/types';

// ❌ 不推荐：复杂相对路径
import { useAppSelector } from '../../../hooks/useAppDispatch';
\`\`\`

### 代码提交

项目使用 Husky + lint-staged 进行代码质量检查：

- 提交前自动运行 ESLint 检查
- 自动格式化代码
- 确保代码规范一致性

### 文件组织

- 组件按功能模块组织
- 使用 TypeScript 严格模式
- 遵循 React + Redux 最佳实践

## 🔧 配置说明

### 环境变量

创建 \`.env.local\` 文件添加环境配置：

\`\`\`env

# API 配置（如果需要）

VITE_API_BASE_URL=http://localhost:3001

# 文件上传限制

VITE_MAX_FILE_SIZE=10485760
\`\`\`

### 自定义配置

在 \`src/constants/index.ts\` 中修改应用配置：

- 支持的文件类型
- 文件大小限制
- 主题色彩配置

## 🚀 部署

### 静态部署

构建后将 \`dist\` 目录部署到任何静态文件服务器：

\`\`\`bash
yarn build

# 将 dist/ 目录上传到服务器

\`\`\`

### Docker 部署

\`\`\`dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支：\`git checkout -b feature/new-feature\`
3. 提交更改：\`git commit -am 'Add some feature'\`
4. 推送到分支：\`git push origin feature/new-feature\`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 🆘 常见问题

### 文件上传失败

- 检查文件格式是否支持
- 确认文件大小不超过限制（默认 10MB）
- 检查文件是否损坏

### 页面显示异常

- 清除浏览器缓存
- 检查控制台错误信息
- 确认 Node.js 版本兼容性

### 开发环境问题

- 重新安装依赖：\`rm -rf node_modules && yarn install\`
- 检查端口占用情况
- 更新到最新版本依赖

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 社区讨论

---

⭐ 如果这个项目对你有帮助，请给它一个 star！
