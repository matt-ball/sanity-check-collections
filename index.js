const input = require('input')
const axios = require('axios')

const warnings = []

run()

async function run () {
  const { apiKey, fieldsToCheck } = await getConfig()
  const { id } = await getUser(apiKey)
  const allCollections = await getAllCollections(apiKey)
  const userCollections = await getUserCollections(id, allCollections, apiKey)

  evaluateCollections(userCollections, fieldsToCheck)
}

async function getConfig () {
  const key = await input.text('Enter Postman API key:')
  const fields = await input.text('Enter fields to check:')
  const fieldsToCheck = fields.split(', ')
  const apiKey = '?apikey=' + key

  return { apiKey, fieldsToCheck }
}

async function getUser (apiKey) {
  const { data } = await postmanApi('get', 'me', apiKey)

  return data.user
}

async function getAllCollections (apiKey) {
  const { data } = await postmanApi('get', 'collections', apiKey)

  return data.collections
}

async function getUserCollections (userId, allCollections, apiKey) {
  const collectionRequests = allCollections.reduce((reqs, collection) => {
    if (collection.owner === String(userId)) {
      reqs.push(postmanApi('get', `collections/${collection.id}`, apiKey))
    }

    return reqs
  }, [])

  return Promise.all(collectionRequests)
}

function evaluateCollections (collections, fieldsToCheck) {
  collections.forEach((collection) => {
    const collectionName = collection.data.collection.info.name

    recurseForFields(collection.data.collection.item, fieldsToCheck, collectionName)
  })

  if (!warnings.length) {
    console.log(`✅ Field(s) "${fieldsToCheck.join(', ')}" are all using variables.`)
  } else {
    console.log(warnings.join('\n'))
  }
}

function recurseForFields (data, fieldsToCheck, collectionName, requestName) {
  if (isObject(data)) {
    requestName = (data._postman_id && data.name) || requestName
    const isKeyValuePair = data.key && data.value && typeof data.value === 'string'

    if (isKeyValuePair) {
      const isFieldToCheck = fieldsToCheck.indexOf(data.key) > -1
      const valueNotSanitized = data.value.indexOf('{{') === -1

      if (isFieldToCheck && valueNotSanitized) {
        warnings.push(`❌ ${collectionName}: key "${data.key}" is not using a variable in request "${requestName}"!`)
      }
    } else {
      for (let key in data) {
        recurseForFields(data[key], fieldsToCheck, collectionName, requestName)
      }
    }
  } else if (isArray(data)) {
    data.forEach((item) => {
      recurseForFields(item, fieldsToCheck, collectionName, requestName)
    })
  }
}

function postmanApi (method, path, apiKey) {
  return axios[method](`https://api.getpostman.com/${path}/${apiKey}`)
}

function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}
