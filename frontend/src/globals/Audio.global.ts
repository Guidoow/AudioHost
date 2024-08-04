import { writable, type Writable } from "svelte/store";
import type { Audio as audio } from "../types";

export const Audio: Writable<Array<audio>> = writable([]);
