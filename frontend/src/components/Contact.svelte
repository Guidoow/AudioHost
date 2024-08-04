<script lang="ts">
  import Linkedin from "./assets/Linkedin.svelte";
  import Github from "./assets/Github.svelte";

  import config from "../config";

  const githubURL = "https://github.com/Guidoow";
  const linkedinURL = "https://www.linkedin.com/in/guidoow/";
  const mailtoURL = "mailto:guidomoran.ap@gmail.com?subject=Contact";
</script>

<section style="margin: 3rem 0 3rem 0;">
  <h3
    style="display:flex; margin: 0rem 0rem 2rem 0rem;"
    class={config.css.typography.headlineLarge}
  >
    Contact
  </h3>

  <span class={config.css.typography.bodyLarge}>
    It is a pleasure to keep connected with you. I'm generally working on
    projects every day, but it's always exciting to talk to other people like
    you.
  </span>
  <span class={config.css.typography.bodyLarge}>
    I'm open to any offers or invitations, you can even ask me for help on any
    topic at development, it would be great try to help you!
  </span>

  <ul>
    <li class={config.css.typography.bodyLarge}>
      <md-icon>mail</md-icon>
      <a href={mailtoURL} tabindex={-1}>
        <md-outlined-button> Email </md-outlined-button>
      </a>
    </li>

    <li class={config.css.typography.bodyLarge}>
      <md-icon><Github /></md-icon>
      <a target="_blank" href={githubURL} tabindex={-1}>
        <md-outlined-button> Github </md-outlined-button>
      </a>
    </li>

    <li class={config.css.typography.bodyLarge}>
      <md-icon><Linkedin /></md-icon>
      <a target="_blank" href={linkedinURL} tabindex={-1}>
        <md-outlined-button> LinkedIN </md-outlined-button>
      </a>
    </li>
  </ul>
</section>

<style>
  li {
    display: flex;
    align-items: center;
  }

  md-outlined-button {
    min-width: 10rem;
  }

  @media (max-width: 600px) {
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    ul {
      padding: 0;
    }

    li {
      flex-direction: column;
      margin: 0;
    }

    md-outlined-button {
      margin: 1rem;
    }
  }

  @media (min-width: 601px) and (max-width: 768px) {
    li {
      flex-direction: row;
      margin: 2rem 0;
    }

    md-outlined-button {
      margin: 0 0 0 1rem;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    li {
      flex-direction: row;
      margin: 2rem 0;
    }

    md-outlined-button {
      margin: 0 0 0 1rem;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    li {
      flex-direction: row;
      margin: 2rem 0;
    }

    md-outlined-button {
      margin: 0 0 0 1rem;
    }
  }

  @media (min-width: 1201px) {
    li {
      flex-direction: row;
      margin: 2rem 0;
    }

    md-outlined-button {
      margin: 0 0 0 1rem;
    }
  }
</style>
