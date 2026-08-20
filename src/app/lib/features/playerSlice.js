import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  queue: [],
  currentIndex: -1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setTrack: (state, action) => {
      // const { track, queue } = action.payload;
      state.currentTrack = action.payload;
      state.isPlaying = true;
      // if (queue) {
      //   state.queue = queue;
      //   state.currentIndex = queue.findIndex(t => t.id === track.id);
      // }
    },
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setVolumeState: (state, action) => {
      state.volume = action.payload;
    },
    nextTrack: (state) => {
      if (state.queue.length === 0 || state.currentIndex === -1) return;
      const nextIndex = (state.currentIndex + 1) % state.queue.length;
      state.currentIndex = nextIndex;
      state.currentTrack = state.queue[nextIndex];
      state.isPlaying = true;
    },
    prevTrack: (state) => {
      if (state.queue.length === 0 || state.currentIndex === -1) return;
      const prevIndex = state.currentIndex === 0 ? state.queue.length - 1 : state.currentIndex - 1;
      state.currentIndex = prevIndex;
      state.currentTrack = state.queue[prevIndex];
      state.isPlaying = true;
    }
  }
});

export const { setTrack, setPlaying, setVolumeState, nextTrack, prevTrack } = playerSlice.actions;
export default playerSlice.reducer;
