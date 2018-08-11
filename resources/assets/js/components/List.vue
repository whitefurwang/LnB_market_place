<template>
  <table v-if="now_list && now_list.length" class='table table-hover text-center market-place-table'>
    <thead class='thead-light'>
      <tr>
        <th class="sort" data-sort='apr' @click='sort_items'>
          <span>年利率</span>
          <div class="sort-icons">
            <i class='icon-sort-up'></i>
            <i class='icon-sort-down'></i>
          </div>
        </th>
        <th class="sort" data-sort='period' @click='sort_items'>
          <span>期數</span>
          <div class="sort-icons">
            <i class='icon-sort-up'></i>
            <i class='icon-sort-down'></i>
          </div>
        </th>
        <th class="sort" data-sort='purpose' @click='sort_items'>
          <span>貸款目的</span>
          <div class="sort-icons">
            <i class='icon-sort-up'></i>
            <i class='icon-sort-down'></i>
          </div>
        </th>
        <th class="sort" data-sort='pgr' @click='sort_items'>
          <span>保護比例</span>
          <div class="sort-icons">
            <i class='icon-sort-up'></i>
            <i class='icon-sort-down'></i>
          </div>
        </th>
        <th class="sort" data-sort='expire_at' @click='sort_items'>
          <span>下架倒數</span>
          <div class="sort-icons">
            <i class='icon-sort-up'></i>
            <i class='icon-sort-down'></i>
          </div>
        </th>
        <th>投資</th>
      </tr>
    </thead>
    <tbody>
      <router-link
        tag='tr'
        v-for="item of now_list"
        v-bind:class='{ not_on_sale: item.data.status !== "on_sale" }'
        :key="item.data.serial"
        :to="{ path: '/market-place/loan/' + item.data.serial }"
        data-toggle="modal"
        data-target="#modal"
      >
        <td class='align-middle'>
          <span class='credit_level' v-bind:class='{
            credit_level_a: /^a/i.test(item.data.loan_detail.credit_level),
            credit_level_b: /^b/i.test(item.data.loan_detail.credit_level),
            credit_level_c: /^c/i.test(item.data.loan_detail.credit_level)
          }'>{{ item.data.loan_detail.credit_level }}</span>
          <span class='credit_text'>{{ item.data.loan_detail.apr.toFixed(2) }}%</span>
        </td>
        <td class='align-middle'>{{ item.data.loan_detail.period }}期</td>
        <td class='align-middle'>{{ item.data.loan_detail.purpose }}</td>
        <td class='align-middle'>{{ item.data.loan_detail.pgr.toFixed(2) }}%</td>
        <td class='align-middle' v-if="item.data.status !== 'on_sale'">{{ item.data.status_label }}</td>
        <td class='align-middle' v-else-if="item.expiration === 'expired'">已過期</td>
        <td class='align-middle' v-else-if="item.expiration.days === 0 && item.expiration.hours === 0 && item.expiration.mins === 0">少於1分</td>
        <td class='align-middle' v-else>{{ item.expiration.days }}天 {{ item.expiration.hours }}時 {{ item.expiration.mins }}分</td>
        <td class='align-middle'>
          <button
            v-if="item.data.status === 'on_sale' && item.expiration !== 'expired'"
            class='btn btn-outline-primary btn-block'
            type='button'
            @click.stop='order(item.data.serial)'
          >我要投資</button>
          <span v-else>--</span>
        </td>
      </router-link>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: [
      'now_list',
      'sort_items',
      'order'
    ]
  }
</script>