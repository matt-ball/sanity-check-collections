const input = require('input')
const axios = require('axios')

run()

async function run () {
  const { apiKey, fieldsToCheck } = await getConfig()
  const { id } = await getUser(apiKey)
  const allCollections = await getAllCollections(apiKey)
  const userCollections = await getUserCollections(id, allCollections, apiKey)
  const results = evaluateCollections(userCollections, fieldsToCheck)

  console.log(results)
}

async function getConfig () {
  const key = await input.text('Enter Postman API key:')
  const fieldsToCheck = await input.text('Enter fields to check:')
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
  // recurse each collection
}

function postmanApi (method, path, apiKey) {
  return axios[method](`https://api.getpostman.com/${path}/${apiKey}`)
}
