<template>
  <div class="loan-container">
    <div class="overview">
      <h1>投資案詳細內容</h1>
      <p>利率 {{ data.loan_detail.credit_level}} {{ data.loan_detail.apr}}%</p> 
      <p>總申貸金額 NT$ {{ data.amount }}</p>
    </div>
    <div class="loan-info">
      <h2>申貸資訊</h2>
      <p>標的編號 {{ data.serial }}</p>
      <p v-if="expiration === 'expired'">下架倒數 已截止</p>
      <p v-else-if="expiration.days === 0 && expiration.hours === 0 && expiration.mins === 0">下架倒數 少於1分</p>
      <p v-else>下架倒數 {{ expiration.days }}天 {{ expiration.hours }}時 {{ expiration.mins }}分</p>
      <p>期數(月) {{ data.loan_detail.period }}期</p>
      <p>保護比例 {{ data.loan_detail.pgr }}%</p>
      <p>申貸目的 {{ data.loan_detail.purpose }}</p>
    </div>
    <div class="description">
      <h2>申貸目的說明</h2>
      <p>{{ data.loan_detail.description }}</p>
    </div>
  </div>
</template>

<script>
  import { getExpiration, setExpiration } from '../util'

  const searchData = (key, value, array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i]
      }
    }
  }

  export default {
    data () {
      const itemData = searchData(
        'serial',
        this.$route.params.serial,
        this.$store.state.data.data
      )
      return {
        data: itemData,
        expiration: getExpiration(itemData.expire_at)
      }
    },
    mounted () {
      setExpiration(this)
    }
  }
</script>
