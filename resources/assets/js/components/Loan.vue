<template>
  <div>
    <div class="overview">
      <h1>投資案詳細內容</h1>
      <p>利率 {{ data.loan_detail.credit_level}} {{ data.loan_detail.apr}}%</p> 
      <p>總申貸金額 NT$ {{ data.amount }}</p>
    </div>
    <div class="loan-info">
      <h2>申貸資訊</h2>
      <p>標的編號 {{ data.serial }}</p>
      <p>下架倒數 {{ data.expireTime.days }}天 {{ data.expireTime.hours }}時 {{ data.expireTime.mins }}分</p>
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
  const search = (key, value, array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i]
      }
    }
  }

  const getExpireTime = expireDate => {
    const nowDate = new Date()
    const endDate = new Date(`${expireDate} 24:00`)
    const spantime = (endDate - nowDate) / 1000
    const days = Math.floor(spantime / (24 * 3600))
    const hours = Math.floor((spantime % (24 * 3600)) / 3600)
    const mins = Math.floor((spantime % 3600) / 60)
    return { days, hours, mins }
  }

  const getTimeout = expireDate => {
    const nowDate = new Date()
    const endDate = new Date(`${expireDate} 24:00`)
    const spantime = (endDate - nowDate) / 1000
    const s = Math.floor(spantime % 60)
    return s + 1
  }

  export default {
    data () {
      const serialData = search(
        'serial',
        this.$route.params.serial,
        this.$store.state.data.data
      )
      return {
        data: $.extend(
          serialData,
          { expireTime: getExpireTime(serialData.expire_at) }
        )
      }
    },
    mounted () {
      this.data.expireTime = getExpireTime(this.data.expire_at)
      setTimeout(() => {
        this.data.expireTime = getExpireTime(this.data.expire_at)
        setInterval(() => {
          this.data.expireTime = getExpireTime(this.data.expire_at)
        }, 60 * 1000)
      }, getTimeout(this.expire_at) * 1000)
    },
    beforeRouteUpdate (to, from, next) {
      const nextSerialData = search(
        'serial',
        to.params.serial,
        this.$store.state.data.data
      )
      this.data = $.extend(
        nextSerialData,
        { expireTime: getExpireTime(nextSerialData.expire_at) }
      )
      next()
    }
  }
</script>
