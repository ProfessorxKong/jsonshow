// 文件类型定义
export interface FileInfo {
  id: string;
  name: string;
  type: 'json' | 'excel' | 'other';
  size: number;
  lastModified: Date;
  content?: any;
  url?: string;
}

// Excel 文件数据结构
export interface ExcelData {
  sheets: ExcelSheet[];
  fileName: string;
}

export interface ExcelSheet {
  name: string;
  data: any[][];
  headers?: string[];
}

// JSON 数据类型
export interface JSONData {
  content: any;
  fileName: string;
  isValid: boolean;
  error?: string;
}

// 应用状态类型
export interface AppState {
  currentFile: FileInfo | null;
  fileList: FileInfo[];
  loading: boolean;
  error: string | null;
}

import type { ComponentType, ReactNode } from 'react';

// 路由类型
export interface RouteInfo {
  path: string;
  name: string;
  component: ComponentType;
  icon?: ReactNode;
}
