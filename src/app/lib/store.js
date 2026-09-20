import { configureStore } from '@reduxjs/toolkit';
import playerReducer from "./features/playerSlice";


export const makeStore = () => {
  return configureStore({
      reducer: {
        player: playerReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware() 
  })
}