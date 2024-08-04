<script lang="ts">
  import Search from "./Search.svelte";

  import { Link } from "svelte-routing";

  import { AppState } from "../../globals";
  import config from "../../config";

  function toggleTheme() {
    if ($AppState.theme.type) $AppState.theme.type = 0;
    else $AppState.theme.type = 1;

    $AppState.theme.type = $AppState.theme.type;
  }
</script>

<nav>
  <md-list
    role="menubar"
    style="background: var({config.css.variables.surfaceContainer});"
  >
    <Search />

    <md-list
      role="menuitem"
      style="background: var({config.css.variables.surfaceContainer});"
    >
      <Link class="navbar-link" to="/" tabindex={-1}>
        <md-text-button link> Home </md-text-button>
      </Link>

      <Link class="navbar-link" to="/create" tabindex={-1}>
        <md-text-button link> Create </md-text-button>
      </Link>

      <Link class="navbar-link" to="/explore" tabindex={-1}>
        <md-text-button link> Explore </md-text-button>
      </Link>

      <md-text-button
        reduced
        role="button"
        tabindex="0"
        on:keydown
        on:click={toggleTheme}
      >
        {#if $AppState.theme.type === 1}
          <md-icon medium>dark_mode</md-icon>
        {:else}
          <md-icon medium>light_mode</md-icon>
        {/if}
      </md-text-button>
    </md-list>
  </md-list>
</nav>

<style>
  * {
    overflow: visible;
  }
  nav {
    display: flex;
    flex-direction: column;

    justify-content: space-between;

    min-width: var(--navbar-width);
    max-width: var(--navbar-width);

    min-height: var(--navbar-height);
    max-height: var(--navbar-height);

    overflow: hidden;

    box-sizing: border-box;
    padding: 0 1rem;
  }

  md-list[role="menubar"] {
    min-height: var(--navbar-height);
    max-height: var(--navbar-height);

    flex: 1;
    display: flex;
    padding: 3rem 0 7rem 0;
    box-sizing: border-box;
  }

  md-list[role="menuitem"] {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    flex: 1;
  }

  md-text-button[link] {
    width: 100%;
  }

  md-icon[medium] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  md-text-button[reduced] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 600px) {
    /* Dispositivos pequeños (teléfonos móviles en modo vertical) */
    :root {
      --navbar-width: var(--horbar-width);
      --navbar-height: calc(var(--horbar-height) * 2 + 1rem);
    }

    nav {
      box-sizing: border-box;
    }
    md-list[role="menubar"] {
      padding: 0;
    }

    md-list[role="menuitem"] {
      flex-direction: row;
    }
  }

  @media (min-width: 601px) and (max-width: 768px) {
    /* Dispositivos medianos (tabletas en modo vertical) */
    :root {
      --navbar-width: var(--horbar-width);
      --navbar-height: calc(var(--horbar-height) * 2 + 1rem);
    }

    nav {
      box-sizing: border-box;
    }
    md-list[role="menubar"] {
      padding: 0;
    }

    md-list[role="menuitem"] {
      flex-direction: row;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    /* Dispositivos grandes (tabletas en modo horizontal y pantallas pequeñas de laptop) */
    :root {
      --navbar-width: var(--sidebar-width);
      --navbar-height: var(--sidebar-height);
    }

    nav {
      box-sizing: content-box;
    }
    md-list[role="menubar"] {
      padding: 5rem 0;
    }

    md-list[role="menuitem"] {
      flex-direction: column;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    /* Pantallas de escritorio y laptops */
    :root {
      --navbar-width: var(--sidebar-width);
      --navbar-height: var(--sidebar-height);
    }

    nav {
      box-sizing: content-box;
    }
    md-list[role="menubar"] {
      padding: 5rem 0;
    }

    md-list[role="menuitem"] {
      flex-direction: column;
    }
  }

  @media (min-width: 1201px) {
    /* Pantallas grandes (monitores grandes y televisores) */
    :root {
      --navbar-width: var(--sidebar-width);
      --navbar-height: var(--sidebar-height);
    }

    nav {
      box-sizing: content-box;
    }
    md-list[role="menubar"] {
      padding: 5rem 0;
    }

    md-list[role="menuitem"] {
      flex-direction: column;
    }
  }
</style>
