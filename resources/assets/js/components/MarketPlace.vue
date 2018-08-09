<template>
  <div>
    <table v-if="items && items.length" class='table table-hover'>
      <thead>
        <tr>
          <th>年利率</th>
          <th>期數</th>
          <th>貸款目的</th>
          <th>保護比例</th>
          <th>下架倒數</th>
          <th>投資</th>
        </tr>
      </thead>
      <tbody>
        <router-link
          tag='tr'
          v-for="item of items"
          :key="item.data.serial"
          :to="{ path: '/market-place/loan/' + item.data.serial }">
          <td>{{ item.data.loan_detail.credit_level }} {{ item.data.loan_detail.apr }}%</td>
          <td>{{ item.data.loan_detail.period }}期</td>
          <td>{{ item.data.loan_detail.purpose }}</td>
          <td>{{ item.data.loan_detail.pgr }}%</td>
          <td v-if="item.expiration === 'expired'">已截止</td>
          <td v-else-if="item.expiration.days === 0 && item.expiration.hours === 0 && item.expiration.mins === 0">少於1分</td>
          <td v-else>{{ item.expiration.days }}天 {{ item.expiration.hours }}時 {{ item.expiration.mins }}分</td>
          <td>我要投資</td>
        </router-link>
      </tbody>
    </table>
    <router-link
      tag='div'
      to='/market-place'
      class='modal fade'
      v-bind:class='modal.class'
      v-bind:style='{ display: modal.display}'>
      <div class='modal-dialog'>
        <div class='modal-content' @click.stop>
          <div class="modal-body">
            <router-link class='close' to='/market-place'>close</router-link>
            <router-view />
          </div>
        </div>
      </div>
    </router-link>
    <div
      v-if='modal_backdrop.show === true'
      class='modal-backdrop fade'
      v-bind:class='modal_backdrop.class'
    />
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
      return {
        items,
        modal: {
          class: '',
          display: 'none'
        },
        modal_backdrop: {
          show: false,
          class: ''
        }
      }
    },
    mounted () {
      this.items.map(item => {
        setExpiration(item)
      })
    },
    beforeRouteUpdate (to, from, next) {
      if (from.params.serial) {
        this.modalHide(next)
      } else {
        this.modalShow(next)
      }
    },
    methods: {
      modalShow: function (next) {
        next()

        const showModalBackdrop = new Promise (resolve => {
          this.modal_backdrop.show = true
          setTimeout(() => {
            this.modal_backdrop.class = 'show'
            setTimeout(resolve, 100)
          }, 100)
        })
        
        showModalBackdrop.then(() => {
          this.modal.display = 'block'
          setTimeout(() => {
            this.modal.class = 'show'
          }, 100)
        })
      },
      modalHide: function (next) {
        const hideModal = new Promise (resolve => {
          this.modal.class = ''
          setTimeout(resolve, 150)
        })

        hideModal.then(() => {
          this.modal_backdrop.class = ''
          setTimeout(() => {
            this.modal.display = 'none'
            this.modal_backdrop.show = false
            next()
          }, 150)
        })
      }
    }
  }
</script>