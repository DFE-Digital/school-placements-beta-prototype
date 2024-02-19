const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const directoryPath = path.join(__dirname, '../data/placements/')

exports.findMany = (params) => {
    let placements = []
  
    let documents = fs.readdirSync(directoryPath, 'utf8')

    // Only get JSON documents
    documents = documents.filter(doc => doc.match(/.*\.(json)/ig))
  
    documents.forEach((filename) => {
      const raw = fs.readFileSync(directoryPath + '/' + filename)
      const data = JSON.parse(raw)
      placements.push(data)
    })
  
    if (params.organisationId) {
        placements = placements.filter(placement => {
          return placement.organisations.find(organisation => organisation.id === params.organisationId)
        })
      }
  
    return placements
  }