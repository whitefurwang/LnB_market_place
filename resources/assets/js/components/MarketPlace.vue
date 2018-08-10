<template>
  <div>
    <List
      v-if="now_list && now_list.length"
      :now_list='now_list'
      :sort_items='sort_items'
      :order='order'
    />
    <div
      class="pagination-nav"
      v-bind:class="{ 'show': now_list && now_list.length }"
    >
      <b-pagination
        :total-rows="data.total"
        v-model="data.current_page"
        :per-page="Number(data.per_page)"
        @input='change_page'
      />
      <div class='total-page'>
        <span>共 {{data.last_page}} 頁</span>
      </div>
      <div class="go-to-page">
        <span>到</span>
        <input ref='go-to-input' type='text' class='form-control'/>
        <span>頁</span>
        <b-button
          variant='outline-primary'
          @click='handle_go_to_page_click'
        >換頁</b-button>
      </div>
      <div class='per-page'>
        <span>每頁顯示</span>
        <b-form-select
          v-model='data.per_page'
          :value="data.per_page"
          :options="{ '2': 2, '5': 5, '10': 10, '20': 20 }"
          @change='change_pre_page'
        />
        <span>筆</span>
      </div>
    </div>
    <div class='modal fade' id='modal' ref='modal'>
      <div class='modal-dialog'>
        <div class='modal-content'>
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
        </div>
      </div>
    </div>
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
  import Loan from './Loan'
  import bPagination from 'bootstrap-vue/es/components/pagination/pagination'
  import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
  import bButton from 'bootstrap-vue/es/components/button/button'
  import bFormSelect from 'bootstrap-vue/es/components/form-select/form-select'

  export default {
    data () {
      return {
        data: {},
        now_list: {},
        now_item: {},
        sort_rule: null,
        sort_reverse: false,
        sorted_items: {},
        errors: []
      }
    },
    created () {
      this.get_data()
    },
    mounted () {
      $(this.$refs.modal).on('hidden.bs.modal', () => {
        this.$router.push('/market-place')
        $(window).off('keydown.hideModal')
      })

      $(this.$refs.modal).on('shown.bs.modal', () => {
        $(window).on('keydown.hideModal', e => {
          if (e.keyCode === 27) {
            $(this.$refs.modal).modal('hide')
          }
        })
      })

      $(this.$refs['go-to-input']).on('focus', e => {
        console.log('focus')
        const $target = $(e.target)
        console.log($target)
        $target.on('keydown', e => {
          if (e.keyCode === 13) {
            this.go_to_page_change(Number($target[0].value))
          }
        })

        $target.on('blur', () => {
          $target.off('keydown')
        })
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
      get_data: function (page, per_page) {
        axios
          .get('//localhost:9090/market-place', {
            page: page,
            perPage: per_page
          })
          .then(res => res.data)
          .then(market_place => {
            const data = market_place.data
            let classify_items

            if (page) {
              data.current_page = page
            }
            if (per_page) {
              data.per_page = per_page
            }

            this.data = data
            classify_items = this.classify_items(data.data)

            if (this.sort_rule) {
              this.sort_items(this.sort_rule)
            } else {
              this.now_list = this.create_now_list(classify_items)
            }

            this.now_list.map(item => {
              set_expiration(item)
            })
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
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
      sort_items: function (e) {
        const data_items =
          !!this.sorted_items['on_sale']
          ? this.sorted_items
          : this.classify_items(this.data.data)
        let { on_sale, backed, expired } = data_items

        const reverse = (is_change_page) => {
          on_sale = on_sale.reverse()
          backed = backed.reverse()
          expired = expired.reverse()

          if (!is_change_page) {
            this.sort_reverse = !this.sort_reverse
          }
        }

        const sort = rule => {
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

        if (typeof e === 'string') {
          sort(e)
          this.sort_reverse && reverse(true)
        } else {
          const $target = $(e.currentTarget)
          const rule = $target.data('sort')

          const set_class = () => {
            if ($target.hasClass('sort-down')) {
              $target.removeClass('sort-down').addClass('sort-up')
            } else {
              $target.removeClass('sort-up').addClass('sort-down')
            }
            $target.siblings().removeClass('sort-down sort-up')
          }

          if (rule === this.sort_rule) {
            reverse()
          } else {
            sort(rule)
            this.sort_reverse = false
          }

          set_class()

          this.sort_rule = rule
        }

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
      },
      change_page: function (page) {
        // here is a bug of this.data.per_page
        // when change_pre_page pass new value larger then current
        // this.data.pre_page will be in string type
        // it will comes a error message in b-pagination component
        // so now, I translate the type to number for avoid this bug
        // it should be fixed
        // - whitefur
        this.get_data(page, this.data.per_page)
      },
      change_pre_page: function (per_page) {
        per_page = Number(per_page)
        let page

        if (this.data.current_page * per_page > this.data.total) {
          page = Math.ceil(this.data.total / per_page)
        } else {
          page = this.data.current_page
        }

        this.get_data(page, per_page)
      },
      handle_go_to_page_click: function () {
        this.go_to_page_change(this.$refs['go-to-input'].value)
      },
      go_to_page_change: function (page) {
        page = Number(page)
        if (page <= this.data.last_page && page >= 1) {
          this.change_page(Number(page))
          this.$refs['go-to-input'].value = null
        } else {
          window.alert('輸入的頁數不正確')
        }
      }
    },
    components: {
      Loan,
      List,
      'b-pagination': bPagination,
      'b-form-input': bFormInput,
      'b-button': bButton,
      'b-form-select': bFormSelect
    }
  }
</script>