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
      placements = placements.filter(placement => placement.organisationId === params.organisationId)
    }

    return placements
  }

  exports.insertOne = (params) => {
    let placement = {}

    if (params.organisationId) {
      placement.id = uuid()

      placement.organisationId = params.organisationId

      if (params.placement.subjectLevel) {
        placement.subjectLevel = params.placement.subjectLevel
      }

      if (params.placement.subjects) {
        placement.subjects = params.placement.subjects
      }

      if (params.placement.mentors) {
        placement.mentors = params.placement.mentors
      }

      if (params.placement.window) {
        placement.window = params.placement.window
      }

      if (params.placement.status) {
        placement.status = params.placement.status
      }

      placement.createdAt = new Date()

      const filePath = directoryPath + '/' + placement.id + '.json'

      // create a JSON sting for the submitted data
      const fileData = JSON.stringify(placement)

      // write the JSON data
      fs.writeFileSync(filePath, fileData)
    }

    return placement
  }

  exports.updateOne = (params) => {
    let placement = {}

    if (params.organisationId && params.placementId) {
      placement = this.findOne({
        organisationId: params.organisationId,
        placementId: params.placementId,
      })

      if (params.placement.subjectLevel) {
        placement.subjectLevel = params.placement.subjectLevel
      }

      if (params.placement.subjects) {
        placement.subjects = params.placement.subjects
      }

      if (params.placement.mentors) {
        placement.mentors = params.placement.mentors
      }

      if (params.placement.window) {
        placement.window = params.placement.window
      }

      placement.updatedAt = new Date()

      const filePath = directoryPath + '/' + placement.id + '.json'

      // create a JSON sting for the submitted data
      const fileData = JSON.stringify(placement)

      // write the JSON data
      fs.writeFileSync(filePath, fileData)
    }

    return placement
  }

