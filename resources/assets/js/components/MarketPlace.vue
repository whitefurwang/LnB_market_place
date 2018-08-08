<template>
  <div>
    <table v-if="items && items.length">
      <tr>
        <th>年利率</th>
        <th>期數</th>
        <th>貸款目的</th>
        <th>保護比例</th>
        <th>下架倒數</th>
        <th>投資</th>
      </tr>
      <router-link
        tag='tr'
        v-for="item of items"
        :key="item.data.serial"
        :to="{ path: '/market-place/loan/' + item.data.serial }"
        @click="showModal = true"
      >
        <td>{{ item.data.loan_detail.credit_level }} {{ item.data.loan_detail.apr }}%</td>
        <td>{{ item.data.loan_detail.period }}期</td>
        <td>{{ item.data.loan_detail.purpose }}</td>
        <td>{{ item.data.loan_detail.pgr }}%</td>
        <td v-if="item.expiration === 'expired'">已截止</td>
        <td v-else-if="item.expiration.days === 0 && item.expiration.hours === 0 && item.expiration.mins === 0">少於1分</td>
        <td v-else>{{ item.expiration.days }}天 {{ item.expiration.hours }}時 {{ item.expiration.mins }}分</td>
      </router-link>
    </table>
    <router-view class='modal' isModal='true'/>
  </div>
</template>

<script>
  import { getExpiration, setExpiration } from '../util'

  export default {
    data () {
      const storeData = this.$store.state.data.data
      const items = storeData.map(itemData => {
        return {
          data: itemData,
          expiration: getExpiration(itemData.expire_at)
        }
      })
      return { items }
    },
    mounted () {
      this.items.map(item => {
        setExpiration(item)
      })
    }
  }
</script>
