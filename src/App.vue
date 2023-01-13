<template>
  <v-app>
    <v-main class="container">
      <TableView
        :raw-data="jsonData"
      />
    </v-main>
  </v-app>
</template>

<script>
import jsonData from "./assets/data.json"
import TableView from "@/components/TableView"

export default {
  name: 'App',
  data: () => ({
    jsonData: jsonData.Items
  }),
  components: {
    TableView
  }
}
</script>
<style>
.container {
  width: 85%;
  margin: 50px auto;
}
.quote-field {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.centered {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: .7em;
  width: 100%;
  height: 48px;
}
.copyright{
  color: #4e7091
}
.minimal {
  background-color: #f4f2d2
}
</style>
