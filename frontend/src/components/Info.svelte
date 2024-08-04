<script lang="ts">
  import config from "../config";
</script>

<div
  class="scroll-wrapper
    {config.css.shape.l} 
    {config.css.colors.surface}"
>
  <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
    <h1 class={config.css.typography.displayMedium} style="text-align: center;">
      Information
    </h1>

    <section>
      <h3 class={config.css.typography.headlineLarge}>Purpose</h3>

      <span>
        <p>
          This web page is mainly designed to expose the author's knowledge and
          skills about software development.
        </p>

        <p>
          The idea is to create a web page working with some common features of
          a real web page, as can be file treatment, design, connections
          management, and so on.
        </p>
      </span>
    </section>

    <divider-min />

    <section id="technologies">
      <h3 class={config.css.typography.headlineLarge}>Technologies</h3>

      <span>
        <p>
          There are several technologies working together to do this web work.
          <br />
          Here is a list explaining which role accomplish each one of the relevants
          technologies used here:
        </p>

        <ol>
          <li>
            <span>Node.js</span>

            <md-icon>check_indeterminate_small</md-icon>

            <span>
              As the runtime enviroment for <b>Javascript</b>, using <b>NPM</b>
              to implement
              <b>Typescript</b> and "transpile" from TS to JS.
            </span>
          </li>

          <li>
            <span>Docker</span>

            <md-icon>check_indeterminate_small</md-icon>

            <span>
              Responsible of manage the deployment of the application divided in
              containers, including server proxy, backend, frontend, database
              and database cluster.
            </span>
          </li>

          <li>
            <span>Nginx</span>

            <md-icon>check_indeterminate_small</md-icon>

            <span>
              Acting as proxy server, managing incoming connections and
              redirectioning them, wheter they are for backend, frontend or
              static files.
            </span>
          </li>

          <li>
            <span>Nest.js</span>

            <md-icon>check_indeterminate_small</md-icon>

            <span>
              Used with
              <b>Typescript</b>, to manage the back end tasks, as check clients
              information and permissions, file management as uploading,
              processing and storaging, and so on. <b>Prisma</b>
              ORM is used in this case for simplify the interaction with the database.
            </span>
          </li>

          <li>
            <span>Mongo</span>

            <md-icon>check_indeterminate_small</md-icon>

            <span>
              Implemented with an additional cluster in this case, adding
              reliability. Used to storing client basic information and song
              data and its stats
            </span>
          </li>

          <li>
            <span>Svelte </span>

            <md-icon>check_indeterminate_small</md-icon>

            <span>
              Used with
              <b>Typescript</b>, to manage the front end tasks, as can be good
              looking designed components, requests management, or even interact
              displaying the audio accordingly with the soundbars. Using
              <b>MUI3 (Material Design)</b>
              to simplify color picking and beautifullness of the design. Using
              <b>Vite</b> to serve the SPA itself, but also static files.
            </span>
          </li>
        </ol>
      </span>
    </section>

    <divider-min />

    <section>
      <h3 class={config.css.typography.headlineLarge}>How</h3>

      <span>
        <p>The most relevant points here are Clients, Files and Audios.</p>

        <h5 class={config.css.typography.headlineSmall}>Client</h5>

        <span>
          The management of clients here is very simple: As we do not need
          users, because the purpose of this web, we preferred to manage clients
          by its <b>public IP</b>, given by the client ISP. In that manner, we
          let clients take part or involve easily, avoiding cumbersome and
          unnecesary registration process.
        </span>

        <h5 class={config.css.typography.headlineSmall}>File</h5>

        <span>
          The files are managed in different ways depending the sections: To
          process the requests with files and upload the files, we use
          <b>Multer</b>, files are converted to '.wav' (may not be the best
          solution to storage) to be managed, while images are converted to
          '.webp', then are stored in a specific folder, while the uploaded
          files are removed. In the case that something fails, a rollback occurs
          and delete the uploaded files.
        </span>

        <h5 class={config.css.typography.headlineSmall}>Audio</h5>

        <span>
          Audio management is a little bit more complex, but I basically use the
          library "node-wav" to, starting from a '.wav' file, decode its data,
          normalizing it as mono if needed, then the raw data is cutted in
          chunks that once normalized, will define the size of each tile in the
          soundbar, based on the song sound.
        </span>
      </span>
    </section>
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
    min-height: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
  }

  section:last-child {
    padding-bottom: 5rem;
  }

  section > span {
    margin-left: 0rem;
  }

  li {
    display: flex;
    padding: 0.25rem 0;
  }

  li > span:first-child {
    min-width: 60px;
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

    section#technologies > span > ol {
      padding: 0;
      text-align: left;
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

    h1 {
      zoom: 0.85;

      text-align: center;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    h1 {
      text-align: center;
    }
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    h1 {
      text-align: left;
    }
  }

  @media (min-width: 1201px) {
    h1 {
      text-align: left;
    }
  }
</style>
