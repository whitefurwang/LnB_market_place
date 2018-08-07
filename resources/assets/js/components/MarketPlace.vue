<template>
  <div>
    <ul>
      <li v-for="n in 10">
        <router-link
          :to="{ path: '/market-place/loan/' + n }"
          @click="showModal = true"
        >Loan {{n}}</router-link>
      </li>
    </ul>
    <div>Market Place</div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    mounted() {
      console.log('Market Place')
    }
  }
</script>
