// 支持的文件类型
export const SUPPORTED_FILE_TYPES = {
  JSON: ['.json'],
  EXCEL: ['.xlsx', '.xls', '.csv'],
} as const;

// 路由路径
export const ROUTES = {
  HOME: '/',
  FILE_VIEWER: '/file/:fileId',
  JSON_VIEWER: '/json/:fileId',
  EXCEL_VIEWER: '/excel/:fileId',
  UPLOAD: '/upload',
} as const;

// 文件大小限制（字节）
export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

// 支持的语言
export const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US'] as const;

// 主题配置
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#1890ff',
  SUCCESS_COLOR: '#52c41a',
  WARNING_COLOR: '#faad14',
  ERROR_COLOR: '#f5222d',
} as const;
