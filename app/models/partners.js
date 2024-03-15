const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/dist/organisations/')

exports.findMany = (params) => {
  // to prevent errors, check if directoryPath exists and if not, create
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath)
  }

  let organisations = []

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  documents.forEach((filename) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const data = JSON.parse(raw)
    organisations.push(data)
  })

  if (params.organisationTypes?.length) {
    organisations = organisations.filter(
      organisation => params.organisationTypes.includes(organisation.type)
    )
  }

  organisations = organisations.filter(organisation => {
    if (organisation.relationships) {
      return organisation.relationships.find(relationship => relationship === params.organisationId)
    }
  })

  return organisations
}
