<script lang="ts">
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";

  import { UtilsService } from "../../services";

  let search = "";

  function manageKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") return doSearch();

    const target = event.target as HTMLElement;

    const value = UtilsService.getInputFromMUITextField(target)!.value;

    search = value;
  }

  function setInputMinWidth() {
    const target = document.querySelector(
      "md-outlined-text-field#searchbar"
    ) as HTMLElement;

    const parentWidth = target.clientWidth;

    const element = UtilsService.getParentInputFromMUITextField(target);
    const padding = 58;
    element!.style.minWidth = parentWidth - padding + "px";
  }

  onMount(() => {
    window.addEventListener("resize", setInputMinWidth);

    setTimeout(() => {
      setInputMinWidth();
    }, 10);
  });

  function doSearch() {
    if (search.replaceAll(" ", "") === "") return 0;

    navigate("/search/" + search);
    search = "";
  }
</script>

<md-outlined-text-field
  id="searchbar"
  on:keyup={manageKeyPress}
  value={search}
  tabindex="0"
  hasLeadingIcon="true"
  hasTrailingIcon="true"
  role="searchbox"
  aria-roledescription="Search button"
>
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <md-icon
    slot="leading-icon"
    role="search"
    tabindex="0"
    on:click={doSearch}
    on:keypress={doSearch}><md-ripple />search</md-icon
  >
</md-outlined-text-field>

<style>
  md-outlined-text-field {
    --md-outlined-text-field-container-shape: 100px;
    resize: none;
    padding: 0;
  }

  md-icon {
    transition: outline 10s;
    cursor: pointer;
    padding: 15px 8px 15px 15px;
    position: absolute;
    left: 0;
    top: 1px;
  }

  md-ripple {
    opacity: 0.1;
  }

  md-icon:active,
  md-icon:focus,
  md-icon:hover {
    color: var(--md-sys-color-primary);
  }

  md-icon:active md-ripple,
  md-icon:focus md-ripple,
  md-icon:hover md-ripple {
    background: var(--md-sys-color-on-surface);
  }

  md-ripple,
  md-icon {
    border-radius: 100% 0% 0% 100%;
  }
</style>
