const axios = require('axios')
const recurseCollection = require('./recurse-collection')
const papi = 'https://api.getpostman.com/collections/'

module.exports = async function run ({ apiKey, fix }) {
  const headers = { 'X-API-Key': apiKey }
  const { data: { collections } } = await getAllCollections(headers)

  scanCollections(collections, headers, fix)
}

async function getAllCollections (headers) {
  return await axios.get(papi, { headers })
}

async function scanCollections(collections, headers, fix) {
  // collections.length = 5
  const issues = []

  for (const c of collections) {
    const { data } = await axios.get(papi + c.uid, { headers })
    const originalCollection = structuredClone(data)
    const collection = recurseCollection(data)
    const changeMade = JSON.stringify(originalCollection) !== JSON.stringify(collection)
    
    if (changeMade) {
      issues.push({ 'Collection Name': c.name, 'Collection ID': c.uid, 'Collection Link': `https://go.postman.co/collection/${c.uid}` })

      if (fix) {
        axios.put(papi + c.uid, collection, { headers })
      }
    }
  }

  if (issues.length) {
    const msg = fix ? ' and rectified ' : ' '
    console.error(`Found${msg}issues with the following collections..`)
    console.table(issues)
  } else {
    console.info('No issues found!')
  }
}
