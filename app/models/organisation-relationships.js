const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')
const schoolModel = require('./schools')

const directoryPath = path.join(__dirname, '../data/dist/organisations/')

exports.saveOne = (params) => {
  let organisation = {}

  if (params.schoolId && params.providerId) {
    const existingOrganisation = organisationModel.findOne({ organisationId: params.schoolId })

    if (existingOrganisation.id) {
      organisation = this.updateOne(params)
    } else {
      organisation = this.insertOne(params)
    }
  }

  return organisation
}

exports.insertOne = (params) => {
  let organisation

  if (params.schoolId && params.providerId) {
    organisation = schoolModel.findOne({ query: params.schoolId })
    console.log('Insert', organisation);
    organisation.type = 'school'

    organisation.relationships = []

    organisation.relationships.push(params.providerId)

    organisation.updatedAt = new Date()

    const filePath = directoryPath + '/' + organisation.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(organisation)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return organisation
}

exports.updateOne = (params) => {
  let organisation

  if (params.schoolId && params.providerId) {
    organisation = organisationModel.findOne({ organisationId: params.schoolId })
    console.log('Update', organisation);

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
