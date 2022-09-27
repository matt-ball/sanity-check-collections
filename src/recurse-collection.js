const sensitiveKeys = [
  'consumerKey',
  'consumerSecret',
  'token',
  'tokenSecret',
  'value'
]

module.exports = function recurseCollection (data) {
  if (isObject(data)) {
    const authObjectExists = data.auth && data.auth.type !== 'noauth'

    if (authObjectExists) {
      const authType = data.auth.type
      const auth = data.auth[authType]

      for (let i = 0; i < auth.length; i++) {
        const currentKey = auth[i].key
        const currentValue = auth[i].value

        if (isSensitiveKey(currentKey)) {
          const valueUsingVariables = currentValue.startsWith('{{')
          
          if (!valueUsingVariables) {
            auth[i].value = ''
          }
        }
      }
    } else {
      for (const key in data) {
        data[key] = recurseCollection(data[key])
      }
    }
  } else if (isArray(data)) {
    data = data.map(recurseCollection)
  }

  return data
}

function isSensitiveKey (key) {
  return sensitiveKeys.includes(key)
}

function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}
