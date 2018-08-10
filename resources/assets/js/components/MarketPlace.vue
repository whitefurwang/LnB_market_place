<template>
  <div>
    <List
      v-if="now_list && now_list.length"
      :now_list='now_list'
      :sort_items='sort_items'
    />
    <Modal>
      <div slot='body' class="modal-body">
        <button
          type='button'
          class='close'
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <Loan ref="loan"/>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import {
    search_data,
    get_expiration,
    set_expiration
  } from '../util'
  import List from './List'
  import Modal from './Modal'
  import Loan from './Loan'

  export default {
    data () {
      return {
        data: {},
        now_list: {},
        now_item: {},
        sort_rule: null,
        sorted_items: {},
        errors: []
      }
    },
    created () {
      axios
        .get('//localhost:9090/market-place')
        .then(res => res.data)
        .then(market_place => {
          this.data = market_place.data
          this.now_list = this.create_now_list(this.classify_items(this.data.data))
          this.now_list.map(item => {
            set_expiration(item)
          })
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    mounted () {
      $(this.$refs.modal).on('hidden.bs.modal', () => {
        this.$router.push('/market-place')
      })
    },
    beforeRouteUpdate (to, from, next) {
      if (from.params.serial) {
        $(this.$refs.modal).modal('hide')
        next()
      } else {
        this.set_now_item(to.params.serial)
        $(this.$refs.modal).modal('show')
        next()
      }
    },
    methods: {
      set_now_item: function (serial) {
        const item_data = search_data(
          'serial',
          serial,
          this.data.data
        )
        this.now_item = {
          data: item_data,
          expiration: get_expiration(item_data.expire_at)
        }

        this.$refs.loan.update_data(this.now_item)
      },
      classify_items: function (items) {
        const classify = status => (
          items.filter(item => item.status === status)
        )

        return {
          on_sale: classify('on_sale'),
          backed: classify('backed'),
          expired: classify('expired')
        }
      },
      sort_items: function (rule) {
        const data_items =
          !!this.sorted_items['on_sale']
          ? this.sorted_items
          : this.classify_items(this.data.data)
        let { on_sale, backed, expired } = data_items

        const reverse = () => {
          on_sale = on_sale.reverse()
          backed = backed.reverse()
          expired = expired.reverse()
        }

        const sort = () => {
          const valuePath = (() => {
            let testItem
            if (on_sale[0]) {
              testItem = on_sale[0]
            } else if (backed[0]) {
              testItem = backed[0]
            } else {
              testItem = expired[0]
            }

            if (testItem['loan_detail'][rule] !== undefined) {
              return 'loan_detail'
            } else {
              return 'root'
            }
          })()

          const get_value = item => {
            switch (valuePath) {
              case 'loan_detail':
                return item['loan_detail'][rule]
              case 'root':
                return item[rule]
            }
          }

          const sort_array = array => {
            return array.sort((a, b) => {
              if (get_value(a) < get_value(b)) {
                return 1
              }
              if (get_value(a) > get_value(b)) {
                return -1
              }
              return 0
            })
          }

          on_sale = sort_array(on_sale, rule)
          backed = sort_array(backed, rule)
          expired = sort_array(expired, rule)
        }

        const set_class = () => {
          const $el = $(this.$refs[rule])
          if ($el.hasClass('sort-down')) {
            $el.removeClass('sort-down').addClass('sort-up')
          } else {
            $el.removeClass('sort-up').addClass('sort-down')
          }
          $el.siblings().removeClass('sort-down sort-up')
        }

        if (rule === this.sort_rule) {
          reverse()
        } else {
          sort()
        }

        set_class()

        this.sort_rule = rule
        this.sorted_items = { on_sale, backed, expired }
        this.now_list = this.create_now_list(this.sorted_items)
      },
      create_now_list: function (items) {
        const concat_items = items => {
          const { on_sale, backed, expired } = items
          return on_sale.concat(backed).concat(expired)
        }

        return concat_items(items).map(item_data => {
          return {
            data: item_data,
            expiration: get_expiration(item_data.expire_at)
          }
        })
      },
      order: function (serial) {
        window.alert(serial)
      }
    },
    components: {
      Loan,
      Modal,
      List
    }
  }
</script>