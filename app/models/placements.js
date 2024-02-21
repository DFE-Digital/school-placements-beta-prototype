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

// exports.findOne = (params) => {
//   let placements = []

//   if (params.organisationId) {
//     placements = this.findMany({ organisationId: params.organisationId })
//   } else {
//     placements = this.findMany({})
//   }

//   let placement = {}

//   if (params.placementId) {
//     placement = placements.find(placement => placement.id === params.placementId)
//   }

//   if (parseInt(params.trn)) {
//     placement = placements.find(placement => placement.trn === parseInt(params.trn))
//   }

//   return placement
// }

// exports.saveOne = (params) => {
//   let placement = {}

//   if (params.organisationId) {
//     if (params.placementId) {
//       placement = this.updateOne(params)
//     } else {
//       const placementExists = this.findOne({ trn: params.placement.trn })

//       if (placementExists) {
//         placement = this.updateOne(params)
//       } else {
//         placement = this.insertOne(params)
//       }
//     }
//   }

//   return placement
// }

// exports.insertOne = (params) => {
//   const placement = {}

//   if (params.organisationId) {
//     placement.id = uuid()

//     if (params.placement.firstName) {
//       placement.firstName = params.placement.firstName
//     }

//     if (params.placement.lastName) {
//       placement.lastName = params.placement.lastName
//     }

//     if (params.placement.trn) {
//       placement.trn = params.placement.trn
//     }

//     placement.organisations = []

//     const o = organisationModel.findOne({ organisationId: params.organisationId })

//     const organisation = {}
//     organisation.id = o.id
//     organisation.name = o.name

//     placement.organisations.push(organisation)

//     placement.createdAt = new Date()

//     const filePath = directoryPath + '/' + placement.id + '.json'

//     // create a JSON sting for the submitted data
//     const fileData = JSON.stringify(placement)

//     // write the JSON data
//     fs.writeFileSync(filePath, fileData)
//   }

//   return placement
// }

// exports.updateOne = (params) => {
//   let placement
//   if (params.placementId) {
//     placement = this.findOne({ placementId: params.placementId })
//   } else {
//     placement = this.findOne({ trn: params.placement.trn })
//   }

//   if (placement) {
//     if (params.placement.firstName) {
//       placement.firstName = params.placement.firstName
//     }

//     if (params.placement.lastName) {
//       placement.lastName = params.placement.lastName
//     }

//     if (params.placement.trn) {
//       placement.trn = params.placement.trn
//     }

//     const organisationExists = placement.organisations.find(
//       organisation => organisation.id === params.organisationId
//     )

//     if (!organisationExists) {
//       const o = organisationModel.findOne({ organisationId: params.organisationId })

//       const organisation = {}
//       organisation.id = o.id
//       organisation.name = o.name

//       placement.organisations.push(organisation)
//     }

//     placement.updatedAt = new Date()

//     const filePath = directoryPath + '/' + placement.id + '.json'

//     // create a JSON sting for the submitted data
//     const fileData = JSON.stringify(placement)

//     // write the JSON data
//     fs.writeFileSync(filePath, fileData)
//   }

//   return placement
// }

// exports.deleteOne = (params) => {
//   if (params.organisationId && params.placementId) {
//     const placement = this.findOne({ placementId: params.placementId })

//     placement.organisations = placement.organisations.filter(
//       organisation => organisation.id !== params.organisationId
//     )

//     placement.updatedAt = new Date()

//     const filePath = directoryPath + '/' + placement.id + '.json'

//     if (placement.organisations.length) {
//       // create a JSON sting for the submitted data
//       const fileData = JSON.stringify(placement)
//       // write the JSON data
//       fs.writeFileSync(filePath, fileData)
//     } else {
//       // remove the placement altogether since they're no longer associated with an
//       // organisation
//       fs.unlinkSync(filePath)
//     }
//   }
// }

