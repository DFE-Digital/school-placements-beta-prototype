const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')

const directoryPath = path.join(__dirname, '../data/dist/organisations/')

exports.insertOne = (params) => {
  let organisation

  if (params.schoolId && params.providerId) {
    organisation = organisationModel.findOne({ organisationId: params.schoolId })

    if (!organisation.relationships) {
      organisation.relationships = []
    }

    const relationshipExists = organisation.relationships.find(relationship => relationship === params.providerId)

    if (!relationshipExists) {
      organisation.relationships.push(params.providerId)

      organisation.updatedAt = new Date()

      const filePath = directoryPath + '/' + organisation.id + '.json'

      // create a JSON sting for the submitted data
      const fileData = JSON.stringify(organisation)

      // write the JSON data
      fs.writeFileSync(filePath, fileData)
    }
  }

  return organisation
}

exports.updateOne = (params) => {
  let organisation

  // if (params.schoolId && params.providerId) {
  //   organisation = organisationModel.findOne({ organisationId: params.schoolId })

  // }

  return organisation
}

exports.deleteOne = (params) => {
  let organisation

  if (params.schoolId && params.providerId) {
    organisation = organisationModel.findOne({ organisationId: params.schoolId })

    organisation.relationships = organisation.relationships.filter(
      relationship => relationship !== params.providerId
    )

    organisation.updatedAt = new Date()

    const filePath = directoryPath + '/' + organisation.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(organisation)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return organisation
}
