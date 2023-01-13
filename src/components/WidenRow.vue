<template>
  <tr>
    <td></td><td></td>
    <td>{{ ownMode }}</td>
    <template
        v-for="(item, index) in expandedData"
    >
      <QuoteField
          v-if="shownPeriods.includes(item.period)"
          :company-data="item.yearsData"
          :mode="ownMode"
          :current-mode="currentMode"
          :key="index"
      />
    </template>

  </tr>
</template>

<script>
import QuoteField from "@/components/QuoteField"
export default {
  name: 'WidenRow',
  props: {
    commonData: {
      type: Object,
      required: true
    },
    currentMode: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    shownYears: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    allModes: ['Spread', 'Yield', '3MLSpread'],
    expandedData: []
  }),
  computed: {
    shownPeriods () {
      return this.shownYears.map(item => +item.split(' ')[0])
    },
    ownMode () {
      const remaining = this.allModes.filter(item => item !== this.currentMode)
      return remaining[this.position]
    }
  },
  methods: {
    setExpandedData (data) {
      this.expandedData = data
    }
  },
  created () {
    this.$eventHub.$on(`expandedDataResponse${this.commonData.Id}`, this.setExpandedData)
    this.$eventHub.$emit(`expandedDataRequest`, this.commonData.Id)
  },
  components: {
    QuoteField
  }
}
</script>

<style scoped>

</style>