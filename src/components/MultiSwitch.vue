<template>
  <div>
    <ul
        class="toggle-switch"
        :class="{'square' : defaultOptions.layout.squareCorners}"
        :style="toggleSwitchStyle"
    >
      <li
          :style="itemStyle"
          v-for="(label, index) in defaultOptions.items.labels"
          :key="index"
      >
        <input
            :disabled="defaultOptions.items.disabled || disabled"
            :id="label.name + group" :value="label.name"
            :name="name"
            type="radio"
            v-on:click="toggle"
        >
        <label
            v-if="selectedArray.includes(label.name) || label.name === selectedItem"
            :style="labelStyleSelected(label.color, label.backgroundColor)"
            :class="{ active: !defaultOptions.items.disabled || disabled}"
            class="selected"
            :for="label.name + group"
            type="radio"
        >
          {{ label.name }}
        </label>
        <label
            v-else
            :style="labelStyle"
            :class="{active: !defaultOptions.items.disabled || disabled}"
            :for="label.name + group"
            type="radio"
        >
          {{ label.name }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
const s = x => x + 's'
const rem = v => v + 'rem'
export default {
  name: 'MultiSwitch',
  props: {
    options: {
      type: Object,
      required: false
    },
    value: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    group: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created () {
    this.defaultOptions = {
      layout: {
        color: this.primaryColor,
        backgroundColor: 'white',
        selectedColor: 'white',
        selectedBackgroundColor: this.primaryColor,
        borderColor: 'gray',
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontWeightSelected: 'normal',
        squareCorners: false,
        noBorder: false
      },
      size: {
        fontSize: 1,
        height: 3.5,
        padding: 0.2,
        width: 10
      },
      items: {
        delay: 0.3,
        preSelected: 'unknown',
        disabled: false
      }
    }
  },
  mounted () {
    this.refresh()
  },
  data () {
    return {
      primaryColor: '#4e7091',
      selected: false,
      selectedArray: [],
      selectedItem: 'unknown',
      defaultOptions: Object
    }
  },
  computed: {
    toggleSwitchStyle () {
      return {
        width: rem(this.defaultOptions.size.width),
        height: rem(this.defaultOptions.size.height)
      }
    },
    itemStyle () {
      return {
        width: rem(this.defaultOptions.size.width),
        height: rem(this.defaultOptions.size.height),
        fontFamily: this.defaultOptions.layout.fontFamily,
        fontSize: rem(this.defaultOptions.size.fontSize),
        textAlign: 'center'
      }
    },
    labelStyle () {
      return {
        padding: rem(this.defaultOptions.size.padding),
        borderColor: this.defaultOptions.layout.noBorder ? 'transparent' : this.defaultOptions.layout.borderColor,
        backgroundColor: this.defaultOptions.layout.backgroundColor,
        color: this.defaultOptions.layout.color,
        fontWeight: this.defaultOptions.layout.fontWeight,
        transition: s(this.defaultOptions.items.delay)
      }
    }
  },
  methods: {
    refresh () {
      if (this.options !== null && this.options !== undefined) {
        this.mergeDefaultOptionsWithProp(this.options)
      }
      if (this.defaultOptions.items.preSelected !== 'unknown') {
        if (this.multiple) {
          this.selectedArray = this.defaultOptions.items.preSelected
        } else {
          this.selectedItem = this.defaultOptions.items.preSelected
        }
        this.$emit('input', this.selectedItem)
      } else if (this.value) {
        this.selectedItem = this.value
        this.$emit('input', this.selectedItem)
      }
    },
    toggle (event) {
      if (!this.defaultOptions.items.disabled) {
        if (this.multiple) {
          if (this.selectedArray.includes(event.target.id) && this.selectedArray.length > 1) {
            this.selectedArray = this.selectedArray.filter(item => item !== event.target.id)
          } else {
            !this.selectedArray.includes(event.target.id) ? this.selectedArray.push(event.target.id) : null
          }
          this.$emit('input', this.selectedArray)
          this.$emit('change', {
            value: this.selectedArray,
            srcEvent: event
          })
        } else {
          this.selected = true
          this.selectedItem = event.target.id.replace(this.group, '')
          this.$emit('selected', this.selected)
          this.$emit('input', this.selectedItem)
          this.$emit('change', {
            value: event.target.id.replace(this.group, ''),
            srcEvent: event
          })
        }
      }
    },
    labelStyleSelected (color, backgroundColor) {
      return {
        padding: rem(this.defaultOptions.size.padding),
        borderColor: this.defaultOptions.layout.noBorder ? 'transparent' : this.defaultOptions.layout.borderColor,
        fontWeight: this.defaultOptions.layout.fontWeightSelected,
        backgroundColor: backgroundColor !== undefined ? backgroundColor : this.defaultOptions.layout.selectedBackgroundColor,
        color: color !== undefined ? color : this.defaultOptions.layout.selectedColor,
        transition: s(this.defaultOptions.items.delay)
      }
    },
    mergeDefaultOptionsWithProp (options) {
      var result = this.defaultOptions
      for (var option in options) {
        if (options[option] !== null && typeof (options[option]) === 'object') {
          for (var subOption in options[option]) {
            if (options[option][subOption] !== undefined && options[option][subOption] !== null) {
              result[option][subOption] = options[option][subOption]
            }
          }
        } else {
          result[option] = options[option]
        }
      }
    }
  },
  watch: {
    value (val) {
      this.selectedItem = val
    },
    options () {
      this.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
}
label {
  margin: 0;
}
.toggle-switch {
  padding: 0;
  margin: 0;
  display: inline-flex;
}
.square li:first-child label {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.square li:last-child label {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.toggle-switch li {
  position:relative;
}
.toggle-switch li:first-child label {
  border: 1px solid;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.toggle-switch li:last-child label {
  border-right: 1px solid;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.toggle-switch label, .toggle-switch input {
  display:block;
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}
.toggle-switch input[type="radio"] {
  opacity:0.01;
  z-index:100;
}
.toggle-switch li:not(:first-child):not(:last-child) label {
  border-right: 1px solid;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.active {
  cursor: pointer;
}
</style>