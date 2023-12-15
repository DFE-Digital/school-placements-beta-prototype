const organisationModel = require('../../models/organisations')

const providerModel = require('../../models/providers')
const schoolModel = require('../../models/schools')

exports.list_organisations_get = (req, res) => {
  const organisations = organisationModel.findMany({})

  organisations.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  res.render('../views/support/organisations/list', {
    organisations,
    actions: {
      new: '/support/organisations/new'
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.show_organisation_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/support/organisations/show', {
    organisation,
    actions: {
      back: `/support/organisations/${req.params.organisationId}`,
      change: `/support/organisations/${req.params.organisationId}`,
      delete: `/support/organisations/${req.params.organisationId}/delete`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// ADD ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.new_get = (req, res) => {
  delete req.session.data.organisation
  delete req.session.data.provider
  delete req.session.data.school
  delete req.session.data.type

  let save = '/support/organisations/new'
  let back = '/support/organisations'

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = '/support/organisations/new/check'
  }

  res.render('../views/support/organisations/organisation-type', {
    actions: {
      save,
      back,
      cancel: '/support/organisations'
    }
  })
}

exports.new_post = (req, res) => {
  let save = '/support/organisations/new'
  let back = '/support/organisations'

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = '/support/organisations/new/check'
  }

  const errors = []

  if (errors.length) {
    res.render('../views/support/organisations/organisation-type', {
      actions: {
        save,
        back,
        cancel: '/support/organisations'
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect('/support/organisations/new/check')
    } else {
      if (req.session.data.type === 'provider') {
        res.redirect('/support/organisations/new/provider')
      } else {
        res.redirect('/support/organisations/new/school')
      }
    }
  }
}

exports.new_provider_get = (req, res) => {
  delete req.session.data.school

  let save = '/support/organisations/new/provider'
  let back = '/support/organisations/new'

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = '/support/organisations/new/check'
  }

  res.render('../views/support/organisations/find-provider', {
    actions: {
      save,
      back,
      cancel: '/support/organisations'
    }
  })
}

exports.new_provider_post = (req, res) => {
  let save = '/support/organisations/new/provider'
  let back = '/support/organisations/new'

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = '/support/organisations/new/check'
  }

  const errors = []

  if (errors.length) {
    res.render('../views/support/organisations/find-provider', {
      actions: {
        save,
        back,
        cancel: '/support/organisations'
      },
      errors
    })
  } else {
    const organisation = providerModel.findOne({ query: req.session.data.provider.name })

    req.session.data.organisation = organisation

    res.redirect('/support/organisations/new/check')
  }
}

exports.new_school_get = (req, res) => {
  delete req.session.data.provider

  let save = '/support/organisations/new/school'
  let back = '/support/organisations/new'

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = '/support/organisations/new/check'
  }

  res.render('../views/support/organisations/find-school', {
    actions: {
      save,
      back,
      cancel: '/support/organisations'
    }
  })
}

exports.new_school_post = (req, res) => {
  let save = '/support/organisations/new/school'
  let back = '/support/organisations/new'

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = '/support/organisations/new/check'
  }

  const errors = []

  if (errors.length) {
    res.render('../views/support/organisations/find-school', {
      actions: {
        save,
        back,
        cancel: '/support/organisations'
      },
      errors
    })
  } else {
    const organisation = schoolModel.findOne({ query: req.session.data.school.name })
    organisation.type = 'school'

    req.session.data.organisation = organisation

    res.redirect('/support/organisations/new/check')
  }
}

exports.new_check_get = (req, res) => {
  let back = '/support/organisations/new/provider'
  if (req.session.data.organisation.type === 'school') {
    back = '/support/organisations/new/school'
  }

  res.render('../views/support/organisations/check-your-answers', {
    organisation: req.session.data.organisation,
    actions: {
      save: '/support/organisations/new/check',
      back,
      cancel: '/support/organisations',
      change: '/support/organisations/new'
    }
  })
}

exports.new_check_post = (req, res) => {
  organisationModel.insertOne({
    organisation: req.session.data.organisation
  })

  delete req.session.data.organisation
  delete req.session.data.provider
  delete req.session.data.school
  delete req.session.data.type

  req.flash('success', 'Organisation added')
  res.redirect(`/support/organisations`)
}
