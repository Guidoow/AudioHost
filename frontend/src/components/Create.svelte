<script lang="ts">
  import ListAudiobox from "./audioBox/list/Audiobox.svelte";
  import AudioSVG from "./assets/Audio.svelte";
  import Check from "./assets/ValidFile.svelte";
  import Image from "./assets/Image.svelte";

  import { onMount } from "svelte";

  import { UtilsService, RequestService } from "../services";
  import { AppState } from "../globals";
  import config from "../config";

  import { type Song, HttpStatus } from "../types";
  import { Link } from "svelte-routing";

  let title = "";
  let author = "";
  let wave100 = Array(100).fill(0);
  let wave220 = Array(220).fill(0);

  let audioFiles: FileList | null;
  let imageFiles: FileList | null;
  let audioInput: HTMLElement | null;
  let imageInput: HTMLElement | null;

  let loaded = false;
  let posting = false;

  let src = "";
  let image = "default-song.png";

  let song: Song | null;

  $: if (audioFiles && audioFiles[0]) {
    setFile(audioFiles[0], true);
  }

  $: if (imageFiles && imageFiles[0]) {
    setFile(imageFiles[0], false);
  }

  $: if (song) {
    song = {
      ...song,
      wave100,
      wave220,
      author: author.replaceAll(" ", "") === "" ? "Author" : author,
      title: title.replaceAll(" ", "") === "" ? "Title" : title,
      image,
      src,
      likes: 0,
      views: 0,
    };
  }

  const validExtensions = {
    audio: ["mp3", "wav"],
    image: ["jpeg", "jpg", "png", "tiff"],
  };

  const currentlyDragging = {
    image: false,
    audio: false,
  };

  const drop = async (e: DragEvent) => {
    let file = e.dataTransfer!.files[0];
    const target = (e.target || e.currentTarget) as HTMLElement;

    if (!file) return 0;

    const isAudio = target.id === "input-audio";

    if (isAudio && isValidFile(file, "audio")) audioFiles![0] = file;
    else if (isValidFile(file, "image")) imageFiles![0] = file;

    setFile(file, isAudio);
  };

  const drag = (event: DragEvent) => {
    const type =
      (event.target as HTMLElement).id === "input-audio" ? "audio" : "image";

    currentlyDragging[type] = event.type === "dragenter";
  };

  function isValidFile(file: File, type: "audio" | "image") {
    const extension = file.name.split(".").pop();
    const validExt = validExtensions[type].includes(extension!);
    return validExt;
  }

  function generateWave(type: "220" | "100" = "220") {
    const wave = [];

    for (let i = 0; i < Number(type); i++) {
      wave.push(Math.random() * 2.5);
    }

    return wave;
  }

  function setFile(file: File, isAudio: boolean) {
    const url = URL.createObjectURL(file as Blob);

    if (song)
      if (isAudio) {
        src = url;

        wave100 = generateWave("100");
        wave220 = generateWave("220");
      } else image = url;
  }

  function displayInputFile(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();

    if (event instanceof KeyboardEvent) return 0;

    const target = (event.target || event.currentTarget) as HTMLElement;
    const isAudio = target.id === "input-audio";

    if (!imageInput || !audioInput) return;

    (isAudio ? audioInput : imageInput).click();
  }

  async function postSong() {
    if (posting) return;
    posting = true;
    const body = new FormData();

    const filesExceedSize =
      (audioFiles && audioFiles.length ? audioFiles[0].size : 0) +
        (imageFiles && imageFiles.length ? imageFiles[0].size : 0) >
      25_000_000;

    if (
      !audioFiles?.[0] ||
      !title ||
      title === "" ||
      !author ||
      author === "" ||
      filesExceedSize
    ) {
      const list = document.createElement("ul");
      const baseError = "is required.";

      if (!author || author === "") {
        const item = document.createElement("li");
        item.textContent = `Author ${baseError}`;
        list.insertAdjacentElement("beforeend", item);
      }

      if (!title || title === "") {
        const item = document.createElement("li");
        item.textContent = `Title ${baseError}`;
        list.insertAdjacentElement("beforeend", item);
      }

      if (!audioFiles?.[0]) {
        const item = document.createElement("li");
        item.textContent = `Audio ${baseError}`;
        list.insertAdjacentElement("beforeend", item);
      }

      if (filesExceedSize) {
        const item = document.createElement("li");
        item.textContent = `Files size must not exceed 25mb`;
        list.insertAdjacentElement("beforeend", item);
      }

      posting = false;
      return UtilsService.displayDialog("Error", list);
    }

    body.append("audio", audioFiles[0]);

    body.append("title", title);

    body.append("author", author);

    if (imageFiles && imageFiles[0]) body.append("image", imageFiles[0]);

    const response = await RequestService.custom({
      convertBody: false,
      url: "api/song",
      body,
    });

    const status = response.statusCode;

    if (status === HttpStatus.ACCEPTED) {
      UtilsService.displayDialog(
        "Song created",
        "You have created a song correctly."
      );

      setTimeout(async () => {
        await UtilsService.getClient();
      }, 1000);
    } else if (status === HttpStatus.UNAUTHORIZED) {
      UtilsService.displayDialog(
        "Insufficient permissions",
        "You already have a song created."
      );
    } else if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      UtilsService.displayDialog("File too large", response.message);
    } else {
      UtilsService.displayDialog(
        "Server error",
        "Something failed in the server.  :( "
      );
    }

    posting = false;
  }

  onMount(() => {
    song = {
      wave100,
      wave220,
      UUID: crypto.randomUUID(),
      date: new Date(),
      title,
      author,
      image,
      src,
      likes: 0,
      views: 0,
      saved: 0,
      comments: 0,

      isCreating: true,
    };
    loaded = true;

    setTimeout(() => {
      audioInput = document.getElementById("input-file-audio");
      imageInput = document.getElementById("input-file-image");
    }, 100);
  });

  function manageKeyPress(event: KeyboardEvent) {
    event.preventDefault();

    const target = event.target as HTMLElement;

    const isTitle = target.id === "input-title";

    const value = UtilsService.getInputFromMUITextField(target)!.value;

    isTitle ? (title = value) : (author = value);
  }
</script>

<div class="scroll-wrapper {config.css.shape.l}  {config.css.colors.surface}">
  <div class="scroll {config.css.shape.l} {config.css.colors.surface}">
    {#if loaded}
      {#if $AppState.client.Song}
        <h1
          style="
        margin: 1rem;
        color:var({config.css.colors.onSecondaryContainer});"
        >
          You already have a song created.
        </h1>

        <div class="box-bottom" style="margin: 3rem 0;">
          <ListAudiobox song={$AppState.client.Song} isSingle={true} />
        </div>

        <divider-min />

        <Link to="explore?filter=recent" tabindex={-1} style="margin: 2rem 0;">
          <md-outlined-button> Explore community songs </md-outlined-button>
        </Link>
      {:else}
        <h1
          style="
        margin: 1rem;
        color:var({config.css.colors.onSecondaryContainer});"
        >
          Upload your song
        </h1>

        <div class="box-top">
          <md-outlined-text-field
            style="
          zoom: 0.9;
          --md-outlined-text-field-container-shape: 10px;"
            aria-roledescription="input text"
            role="textbox"
            tabindex="0"
            id="input-author"
            value={author}
            label="Author"
            on:keyup={manageKeyPress}
          />

          <md-outlined-text-field
            style="
          zoom: 0.9; 
          --md-outlined-text-field-container-shape: 10px;"
            aria-roledescription="input text"
            role="textbox"
            tabindex="0"
            id="input-title"
            value={title}
            label="Title"
            on:keyup={manageKeyPress}
          />

          <div class="file-container">
            <div class="input-file-box">
              <md-elevated-button
                class="nav-right"
                aria-roledescription="File input audio"
                aria-dropeffect="move"
                role="listbox"
                tabindex="0"
                on:dragenter={drag}
                on:dragleave={drag}
                on:dragover|preventDefault|stopPropagation
                on:click|stopPropagation={displayInputFile}
                on:drop|preventDefault|stopPropagation={drop}
                on:keydown|stopPropagation={displayInputFile}
                id="input-audio"
              >
                <span class="input-label">Song</span>
                <span class="input-file">
                  {#if currentlyDragging["audio"] || audioFiles?.[0]}
                    <Check />
                  {:else}
                    <AudioSVG />
                  {/if}
                </span>
              </md-elevated-button>
              <input
                type="file"
                id="input-file-audio"
                accept="audio/wav, audio/mp3, audio/*"
                hidden
                bind:files={audioFiles}
              />
            </div>

            <div class="input-file-box">
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <md-elevated-button
                aria-roledescription="File input image"
                role="listbox"
                tabindex="0"
                aria-dropeffect="move"
                on:dragenter={drag}
                on:dragleave={drag}
                on:dragover|preventDefault|stopPropagation
                on:drop|preventDefault|stopPropagation={drop}
                on:click|preventDefault|stopPropagation={displayInputFile}
                on:keydown|stopPropagation={displayInputFile}
                id="input-image"
              >
                <span class="input-label">Image</span>
                <span class="input-file">
                  {#if currentlyDragging["image"] || imageFiles?.[0]}
                    <Check />
                  {:else}
                    <Image />
                  {/if}
                </span>
              </md-elevated-button>
              <input
                type="file"
                id="input-file-image"
                accept="image/*"
                hidden
                bind:files={imageFiles}
              />
            </div>
          </div>

          <md-filled-button
            role="button"
            tabindex="0"
            style="margin: 2rem 1.5rem 1.5rem 1.5rem;"
            on:click={postSong}
            on:keydown
          >
            Upload
          </md-filled-button>
        </div>

        <divider-min />

        <h2
          style="
          margin-top:0.5rem;
          color:var({config.css.colors.onSecondaryContainer});"
        >
          Song preview
        </h2>
        <div class="box-bottom">
          {#if song}
            <ListAudiobox {song} isSingle={true} />
          {/if}
        </div>
      {/if}
    {/if}
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
    text-align: center;

    box-sizing: border-box;
  }

  .box-top,
  .box-bottom {
    position: relative;
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;

    width: 100%;
  }

  .box-bottom {
    height: fit-content;
  }

  md-outlined-text-field {
    display: inline-block;
    min-width: 50%;
    max-width: 80%;

    position: relative;
    margin: 10px;

    resize: none;
  }

  .file-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    min-width: 50%;
    margin: 10px;

    align-items: center;
  }

  .input-file-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    margin: 0.5rem;
  }

  .input-label {
    user-select: none;
    pointer-events: none;
  }

  .input-file {
    min-width: 70px;
    max-width: 70px;
    min-height: 70px;
    max-height: 70px;

    user-select: none;
    pointer-events: none;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;

    padding: 5px;
  }

  md-elevated-button {
    --md-elevated-button-container-shape: 0px;
  }
</style>
