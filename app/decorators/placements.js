const organisationModel = require('../models/organisations')

const placementHelper = require('../helpers/placements')

exports.decorate = (placement) => {
  const organisation = organisationModel.findOne({ organisationId: placement.organisationId })

  placement.name = placementHelper.getPlacementLabel(placement.subjects)

  if (organisation) {
    placement.school = organisation
  }

  return placement
}
