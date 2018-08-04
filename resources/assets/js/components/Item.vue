<template>
  <div>
    <div>Item {{ $route.params.id }}</div>
  </div>
</template>

<script>
  export default {
    mounted() {
      console.log('Item')
    }
  }
</script>
