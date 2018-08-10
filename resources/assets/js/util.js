const search_data = (key, value, array) => {
  return array.filter(item => item[key] === value)[0]
}

const get_timeout = expireAt => {
  const arr_expire_at = expireAt.split('-')
  const now_date = new Date()
  const end_date = new Date(arr_expire_at[0], arr_expire_at[1] - 1, arr_expire_at[2], 24)
  const spantime = (end_date - now_date) / 1000
  const sesc = Math.floor(spantime % 60)
  return sesc + 1
}

const get_expiration = expireAt => {
  const arr_expire_at = expireAt.split('-')
  const now_date = new Date()
  const end_date = new Date(arr_expire_at[0], arr_expire_at[1] - 1, arr_expire_at[2], 24)
  const spantime = (end_date - now_date) / 1000
  const days = Math.floor(spantime / (24 * 3600))
  const hours = Math.floor((spantime % (24 * 3600)) / 3600)
  const mins = Math.floor((spantime % 3600) / 60)
  const secs = Math.floor(spantime % 60)

  let result

  if (days > 0 || hours > 0 || mins >= 0) {
    result = { days, hours, mins, secs }
  } else {
    result = 'expired'
  }

  return result
}

const set_expiration = node => {
  node.expiration = get_expiration(node.data.expire_at)
  setTimeout(() => {
    node.expiration = get_expiration(node.data.expire_at)
    if (node.expiration !== 'expired') {
      const interval = setInterval(() => {
        node.expiration = get_expiration(node.data.expire_at)
        if (node.expiration === 'expired') {
          clearInterval(interval)
        }
      }, 1000 * 60)
    }
  }, get_timeout(node.data.expire_at) * 1000)
}

const commafy = value => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

module.exports = {
  search_data,
  get_timeout,
  get_expiration,
  set_expiration,
  commafy
}
