<template>
  <div class="container loan-container" v-if='data'>
    <div class="row justify-content-center">
      <div class='col'>
        <h2 class='text-center'>投資案詳細內容</h2>
        <div class="loan-overview mt-4 text-center">
          <div class='loan-overview-item'>
            <span class='loan-overview-title'>利率</span>
            <p class='loan-overview-content'>
              <span class='credit_level' v-bind:class='{
                credit_level_a: /^a/i.test(data.loan_detail.credit_level),
                credit_level_b: /^b/i.test(data.loan_detail.credit_level),
                credit_level_c: /^c/i.test(data.loan_detail.credit_level)
              }'>{{ data.loan_detail.credit_level }}</span>
              <span class='credit_text'>{{ data.loan_detail.apr.toFixed(2) }}%</span>
            </p>
          </div>
          <div class='loan-overview-item'>
            <span class='loan-overview-title'>總申貸金額</span>
            <p class='loan-overview-content'>NT$ {{ commafy(data.amount) }}</p>
          </div>
          <div class='loan-overview-item'>
            <button
              v-if="data.status === 'on_sale' && expiration !== 'expired'"
              class='btn btn-primary btn-block'
              type='button'
              @click.stop='order(data.serial)'
            >我要投資</button>
            <button
              v-else
              class='btn btn-secondary btn-block'
              type='button'
              disabled
            >募集完成</button>
          </div>
        </div>
        <div class="loan-info pt-5">
          <h3 class="text-center">申貸資訊</h3>
          <div class='d-flex flex-wrap loan-info-wrap'>
            <div class='loan-info-item'>
              <span class='loan-info-title'>標的編號</span>
              <p class='loan-info-content'>{{ data.serial }}</p>
            </div>
            <div class='loan-info-item'>
              <span class='loan-info-title'>下架倒數</span>
              <p class='loan-info-content' v-if="expiration === 'expired'">已截止</p>
              <p class='loan-info-content' v-else-if="expiration.days === 0 && expiration.hours === 0 && expiration.mins === 0">少於1分</p>
              <p class='loan-info-content' v-else>{{ expiration.days }}天 {{ expiration.hours }}時 {{ expiration.mins }}分</p>
            </div>
            <div class='loan-info-item'>
              <span class='loan-info-title'>期數(月)</span>
              <p class='loan-info-content'>{{ data.loan_detail.period }}期</p>
            </div>
            <div class='loan-info-item'>
              <span class='loan-info-title'>保護比例</span>
              <p class='loan-info-content'>{{ data.loan_detail.pgr.toFixed(2) }}%</p>
            </div>
            <div class='loan-info-item'>
              <span class='loan-info-title'>申貸目的</span>
              <p class='loan-info-content'>{{ data.loan_detail.purpose }}</p>
            </div>
          </div>
        </div>
        <div class="loan-info pt-5">
          <h3 class="text-center">申貸目的說明</h3>
          <p class='loan-info-desc'>{{ data.loan_detail.description }}</p>
        </div>
      </div>
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
          type: myApp.apis['market-place'].type,
          url: myApp.apis['market-place'].url,
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
      order: function (serial) {
        const self = this
        $.ajax({
          type: myApp.apis['order'].type,
          url: myApp.apis['order'].url,
          data: { serial },
          dataType: 'json',
          success: function (result) {
            self.set_backed(serial)
          },
          error: function (e) {
            window.alert(e)
          }
        })
      },
      set_backed: function () {
        this.data.status = 'backed'
        this.data.status_label = '已被下單'
      },
      commafy
    }
  }
</script>
