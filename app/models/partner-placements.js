const path = require('path')
const fs = require('fs')

const partnerModel = require('./partners')

const directoryPath = path.join(__dirname, '../data/dist/placements/')


exports.findMany = (params) => {
  // get the organisations for a given provider
  const organisations = partnerModel.findMany({ organisationId: params.organisationId })

  // get the IDs for all the school partners so we can retrieve their placements
  const partners = organisations.map(partner => partner.id)

  let placements = []

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  // parse the placement documents
  documents.forEach((filename) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const data = JSON.parse(raw)
    placements.push(data)
  })

  // filter placements that belong to the organisation's partners
  placements = placements.filter(placement => {
    return partners.includes(placement.organisationId)
  })

  return placements
}
