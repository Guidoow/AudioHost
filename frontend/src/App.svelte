<script lang="ts">
  import DisplayBar from "./components/mediabar/MediaBar.svelte";
  import NavBar from "./components/navbar/Navbar.svelte";
  import Audio from "./components/audioBox/Audio.svelte";
  import NotFound from "./components/NotFound.svelte";
  import Explore from "./components/Explore.svelte";
  import Search from "./components/Search.svelte";
  import Create from "./components/Create.svelte";
  import Detail from "./components/Detail.svelte";
  import Home from "./components/Home.svelte";
  import Info from "./components/Info.svelte";

  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";

  import { AudioService, UtilsService } from "./services";
  import { AppState } from "./globals";
  import config from "./config";

  let theme = config.theme.dark;
  let resizingTimeout: number | null;

  $: themeType = $AppState.theme.type;

  function updateTheme() {
    if (themeType) {
      theme = config.theme.lightMediumContrast;
      document.body.className = theme;
    } else {
      theme = config.theme.dark;
      document.body.className = theme;
    }
  }

  $: {
    if (themeType !== undefined) updateTheme();
  }

  function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setVh();

  window.addEventListener("resize", setVh);

  window.addEventListener("resize", () => {
    if (resizingTimeout) clearTimeout(resizingTimeout);

    resizingTimeout = setTimeout(() => {
      $AppState.screenWidth = window.innerWidth;
    }, 100);
  });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== " ") return 0;

    AudioService.audio.paused ? AudioService.play() : AudioService.pause();
  });

  onMount(async () => await UtilsService.getClient());
</script>

<Router>
  <span
    role="group"
    style="background: var({config.css.variables.surfaceContainer})"
  >
    <NavBar />

    <main>
      <Route path="/search/:search" component={Search}></Route>

      <Route path="/" component={Home} />

      <Route path="/info" component={Info} />

      <Route path="/create" component={Create} />

      <Route path="/explore" component={Explore} />

      <Route path="/detail/:UUID" component={Detail} />

      <Route path="*" component={NotFound} />
    </main>

    <Audio />

    <DisplayBar />
  </span>
</Router>

<style>
  span {
    display: flex;

    max-height: var(--body-height);
    min-height: var(--body-height);

    padding-top: 1rem;

    position: relative;
    box-sizing: border-box;
  }

  main {
    position: relative;

    display: flex;
    flex-direction: row;

    max-height: var(--content-height);
    min-height: var(--content-height);

    min-width: var(--content-width);
    max-width: var(--content-width);

    overflow: hidden;

    padding-right: 1rem;
  }

  :global(:root) {
    --svg-btn-size: 24px;
  }

  @media (max-width: 600px) {
    main {
      padding: 0 1rem;
    }

    span {
      flex-direction: column;
    }
  }

  @media (min-width: 601px) and (max-width: 768px) {
    main {
      padding: 0 1rem;
    }

    span {
      flex-direction: column;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    main {
      padding-right: 1rem;
    }

    span {
      flex-direction: row;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    main {
      padding-right: 1rem;
    }

    span {
      flex-direction: row;
    }
  }

  @media (min-width: 1201px) {
    main {
      padding-right: 1rem;
    }

    span {
      flex-direction: row;
    }
  }
</style>
