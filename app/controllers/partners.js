const partnerModel = require('../models/partners')
const organisationModel = require('../models/organisations')

const Pagination = require('../helpers/pagination')

/// ------------------------------------------------------------------------ ///
/// LIST PARTNER SCHOOLS
/// ------------------------------------------------------------------------ ///

exports.partner_schools_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let partners = partnerModel.findMany({ organisationId: req.params.organisationId })

  partners.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  // TODO: get pageSize from settings
  let pageSize = 25
  let pagination = new Pagination(partners, req.query.page, pageSize)
  partners = pagination.getData()

  delete req.session.data.partner

  res.render('../views/partners/schools/list', {
    organisation,
    partners,
    pagination,
    actions: {
      new: `/organisations/${req.params.organisationId}/schools/new`,
      view: `/organisations/${req.params.organisationId}/schools`,
      back: '/'
    }
  })
}

exports.partner_school_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const school = organisationModel.findOne({ organisationId: req.params.schoolId })

  res.render('../views/partners/schools/show', {
    organisation,
    school,
    actions: {
      change: `/organisations/${req.params.organisationId}/schools/${req.params.schoolId}`,
      delete: `/organisations/${req.params.organisationId}/schools/${req.params.schoolId}/delete`,
      back: `/organisations/${req.params.organisationId}/schools`,
      cancel: `/organisations/${req.params.organisationId}/schools`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// LIST PARTNER PROVIDERS
/// ------------------------------------------------------------------------ ///

exports.partner_providers_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let partners = partnerModel.findMany({ organisationId: req.params.organisationId })

  partners.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  // TODO: get pageSize from settings
  let pageSize = 25
  let pagination = new Pagination(partners, req.query.page, pageSize)
  partners = pagination.getData()

  delete req.session.data.partner

  res.render('../views/partners/providers/list', {
    organisation,
    partners,
    pagination,
    actions: {
      new: `/organisations/${req.params.organisationId}/partners/new`,
      view: `/organisations/${req.params.organisationId}/partners`,
      back: '/'
    }
  })
}
