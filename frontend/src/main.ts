import "./css/app.css";

import "@material/web/fab/fab.js";
import "@material/web/fab/branded-fab.js";

import "@material/web/icon/icon.js";

import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/secondary-tab.js";
import "@material/web/tabs/tabs.js";

import "@material/web/textfield/filled-text-field";
import "@material/web/textfield/outlined-text-field";

import "@material/web/switch/switch.js";

import "@material/web/list/list-item.js";
import "@material/web/list/list.js";

import "@material/web/button/text-button";
import "@material/web/button/elevated-button";
import "@material/web/button/outlined-button";
import "@material/web/button/filled-button";
import "@material/web/button/filled-tonal-button";

import "@material/web/chips/chip-set";
import "@material/web/chips/filter-chip";
import "@material/web/chips/assist-chip";

import "@material/web/typography/md-typescale-styles";

import "@material/web/elevation/elevation.js";

import "@material/web/dialog/dialog.js";

import App from "./App.svelte";

import { styles as typescaleStyles } from "@material/web/typography/md-typescale-styles.js";

document.adoptedStyleSheets.push(typescaleStyles.styleSheet!);

const app = new App({
  target: document.body,
});

export default app;
