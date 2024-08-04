import { writable, type Writable } from "svelte/store";
import type { AppState as appState } from "../types";

const initialState: appState = {
  screenWidth: window.innerWidth,
  requireRefresh: false,
  client: {
    likes: [],
    views: [],
    UUID: "",
  },
  audio: {
    running: {},
    waiting: {},
  },
  theme: {
    type: 0,
  },
};

export const AppState: Writable<appState> = writable(initialState);
