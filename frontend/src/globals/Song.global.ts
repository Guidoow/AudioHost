import { writable, type Writable } from "svelte/store";

import type { Song } from "../types";

const songs: Song[] = [];

export const Songs: Writable<Array<Song>> = writable(songs || []);
