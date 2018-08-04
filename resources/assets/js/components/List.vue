<template>
  <div>
    <ul>
      <li v-for="n in 10">
        <router-link
          :to="{ path: '/list/item/' + n }"
          @click="showModal = true"
        >Item {{n}}</router-link>
      </li>
    </ul>
    <div>List</div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    mounted() {
      console.log('List')
    }
  }
</script>
