<script lang="ts">
  import { writable, type Writable } from "svelte/store";
  import { onDestroy, onMount } from "svelte";

  import config from "../../../config";

  export let image;

  function isBlob(source: string) {
    return source.includes("blob:");
  }

  function observe() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = imageURL;
          img.onload = () => {
            spanBG!.style.backgroundColor = "inherit";
            span!.style.backgroundImage = `url(${imageURL})`;
            spanBG!.style.backgroundImage = `url(${imageURL})`;

            loaded.set(true);
          };

          observer.unobserve(span!);
        }
      });
    });

    observer.observe(span!);
  }

  let span: HTMLSpanElement;
  let spanBG: HTMLSpanElement;
  let observer: IntersectionObserver;

  const loaded: Writable<boolean> = writable(false);
  let imageURL = isBlob(image) ? image : "/api/image/" + image;

  $: if (image) imageURL = isBlob(image) ? image : "/api/image/" + image;

  onMount(observe);

  onDestroy(observer!.disconnect);
</script>

<span
  bind:this={spanBG}
  class:loaded={$loaded}
  style="
    position:absolute;
    background-color: var({config.css.variables.onInverseSurface});
    filter: blur(20px)"
  role="img"
  aria-label="Song picture background effect."
/>
<span
  bind:this={span}
  class="image"
  class:loaded={$loaded}
  style="filter: drop-shadow(0px 0px 10px var{config.css.variables.shadow}); "
  role="img"
  aria-label="Song picture."
/>

<style>
  span {
    width: var(--list-audiobox-image-size);
    height: var(--list-audiobox-image-size);
    background-position: center;
    background-size: cover;
    position: relative;
    opacity: 0;
    transition: opacity 10s ease;
  }

  span.loaded {
    animation: load-image 0.25s ease forwards;
  }

  @keyframes load-image {
    from {
      opacity: 0.1s;
    }

    to {
      opacity: 1;
    }
  }
</style>
