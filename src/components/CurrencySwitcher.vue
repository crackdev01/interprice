<template>
  <div>
    <MultiSwitch
        :options="options"
        @change="change"
    />
  </div>
</template>

<script>
import MultiSwitch from "@/components/MultiSwitch"
export default {
  name: 'CurrencySwitcher',
  data: () => ({
    options: {
      size: {
        fontSize: 1,
        height: 2,
        width: 10,
      },
      items: {
        preSelected: 'USD',
        labels: [
          {name: 'USD'},
          {name: 'EUR'},
          {name: 'CAD'}
        ]
      }
    }
  }),
  methods: {
    change (event) {
      this.$emit('input', event.value)
    }
  },
  components: {
    MultiSwitch
  }
}
</script>

<style scoped>

</style>