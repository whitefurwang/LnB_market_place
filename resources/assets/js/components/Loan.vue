<template>
  <div>
    <div>Loan {{ $route.params.serial }}</div>
  </div>
</template>

<script>
  export default {
    mounted() {
      console.log('Loan')
    }
  }
</script>
