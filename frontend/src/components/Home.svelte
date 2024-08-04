<script lang="ts">
  import Contact from "./Contact.svelte";

  import { Link } from "svelte-routing";

  import { AppState } from "../globals";
  import config from "../config";
</script>

<div
  class="scroll-wrapper
    {config.css.shape.l} 
    {config.css.colors.surface}"
>
  <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
    <h1 class={config.css.typography.displayLarge}>Welcome to AudioHost!</h1>

    <divider-min style="margin: 0 2rem .5rem 2rem;" />

    <section id="aim">
      <h3 class="title {config.css.typography.headlineLarge}">Aim</h3>

      <span class={config.css.typography.bodyLarge}>
        <span style="padding-bottom: 1rem;">
          <p>
            This web page is mainly designed to expose the author's knowledge
            and skills about software development.
            <br />
            Here, you can share your preferred song similar to any other song website
            and interact with people's songs as well.
          </p>

          <p>
            As this is mainly an exhibition, this page is reduced in its
            actions, but here you can find:
          </p>

          <ol>
            <li>
              <md-icon>check_indeterminate_small</md-icon>
              File uploading.
            </li>

            <li>
              <md-icon>check_indeterminate_small</md-icon>
              Interacting with audio
            </li>

            <li>
              <md-icon>check_indeterminate_small</md-icon>
              Likes and views on uploaded song
            </li>
          </ol>

          <p>
            Actions possible here, are per ISP IP, and associated to it, we do
            not include user management.
          </p>
        </span>
      </span>
    </section>

    <divider-min style="margin: 3rem 0 1rem 0;" />

    <section id="essential-links">
      <h3 class="title {config.css.typography.headlineLarge}">
        Essential links
      </h3>
      <ul>
        <li class={config.css.typography.bodyLarge}>
          <Link to="info" tabindex={-1}>
            <md-outlined-button> INFORMATION </md-outlined-button>
          </Link>

          {#if $AppState.screenWidth > config.breakpoints.largeMobile}
            <md-icon>trending_flat</md-icon>
          {/if}

          <p>
            A more specific review of which technologies are used and how are
            they deployed together.
          </p>
        </li>

        <li class={config.css.typography.bodyLarge}>
          <Link to="create" tabindex={-1}>
            <md-outlined-button> CREATE </md-outlined-button>
          </Link>

          {#if $AppState.screenWidth > config.breakpoints.largeMobile}
            <md-icon>trending_flat</md-icon>
          {/if}

          <p>
            Experiment with the APP: contribute by uploading your favorite
            Audio/Song.
          </p>
        </li>

        <li class={config.css.typography.bodyLarge}>
          <Link to="explore" tabindex={-1}>
            <md-outlined-button> EXPLORE </md-outlined-button>
          </Link>

          {#if $AppState.screenWidth > config.breakpoints.largeMobile}
            <md-icon>trending_flat</md-icon>
          {/if}

          <p>Explore the Audios/Songs uploaded by the community.</p>
        </li>
      </ul>
    </section>

    <divider-min style="margin: 3rem 0 1rem 0;" />

    <Contact />
  </div>
</div>

<style>
  .scroll-wrapper {
    max-height: var(--content-height) !important;
    min-height: var(--content-height) !important;
  }

  .scroll {
    display: flex;
    flex-direction: column;

    padding: 3rem;
    max-width: calc(100% - 6rem);
  }

  h3.title {
    margin-bottom: 2rem;
  }

  span {
    display: flex;
    flex-direction: column;
  }

  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 1.5rem 0;
    min-width: 100%;
  }

  li:first-child {
    margin: 0;
  }

  md-outlined-button {
    min-width: 10rem;
  }

  md-icon {
    margin: 0 1rem 0 0.5rem;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: left;
    text-align: left;
  }
  section#aim > span > span > ol {
    text-align: left;
  }

  section#essential-links > ul > li {
    display: flex;
    text-align: left;
  }

  @media (max-width: 600px) {
    div.scroll {
      padding: 3rem 1rem;
      max-width: calc(100% - 2rem);
    }

    section {
      align-items: center;
      text-align: center;
    }

    section#aim > span > span > ol {
      padding: 0;
      text-align: left;
    }

    section#essential-links > ul > li {
      flex-direction: column;
      text-align: center;
    }

    section > ul {
      padding: 0;
    }

    h1 {
      zoom: 0.7;
      text-align: center;
    }
  }

  @media (min-width: 601px) and (max-width: 768px) {
    div.scroll {
      padding: 3rem 1rem;
      max-width: calc(100% - 2rem);
    }

    section#essential-links > ul > li {
      flex-direction: row;
    }

    h1 {
      zoom: 0.85;

      text-align: center;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    section#essential-links > ul > li {
      flex-direction: row;
      text-align: left;
    }

    h1 {
      text-align: center;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    section#essential-links > ul > li {
      flex-direction: row;
      text-align: left;
    }

    h1 {
      text-align: left;
    }
  }

  @media (min-width: 1201px) {
    section#essential-links > ul > li {
      flex-direction: row;
      text-align: left;
    }

    h1 {
      text-align: left;
    }
  }
</style>
