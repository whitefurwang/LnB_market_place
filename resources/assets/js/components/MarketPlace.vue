<template>
  <div>
    <ul v-if="items && items.length">
      <li
        v-for="item of items"
        :key="item.serial"
      >
        <router-link
          :to="{ path: '/market-place/loan/' + item.serial }"
          @click="showModal = true"
        >Loan {{item.serial}}</router-link>
      </li>
    </ul>
    <div>Market Place</div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        items: this.$store.state.data.data
      }
    },
    mounted() {
      console.log('Market Place')
    }
  }
</script>
