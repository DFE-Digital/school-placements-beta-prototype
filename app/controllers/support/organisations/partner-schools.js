const partnerSchoolModel = require('../../../models/partner-schools')
const organisationModel = require('../../../models/organisations')
const organisationRelationshipModel = require('../../../models/organisation-relationships')
const schoolModel = require('../../../models/schools')

const Pagination = require('../../../helpers/pagination')

const settings = require('../../../data/dist/settings')

/// ------------------------------------------------------------------------ ///
/// LIST PARTNER SCHOOLS
/// ------------------------------------------------------------------------ ///

exports.partner_schools_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let partners = partnerSchoolModel.findMany({ organisationId: req.params.organisationId })

  partners.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  const pagination = new Pagination(partners, req.query.page, settings.pageSize)
  partners = pagination.getData()

  delete req.session.data.school

  res.render('../views/support/organisations/partners/schools/list', {
    organisation,
    partners,
    pagination,
    actions: {
      new: `/support/organisations/${req.params.organisationId}/schools/new`,
      view: `/support/organisations/${req.params.organisationId}/schools`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW PARTNER SCHOOL
/// ------------------------------------------------------------------------ ///

exports.partner_school_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const school = organisationModel.findOne({ organisationId: req.params.schoolId })

  res.render('../views/support/organisations/partners/schools/show', {
    organisation,
    school,
    actions: {
      change: `/support/organisations/${req.params.organisationId}/schools/${req.params.schoolId}`,
      delete: `/support/organisations/${req.params.organisationId}/schools/${req.params.schoolId}/delete`,
      back: `/support/organisations/${req.params.organisationId}/schools`,
      cancel: `/support/organisations/${req.params.organisationId}/schools`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// ADD PARTNER SCHOOL
/// ------------------------------------------------------------------------ ///

exports.new_partner_school_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let save = `/support/organisations/${req.params.organisationId}/schools/new`
  let back = `/support/organisations/${req.params.organisationId}/schools`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/support/organisations/${req.params.organisationId}/schools/new/check`
  }

  res.render('../views/support/organisations/partners/schools/find', {
    organisation,
    actions: {
      save,
      back,
      cancel: `/support/organisations/${req.params.organisationId}/schools`
    }
  })
}

exports.new_partner_school_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let save = `/support/organisations/${req.params.organisationId}/schools/new`
  let back = `/support/organisations/${req.params.organisationId}/schools`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/support/organisations/${req.params.organisationId}/schools/new/check`
  }

  const errors = []

  if (!req.session.data.school.name.length) {
    const error = {}
    error.fieldName = 'school'
    error.href = '#school'
    error.text = 'Enter a school name, URN or postcode'
    errors.push(error)

    res.render('../views/support/organisations/partners/schools/find', {
      organisation,
      actions: {
        save,
        back,
        cancel: `/support/organisations/${req.params.organisationId}/schools`
      },
      errors
    })
  } else {
    // const schools = schoolModel.findMany({
    //   query: req.session.data.school.name
    // })

    // if (schools.length > 1) {
    //   res.redirect(`/support/organisations/${req.params.organisationId}/schools/choose`)
    // } else {
      const school = schoolModel.findOne({ query: req.session.data.school.name })
      const schoolOrg = organisationModel.findOne({ organisationId: school.id })

      let relationship = false

      if (schoolOrg.relationships) {
        relationship = !!schoolOrg.relationships.find(relationship => relationship.includes(req.params.organisationId))
      }

      if (relationship) {
        const error = {}
        error.fieldName = 'school'
        error.href = '#school'
        error.text = 'Partner school has already been added'
        errors.push(error)
      }

      if (errors.length) {
        res.render('../views/support/organisations/partners/schools/find', {
          organisation,
          actions: {
            save,
            back,
            cancel: `/support/organisations/${req.params.organisationId}/schools`
          },
          errors
        })
      } else {
        const school = schoolModel.findOne({ query: req.session.data.school.name })

        req.session.data.school.id = school.id

        res.redirect(`/support/organisations/${req.params.organisationId}/schools/new/check`)
      }
    // }
  }
}

exports.new_partner_school_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const school = schoolModel.findOne({ query: req.session.data.school.id })

  res.render('../views/support/organisations/partners/schools/check-your-answers', {
    organisation,
    school,
    actions: {
      save: `/support/organisations/${req.params.organisationId}/schools/new/check`,
      back: `/support/organisations/${req.params.organisationId}/schools/new`,
      cancel: `/support/organisations/${req.params.organisationId}/schools`,
      change: `/support/organisations/${req.params.organisationId}/schools/new`
    }
  })
}

exports.new_partner_school_check_post = (req, res) => {
  organisationRelationshipModel.saveOne({
    providerId: req.params.organisationId,
    schoolId: req.session.data.school.id
  })

  delete req.session.data.school

  req.flash('success', 'Partner school added')
  res.redirect(`/support/organisations/${req.params.organisationId}/schools`)
}

/// ------------------------------------------------------------------------ ///
/// DELETE PARTNER SCHOOL
/// ------------------------------------------------------------------------ ///

exports.delete_partner_school_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const school = organisationModel.findOne({ organisationId: req.params.schoolId })

  res.render('../views/support/organisations/partners/schools/delete', {
    organisation,
    school,
    actions: {
      save: `/support/organisations/${req.params.organisationId}/schools/${req.params.schoolId}/delete`,
      back: `/support/organisations/${req.params.organisationId}/schools/${req.params.schoolId}`,
      cancel: `/support/organisations/${req.params.organisationId}/schools/${req.params.schoolId}`
    }
  })
}

exports.delete_partner_school_post = (req, res) => {
  organisationRelationshipModel.deleteOne({
    providerId: req.params.organisationId,
    schoolId: req.params.schoolId
  })

  req.flash('success', 'Partner school removed')
  res.redirect(`/support/organisations/${req.params.organisationId}/schools`)
}
