const getTimeout = expireAt => {
  const arrExpireAt = expireAt.split('-')
  const nowDate = new Date()
  const endDate = new Date(arrExpireAt[0], arrExpireAt[1] - 1, arrExpireAt[2], 24)
  const spantime = (endDate - nowDate) / 1000
  const sesc = Math.floor(spantime % 60)
  return sesc + 1
}

const getExpiration = expireAt => {
  const arrExpireAt = expireAt.split('-')
  const nowDate = new Date()
  const endDate = new Date(arrExpireAt[0], arrExpireAt[1] - 1, arrExpireAt[2], 24)
  const spantime = (endDate - nowDate) / 1000
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

const setExpiration = node => {
  node.expiration = getExpiration(node.data.expire_at)
  setTimeout(() => {
    node.expiration = getExpiration(node.data.expire_at)
    if (node.expiration !== 'expired') {
      const interval = setInterval(() => {
        node.expiration = getExpiration(node.data.expire_at)
        if (node.expiration === 'expired') {
          clearInterval(interval)
        }
      }, 1000 * 60)
    }
  }, getTimeout(node.data.expire_at) * 1000)
}

module.exports = {
  getTimeout,
  getExpiration,
  setExpiration
}
