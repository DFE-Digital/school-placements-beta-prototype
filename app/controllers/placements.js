const placementModel = require('../models/placements')
const organisationModel = require('../models/organisations')
const mentorHelper = require('../helpers/mentors')
const subjectHelper = require('../helpers/subjects')

/// ------------------------------------------------------------------------ ///
/// LIST PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.placement_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const placements = placementModel.findMany({ organisationId: req.params.organisationId })

  delete req.session.data.placement
  delete req.session.data.currentSubjectLevel

  res.render('../views/placements/list', {
    organisation,
    placements,
    actions: {
      new: `/organisations/${req.params.organisationId}/placements/new`,
      view: `/organisations/${req.params.organisationId}/placements`,
      back: '/'
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.placement_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const placement = placementModel.findOne({ placementId: req.params.placementId })

  res.render('../views/placements/show', {
    organisation,
    placement,
    actions: {
      change: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/edit?referrer=change`,
      delete: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/delete`,
      back: `/organisations/${req.params.organisationId}/placements`,
      cancel: `/organisations/${req.params.organisationId}/placements`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// NEW PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.new_placement_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  if (!req.session.data.placement) {
    req.session.data.placement = {}
  }

  if ([2,3].includes(organisation.establishmentPhase)) {
    req.session.data.placement.subjectLevel = 'primary'
    // redirect to primary subjects
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/subject`)
  } else if ([4,5].includes(organisation.establishmentPhase)) {
    req.session.data.placement.subjectLevel = 'secondary'
    // redirect to secondary subjects
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/subject`)
  } else {
    let back = `/organisations/${req.params.organisationId}/placements`
    let save = `/organisations/${req.params.organisationId}/placements/new`

    if (req.query.referrer === 'check') {
      back = `/organisations/${req.params.organisationId}/placements/new/check`
      save += '?referrer=check'
      req.session.data.currentSubjectLevel = req.session.data.placement.subjectLevel
    }
    // show subject level form
    const subjectLevelOptions = subjectHelper.getSubjectLevelOptions()

    res.render('../views/placements/subject-level', {
      organisation,
      placement: req.session.data.placement,
      subjectLevelOptions,
      actions: {
        save,
        back
      }
    })
  }
}

exports.new_placement_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const subjectLevelOptions = subjectHelper.getSubjectLevelOptions()

  let back = `/organisations/${req.params.organisationId}/placements`
  let save = `/organisations/${req.params.organisationId}/placements/new`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  const errors = []

  if (!req.session.data.placement.subjectLevel) {
    const error = {}
    error.fieldName = 'subjectLevel'
    error.href = '#subjectLevel'
    error.text = 'Select a subject level'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/placements/subject-level', {
      organisation,
      placement: req.session.data.placement,
      subjectLevelOptions,
      actions: {
        save,
        back
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      if (req.session.data.placement.subjectLevel === req.session.data.currentSubjectLevel) {
        res.redirect(`/organisations/${req.params.organisationId}/placements/new/check`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/placements/new/subject?referrer=check`)
      }
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/placements/new/subject`)
    }
  }
}

exports.new_placement_subject_get = (req, res) => {
    const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
    const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.placement.subjectLevel)

    let back = `/organisations/${req.params.organisationId}/placements/new`
    let save = `/organisations/${req.params.organisationId}/placements/new/subject`
    if (req.query.referrer === 'check') {
      back = `/organisations/${req.params.organisationId}/placements/new/check`
      save += '?referrer=check'
    }

    res.render('../views/placements/subject', {
      organisation,
      placement: req.session.data.placement,
      subjectOptions,
      actions: {
        save,
        back
      }
    })
}

exports.new_placement_subject_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.placement.subjectLevel)

  let back = `/organisations/${req.params.organisationId}/placements/new`
  let save = `/organisations/${req.params.organisationId}/placements/new/subject`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  const errors = []

  if (req.session.data.placement.subjectLevel === 'secondary') {
    if (!req.session.data.placement.subjects.length) {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a subject'
      errors.push(error)
    }
  } else {
    if (!req.session.data.placement.subjects) {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a subject'
      errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/placements/subject', {
      organisation,
      placement: req.session.data.placement,
      subjectOptions,
      actions: {
        save,
        back
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/placements/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/placements/new/mentor`)
    }
  }
}


exports.new_placement_mentor_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const mentorOptions = mentorHelper.getMentorOptions({ organisationId: req.params.organisationId })

  let back = `/organisations/${req.params.organisationId}/placements/new/subject`
  let save = `/organisations/${req.params.organisationId}/placements/new/mentor`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  res.render('../views/placements/mentor', {
    organisation,
    placement: req.session.data.placement,
    mentorOptions,
    actions: {
      save,
      back
    }
  })
}

exports.new_placement_mentor_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const mentorOptions = mentorHelper.getMentorOptions({ organisationId: req.params.organisationId })

  let back = `/organisations/${req.params.organisationId}/placements/new/subject`
  let save = `/organisations/${req.params.organisationId}/placements/new/mentor`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  const errors = []

  if (!req.session.data.placement.mentors.length) {
    const error = {}
    error.fieldName = 'mentors'
    error.href = '#mentors'
    error.text = 'Select a mentor'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/placements/mentor', {
      organisation,
      placement: req.session.data.placement,
      mentorOptions,
      actions: {
        save,
        back
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/placements/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/placements/new/window`)
    }
  }
}

exports.new_placement_window_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/placements/window', {
    organisation,
    placement: req.session.data.placement,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/new/window`,
      back: `/organisations/${req.params.organisationId}/placements/new/mentor`
    }
  })
}

exports.new_placement_window_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const errors = []

  if (!req.session.data.placement.window) {
    const error = {}
    error.fieldName = 'window'
    error.href = '#window'
    error.text = 'Select a window'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/placements/window', {
      organisation,
      placement: req.session.data.placement,
      actions: {
        save: `/organisations/${req.params.organisationId}/placements/new/window`,
        back: `/organisations/${req.params.organisationId}/placements/new/mentor`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/check`)
  }
}

exports.new_placement_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/placements/check-your-answers', {
    organisation,
    placement: req.session.data.placement,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/new/check`,
      back: `/organisations/${req.params.organisationId}/placements/new/window`,
      change: `/organisations/${req.params.organisationId}/placements/new`
    }
  })
}

exports.new_placement_check_post = (req, res) => {
  placementModel.insertOne({
    organisationId: req.params.organisationId,
    placement: req.session.data.placement
  })

  delete req.session.data.placement
  delete req.session.data.currentSubjectLevel

  req.flash('success', 'Placement added')
  res.redirect(`/organisations/${req.params.organisationId}/placements`)
}
