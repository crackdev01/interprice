<template>
  <div
    class="quote-header"
  >
    <div
        class="top-header"
    >
      <strong>{{ years }} YRS</strong>
    </div>
    <div
        class="bottom-header"
    >
      <div>FIX</div>
      <div>FRN</div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'QuoteHeader',
  props: {
    years: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.bottom-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

}
.top-header {
  text-align: center;
  border-bottom: 1px solid black;
}
.quote-header {
  display: flex;
  flex-direction: column;
}
</style>