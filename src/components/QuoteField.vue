<template>
  <td>
    <div
      class="quote-field"
    >
      <div
        class="centered"
        :class="{'minimal': !widen && minimal && rawValue('FIX') === minimal.FIX && minimal.FIX}"
      >
        {{ typeValue('FIX') }}
      </div>
      <div
        class="centered"
        :class="{'minimal': !widen && minimal && rawValue('FRN') === minimal.FRN && minimal.FRN}"
      >
        {{ typeValue('FRN') }}
      </div>
    </div>
  </td>
</template>

<script>
export default {
  name: 'QuoteField',
  props: {
    companyData: {
      type: Array
    },
    mode: {
      type: String,
      required: true
    },
    currentMode: {
      type: String
    }
  },
  data: () => ({
    activeCurrency: null,
    minimal: null
  }),
  computed: {
    widen () {
      return this.mode !== this.currentMode
    },
    years () {
      return this.companyData && this.companyData.map(item => item.Years)[0] || null
    },
    signature () {
      if (!this.activeCurrency || !this.companyData || !this.companyData[0] || !this.mode || !this.years) {
        return null
      }
      return `${this.activeCurrency}${this.years}${this.mode}`
    }
  },
  methods: {
    setActiveCurrency (currency) {
      this.activeCurrency = currency
    },
    rawValue (type) {
      const relevant = this.companyData && this.companyData.find(item => item.CouponType === type) || null
      return relevant && relevant[this.mode] || null
    },
    typeValue (type) {
      let result
      const relevant = this.companyData && this.companyData.find(item => item.CouponType === type) || null
      const value = relevant && relevant[this.mode] || null
      if (['Spread', '3MLSpread'].includes(this.mode)) {
        +value ? result = `+${value}bp` : null
      } else {
        +value ? result = `${value.toFixed(3)}%` : null
      }
      return result
    },
    setMinimal (minimal) {
      this.minimal = minimal
    },
    requestMinimal () {
      this.$eventHub.$on(`minimalResponse${this.signature}`, this.setMinimal)
      this.$eventHub.$emit('minimalRequest', {
        currency: this.activeCurrency,
        years: this.years,
        mode: this.mode,
        signature: this.signature
      })
    }
  },
  mounted () {
    if (this.signature) {
      this.requestMinimal()
    }
  },
  created () {
    this.$eventHub.$on(`activeCurrencyBroadcast`, this.setActiveCurrency)
    this.$eventHub.$emit(`activeCurrencyRequest`)
  },
  watch: {
    mode () {
      this.requestMinimal()
    }
  }
}
</script>

<style scoped>
</style>