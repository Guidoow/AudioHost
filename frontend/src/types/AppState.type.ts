import type { AudioState as audioState } from ".";
import type { Client } from ".";

export interface AppState {
  requireRefresh: boolean;
  screenWidth: number;
  client: Client;
  audio: {
    running: { [key: string]: audioState };
    waiting: { [key: string]: boolean };
  };

  theme: {
    type: 0 | 1;
  };
}
