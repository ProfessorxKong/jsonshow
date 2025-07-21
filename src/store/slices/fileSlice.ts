import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FileInfo } from '@/types';

interface FileState {
  currentFile: FileInfo | null;
  fileList: FileInfo[];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  currentFile: null,
  fileList: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<FileInfo | null>) => {
      state.currentFile = action.payload;
      state.error = null;
    },
    addFile: (state, action: PayloadAction<FileInfo>) => {
      const existingIndex = state.fileList.findIndex(
        (file) => file.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.fileList[existingIndex] = action.payload;
      } else {
        state.fileList.push(action.payload);
      }
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.fileList = state.fileList.filter(
        (file) => file.id !== action.payload
      );
      if (state.currentFile?.id === action.payload) {
        state.currentFile = null;
      }
    },
    setFileList: (state, action: PayloadAction<FileInfo[]>) => {
      state.fileList = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentFile,
  addFile,
  removeFile,
  setFileList,
  setLoading,
  setError,
  clearError,
} = fileSlice.actions;

export default fileSlice.reducer;
