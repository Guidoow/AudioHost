<script lang="ts">
  export let image: string;
</script>

<div style="background-image: url({image});" />
<img src={image} alt="" />

<style>
  div {
    position: absolute;
    background-position: center;
    background-repeat: no-repeat;

    min-height: 100%;
    max-height: 100%;
  }

  div {
    background-size: 100% 100%;
    min-width: 100%;
    max-width: 100%;
    mask-image: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.5) 100%
    );

    filter: blur(40px);
  }

  img {
    user-select: none;
    -webkit-user-drag: none;
    position: absolute;
    min-height: 100%;
    min-width: 100%;
    opacity: 0.7;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 100%
    );
  }
</style>
