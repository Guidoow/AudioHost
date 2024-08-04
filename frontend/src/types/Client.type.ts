import type { Song } from ".";

export interface Client {
  likes: Array<String>;
  views: Array<String>;
  UUID: String;
  Song?: Song;
}
