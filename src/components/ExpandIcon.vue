<template>
  <div
    v-if="item.Id"
  >
    <v-icon
     @click="toggle"
     :key="expanded ? 1 : 2"
    >
     {{ expanded ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
    </v-icon>
    </div>
</template>

<script>
export default {
  name: 'ExpandIcon',
  props: {
    value: {
      type: Array,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    expanded () {
      return !!this.value.find(item => item.Id === this.item.Id)
    }
  },
  methods: {
    toggle () {
      this.$emit('input', this.expanded ? this.value.filter(item => item.Id !== this.item.Id) : [...this.value, this.item])
    }
  }
}
</script>

<style scoped>

</style>