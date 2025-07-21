import { configureStore } from '@reduxjs/toolkit';
import fileSlice from './slices/fileSlice';
import appSlice from './slices/appSlice';

export const store = configureStore({
  reducer: {
    file: fileSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['file/setCurrentFile'],
        ignoredPaths: [
          'file.currentFile.content',
          'file.currentFile.lastModified',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
