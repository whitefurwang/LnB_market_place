<template>
  <div class="loan-container" v-if='data'>
    <div class="overview">
      <h1>投資案詳細內容</h1>
      <p>利率 {{ data.loan_detail.credit_level}} {{ data.loan_detail.apr.toFixed(2) }}%</p> 
      <p>總申貸金額 NT$ {{ commafy(data.amount) }}</p>
    </div>
    <div class="loan-info">
      <h2>申貸資訊</h2>
      <p>標的編號 {{ data.serial }}</p>
      <p v-if="expiration === 'expired'">下架倒數 已截止</p>
      <p v-else-if="expiration.days === 0 && expiration.hours === 0 && expiration.mins === 0">下架倒數 少於1分</p>
      <p v-else>下架倒數 {{ expiration.days }}天 {{ expiration.hours }}時 {{ expiration.mins }}分</p>
      <p>期數(月) {{ data.loan_detail.period }}期</p>
      <p>保護比例 {{ data.loan_detail.pgr.toFixed(2) }}%</p>
      <p>申貸目的 {{ data.loan_detail.purpose }}</p>
    </div>
    <div class="description">
      <h2>申貸目的說明</h2>
      <p>{{ data.loan_detail.description }}</p>
    </div>
  </div>
</template>

<script>
  import {
    search_data,
    get_expiration,
    set_expiration,
    commafy
  } from '../util'

  export default {
    data () {
      return {
        data: null,
        expiration: null
      }
    },
    mounted () {
      if (!!this.$route.params.serial) {
        const self = this
        $.ajax({
          type: 'GET',
          url: 'https://paris.robowebtech.tw/api/market-place',
          // url: '//localhost:3000/market-place',
          data: {
            page: 1,
            perPage: 100
          },
          dataType: 'json',
          success: function (result) {
            const item_data = search_data(
              'serial',
              self.$route.params.serial,
              result.data
            )

            self.data = item_data
            self.expiration = get_expiration(item_data.expire_at)
            set_expiration(self)
          },
          error: function (e) {
            window.alert(e)
          }
        })
      }
    },
    methods: {
      update_data (item) {
        this.data = item.data
        this.expiration = item.expiration
        set_expiration(this)
      },
      commafy
    }
  }
</script>
