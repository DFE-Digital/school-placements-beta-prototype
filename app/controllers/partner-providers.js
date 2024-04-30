const organisationModel = require('../models/organisations')
const organisationRelationshipModel = require('../models/organisation-relationships')
const providerModel = require('../models/providers')

const Pagination = require('../helpers/pagination')

/// ------------------------------------------------------------------------ ///
/// LIST PARTNER PROVIDERS
/// ------------------------------------------------------------------------ ///

exports.partner_providers_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let partners = []

  if (organisation.relationships) {
    organisation.relationships.forEach(id => {
      const provider = providerModel.findOne({ query: id })
      partners.push(provider)
    })

    partners.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  // TODO: get pageSize from settings
  let pageSize = 25
  let pagination = new Pagination(partners, req.query.page, pageSize)
  partners = pagination.getData()
console.log(partners);
  delete req.session.data.provider

  res.render('../views/partners/providers/list', {
    organisation,
    partners,
    pagination,
    actions: {
      new: `/organisations/${req.params.organisationId}/providers/new`,
      view: `/organisations/${req.params.organisationId}/providers`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW PARTNER PROVIDER
/// ------------------------------------------------------------------------ ///

exports.partner_provider_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const provider = providerModel.findOne({ query: req.params.providerId })

  res.render('../views/partners/providers/show', {
    organisation,
    provider,
    actions: {
      change: `/organisations/${req.params.organisationId}/providers/${req.params.providerId}`,
      delete: `/organisations/${req.params.organisationId}/providers/${req.params.providerId}/delete`,
      back: `/organisations/${req.params.organisationId}/providers`,
      cancel: `/organisations/${req.params.organisationId}/providers`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// ADD PARTNER PROVIDER
/// ------------------------------------------------------------------------ ///

exports.new_partner_provider_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let save = `/organisations/${req.params.organisationId}/providers/new`
  let back = `/organisations/${req.params.organisationId}/providers`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/providers/new/check`
  }

  res.render('../views/partners/providers/find', {
    organisation,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/providers`
    }
  })
}

exports.new_partner_provider_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let save = `/organisations/${req.params.organisationId}/providers/new`
  let back = `/organisations/${req.params.organisationId}/providers`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/providers/new/check`
  }

  const errors = []

  if (!req.session.data.provider.name.length) {
    const error = {}
    error.fieldName = 'provider'
    error.href = '#provider'
    error.text = 'Enter a provider name, UKPRN, URN or postcode'
    errors.push(error)

    res.render('../views/partners/providers/find', {
      organisation,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/providers`
      },
      errors
    })
  } else {
    // const schools = schoolModel.findMany({
    //   query: req.session.data.provider.name
    // })

    // if (schools.length > 1) {
    //   res.redirect(`/organisations/${req.params.organisationId}/providers/choose`)
    // } else {
      const provider = providerModel.findOne({ query: req.session.data.provider.name })

      let relationship = false

      if (organisation.relationships) {
        relationship = !!organisation.relationships.find(relationship => relationship.includes(provider.id))
      }

      if (relationship) {
        const error = {}
        error.fieldName = 'provider'
        error.href = '#provider'
        error.text = 'Partner provider has already been added'
        errors.push(error)
      }

      if (errors.length) {
        res.render('../views/partners/providers/find', {
          organisation,
          actions: {
            save,
            back,
            cancel: `/organisations/${req.params.organisationId}/providers`
          },
          errors
        })
      } else {
        const provider = providerModel.findOne({ query: req.session.data.provider.name })

        req.session.data.provider.id = provider.id

        res.redirect(`/organisations/${req.params.organisationId}/providers/new/check`)
      }
    // }
  }
}

exports.new_partner_provider_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const provider = providerModel.findOne({ query: req.session.data.provider.id })
console.log(provider);
  res.render('../views/partners/providers/check-your-answers', {
    organisation,
    provider,
    actions: {
      save: `/organisations/${req.params.organisationId}/providers/new/check`,
      back: `/organisations/${req.params.organisationId}/providers/new`,
      cancel: `/organisations/${req.params.organisationId}/providers`,
      change: `/organisations/${req.params.organisationId}/providers/new`
    }
  })
}

exports.new_partner_provider_check_post = (req, res) => {
  organisationRelationshipModel.saveOne({
    providerId: req.session.data.provider.id,
    schoolId: req.params.organisationId
  })

  delete req.session.data.provider

  req.flash('success', 'Partner provider added')
  res.redirect(`/organisations/${req.params.organisationId}/providers`)
}

/// ------------------------------------------------------------------------ ///
/// DELETE PARTNER PROVIDER
/// ------------------------------------------------------------------------ ///

exports.delete_partner_provider_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const provider = providerModel.findOne({ query: req.params.providerId })

  res.render('../views/partners/providers/delete', {
    organisation,
    provider,
    actions: {
      save: `/organisations/${req.params.organisationId}/providers/${req.params.providerId}/delete`,
      back: `/organisations/${req.params.organisationId}/providers/${req.params.providerId}`,
      cancel: `/organisations/${req.params.organisationId}/providers/${req.params.providerId}`
    }
  })
}

exports.delete_partner_provider_post = (req, res) => {
  organisationRelationshipModel.deleteOne({
    providerId: req.params.providerId,
    schoolId: req.params.organisationId
  })

  req.flash('success', 'Partner provider removed')
  res.redirect(`/organisations/${req.params.organisationId}/providers`)
}
