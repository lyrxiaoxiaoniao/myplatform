const urlParser = document.createElement('a')

export function domain (url) {
  urlParser.href = url
  return urlParser.hostname
}

export function count (arr) {
  return arr.length
}

export function prettyDate (date) {
  var a = new Date(date)
  return a.toDateString()
}

export function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function toDate (timestamp) {
  let date = new Date(timestamp)
  const month = date.getMonth() + 1

  return `${date.getFullYear()}-${month}-${date.getDate()}`
}

export function toYM (timestamp) {
  let date = new Date(timestamp)
  let month = date.getMonth() + 1
  month = month < 10 ? ('0' + month) : month
  return `${date.getFullYear()}.${month}`
}

export function toTimestamp (date) {
  return new Date(date).getTime()
}

export function toDateTime (timestamp) {
  let date = new Date(timestamp)
  const month = date.getMonth() + 1

  function format (time) {
    let data = time
    if (Number(data) < 10) {
      data = '0' + time
    }
    return data
  }
  const minute = format(date.getMinutes())
  const seconds = format(date.getSeconds())

  return `${date.getFullYear()}-${month}-${date.getDate()} ${date.getHours()}:${minute}:${seconds}`
}

export function statusCodeToMsg (status) {
  switch (status) {
    case 0:
      return '未审核'
    case 1:
      return '审核通过'
    case 2:
      return '审核未通过'
  }
}

export function isUserLock (status) {
  switch (status) {
    case 0:
      return '锁定'
    case 1:
      return '未锁定'
  }
}

export function isOpen (status) {
  switch (status) {
    case 0:
      return '关闭'
    case 1:
      return '开启'
  }
}
