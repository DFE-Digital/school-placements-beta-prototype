const organisationModel = require('../../../models/organisations')
const placementModel = require('../../../models/placements')

const Pagination = require('../../../helpers/pagination')

const placementDecorator = require('../../../decorators/placements.js')

const settings = require('../../../data/dist/settings')

/// ------------------------------------------------------------------------ ///
/// LIST PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.placements_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let placements = placementModel.findMany({ organisationId: req.params.organisationId })

  // add details of school to each placement result
  if (placements.length) {
    placements = placements.map(placement => {
      return placement = placementDecorator.decorate(placement)
    })

    // sort placements
    placements.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  const pagination = new Pagination(placements, req.query.page, settings.pageSize)
  placements = pagination.getData()

  res.render('../views/support/organisations/placements/list', {
    organisation,
    placements,
    pagination,
    actions: {
      new: '#', //`/organisations/${req.params.organisationId}/placements/new`
      view: `/support/organisations/${req.params.organisationId}/placements`,
      back: '/'
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.placement_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let placement = placementModel.findOne({ placementId: req.params.placementId })
  placement = placementDecorator.decorate(placement)

  res.render('../views/support/organisations/placements/show', {
    organisation,
    placement,
    actions: {
      change: `/support/organisations/${req.params.organisationId}/placements/${req.params.placementId}/edit?referrer=change`,
      delete: `/support/organisations/${req.params.organisationId}/placements/${req.params.placementId}/delete`,
      back: `/support/organisations/${req.params.organisationId}/placements`
    }
  })
}
