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
  name: 'ModeSwitcher',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    options: {
      size: {
        fontSize: 1,
        height: 2,
        width: 20,
      },
      items: {
        preSelected: 'Spread',
        labels: [
          {name: 'Spread'},
          {name: 'Yield'},
          {name: '3MLSpread'}
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