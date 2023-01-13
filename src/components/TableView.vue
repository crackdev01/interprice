<template>
  <div class="mt-7 ml-5 mr-5">
    <v-row>
      <CurrencySwitcher
        v-model="currency"
      />
      <div class="mr-5"/>
      <YearsSwitcher
        v-model="shownYears"
      />
      <div class="mr-5"/>
      <ModeSwitcher
        v-model="currentMode"
      />
    </v-row>
    <v-row>
      <CompanyFilter @setCompanyName="filterCompanyName" />
    </v-row>
    <v-row>
      <v-card width="100vw">
        <v-data-table
          hide-default-footer
          show-expand
          item-key="Id"
          :items="CompanyName != '' ? getFilteredData : rows"
          :headers="headers"
          :expanded.sync="expanded"
        >
          <template
              v-for="header in quoteHeaders"
              v-slot:[`header.${header.value}`]
          >
            <QuoteHeader
                :years="header.duration"
                :key="header.value"
            />
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <ExpandIcon
                  v-model="expanded"
                  :item="item"
                />
              </td>
              <td>
                {{ item.DateSent | moment('DD-MMM-YY') }}
              </td>
              <td>
                <span
                  :style="{'font-weight': item.Quote ? 'bold' : 'normal'}"
                >
                  {{ item.Company }}
                </span>
              </td>
              <template
                v-for="period in periods"
              >
                <QuoteField
                    v-if="shownYears.includes(`${period} YRS`)"
                    :key="period"
                    :company-data="companyYearsData({id: item.Id, years: period})"
                    :mode="currentMode"
                    :current-mode="currentMode"
                />
              </template>
            </tr>
          </template>
          <template v-slot:expanded-item="{ item }">
            <template
              v-for="(pos, index) in [0, 1]"
            >
              <WidenRow
                :shown-years="shownYears"
                :key="`expanded${index + 10 * Math.random()}`"
                :common-data="item"
                :current-mode="currentMode"
                :position="pos"
              />
            </template>
          </template>
          <template v-slot:body.append>
            <tr>
              <td></td><td></td>
              <td>{{ `Average by ${currentMode}` }}</td>
              <template
                v-for="(header, index) in quoteHeaders"
              >
                <td
                  :key="`${header.value}${index}`"
                >
                  <div
                      class="quote-field"
                  >
                    <div
                      class="centered"
                    >
                      {{ average({currency: currency, years: +header.duration, mode: currentMode, type: 'FIX'}) }}
                    </div>
                    <div
                      class="centered"
                    >
                      {{ average({currency: currency, years: +header.duration, mode: currentMode, type: 'FRN'}) }}
                    </div>
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import WidenRow from "@/components/WidenRow"
import ExpandIcon from "@/components/ExpandIcon"
import QuoteField from "@/components/QuoteField"
import QuoteHeader from "@/components/QuoteHeader"
import CurrencySwitcher from "@/components/CurrencySwitcher"
import YearsSwitcher from "@/components/YearsSwitcher"
import ModeSwitcher from "@/components/ModeSwitcher"
import CompanyFilter from "@/components/CompanyFilter"

export default {
  name: 'TableView',
  props:{
    rawData: {
      type: Array,
      required: true
    }
  },
  data: () =>  ({
    expanded: [],
    modes: ['Spread', 'Yield', '3MLSpread'],
    currency: 'USD',
    currentMode: 'Spread',
    shownYears: [],
    CompanyName: ''
  }),
  computed: {
    rows () {
      return this.rawData
    },
    getFilteredData() {
      return this.rawData.filter(item => item.Company.toLowerCase().includes(this.CompanyName.toLowerCase()));
    },
    periods () {
      let periods = []
      this.rawData.forEach(item => {
        if (item.Quote) {
          item.Quote.forEach(quote => quote.Currency === this.currency ? periods.push(+quote.Years) : null)
        }
      })
      return [... new Set(periods)].sort((a, b) => a - b)
    },
    years () {
      return this.periods.map(item => `${item} YRS`)
    },
    quoteHeaders () {
      const sortFn = (a, b) => a.duration - b.duration
      let result = []
      this.years.forEach(item => {
        if (this.shownYears.includes(item)) {
          const itemParams = item.split(' ')
          result.push({
            value: `col${itemParams.join('')}`,
            duration: +itemParams[0],
            sortable: false,
            width: `${100 / this.shownYears.length}%`
          })
        }
      })
      return result.sort(sortFn)
    },
    headers () {
      const stat = [
        {text: '', value: 'data-table-expand'},
        {text: 'DATE SENT', value: 'DateSent', width: '10em'},
        {text: 'COMPANY', value: 'Company', width: '20em'}
      ]
      return [...stat, ...this.quoteHeaders]
    },
    allQuotes () {
      let result = []
      this.rawData.forEach(data => data.Quote ? data.Quote.forEach(quote => result.push(quote)) : null)
      return result
    }
  },
  methods: {
    minimal ({currency, years, type, mode}) {
      const check = quote => quote.Currency === currency && +quote.Years === years && quote.CouponType === type
      const relevant = this.allQuotes.filter(quote => check(quote)).filter(item => +item[mode])
      const values = relevant.map(item => +item[mode]).sort((a, b) => a - b)
      return values[0]
    },
    average ({currency, years, type, mode}) {
      let result
      const check = quote => quote.Currency === currency && +quote.Years === years && quote.CouponType === type
      const adder = (a, b) => a + b[mode]
      const relevant = this.allQuotes.filter(quote => check(quote)).filter(item => +item[mode])
      const amount = relevant.reduce(adder, 0)
      const value = amount / relevant.length
      if (['Spread', '3MLSpread'].includes(mode)) {
        +value ? result = `+${Math.round(value)}bp` : null
      } else {
        +value ? result = `${value.toFixed(3)}%` : null
      }
      return result
    },
    companyYearsData ({id, years}) {
      const companyData = this.rawData.find(item => item.Id === id) || null
      return companyData && companyData.Quote && companyData.Quote
          .filter(item => item.Years === years && item.Currency === this.currency) || null
    },
    sendExpandedData (id) {
      const sortFn = (a, b) => a.period - b.period
      const expandedData = this.shownYears.map(title => +title.split(' ')[0])
          .map(period => ({
            period: period,
            yearsData: this.companyYearsData({id: id, years: period
            })}))
          .sort(sortFn)
      this.$eventHub.$emit(`expandedDataResponse${id}`, expandedData)
    },
    broadcastActiveCurrency () {
      this.$eventHub.$emit('activeCurrencyBroadcast', this.currency)
    },
    periodsBroadcast () {
      this.$eventHub.$emit('periodsBroadcast', this.periods)
    },
    minimalResponse (data) {
      const {currency, years, mode, signature} = data
      const FIX = this.minimal({currency, years, mode, type: 'FIX'})
      const FRN = this.minimal({currency, years, mode, type: 'FRN'})
      this.$eventHub.$emit(`minimalResponse${signature}`, {FIX, FRN})
    },
    filterCompanyName(e) {
      this.CompanyName = e.filter
    }
  },
  created () {
    this.shownYears = this.years
    this.$eventHub.$on('expandedDataRequest', this.sendExpandedData)
    this.$eventHub.$on('activeCurrencyRequest', this.broadcastActiveCurrency)
    this.$eventHub.$on('periodsRequest', this.periodsBroadcast)
    this.$eventHub.$on('minimalRequest', this.minimalResponse)
  },
  watch: {
    years (val) {
      this.shownYears = val
    },
    currency () {
      this.broadcastActiveCurrency()
    },
    periods () {
      this.periodsBroadcast()
    }
  },
  components: {
    CurrencySwitcher,
    YearsSwitcher,
    ModeSwitcher,
    CompanyFilter,
    QuoteHeader,
    QuoteField,
    ExpandIcon,
    WidenRow
  }
}
</script>

<style scoped>
</style>