<template>
  <div>
    <MultiSwitch
        :options="options"
        @change="change"
        multiple
    />
  </div>
</template>

<script>
import MultiSwitch from "@/components/MultiSwitch"
export default {
  name: 'YearsSwitcher',
  data: () => ({
    periods: []
  }),
  computed: {
    options () {
      return {
        size: {
          fontSize: 1,
          height: 2,
          width: 16,
        },
        items: {
          preSelected: this.periods.map(item => `${item} YRS`),
          labels: this.periods.map(item => ({name: `${item} YRS`}))
        }
      }
    }
  },
  methods: {
    setPeriods (periods) {
      this.periods = periods
    },
    change (event) {
      this.$emit('input', event.value)
    }
  },
  created () {
    this.$eventHub.$on(`periodsBroadcast`, this.setPeriods)
    this.$eventHub.$emit(`periodsRequest`)
  },
  components: {
    MultiSwitch
  }
}
</script>

<style scoped>

</style>
