const organisationModel = require('../models/organisations')

exports.decorate = (placement) => {
  const organisation = organisationModel.findOne({ organisationId: placement.organisationId })

  if (organisation) {
    placement.school = organisation
  }

  return placement
}
