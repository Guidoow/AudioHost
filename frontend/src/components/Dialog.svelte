<script lang="ts">
  export let headline = "Headline";
  export let slot: string = "Content";
</script>

<md-dialog open>
  <div slot="headline">{headline}</div>

  <div slot="content">
    {@html slot}
  </div>
</md-dialog>

<style>
  div[slot="content"] {
    padding: 4rem;
  }
</style>
