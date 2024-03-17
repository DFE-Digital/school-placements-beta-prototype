const mentorModel = require('../models/mentors')
const organisationModel = require('../models/organisations')
const placementModel = require('../models/placements')

const partnerPlacementModel = require('../models/partner-placements')

const Pagination = require('../helpers/pagination')
const mentorHelper = require('../helpers/mentors')
const subjectHelper = require('../helpers/subjects')

const placementDecorator = require('../decorators/placements.js')

/// ------------------------------------------------------------------------ ///
/// LIST PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.placements_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const mentors = mentorModel.findMany({ organisationId: req.params.organisationId })

  // TODO: get pageSize from settings
  let pageSize = 25

  let placements
  if (['university','scitt'].includes(organisation.type)) {
    placements = partnerPlacementModel.findMany({ organisationId: req.params.organisationId })

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

    // variables used in the find placement flow
    delete req.session.data.questions
    delete req.session.data.filters
    delete req.session.data.location
    delete req.session.data.school
    delete req.session.data.q
    delete req.session.data.sortBy
    delete req.session.data.keywords

    let pagination = new Pagination(placements, req.query.page, pageSize)
    placements = pagination.getData()

    res.render('../views/placements/providers/list', {
      organisation,
      placements,
      pagination,
      actions: {
        new: `/organisations/${req.params.organisationId}/placements/new`,
        view: `/organisations/${req.params.organisationId}/placements`,
        find: `/organisations/${req.params.organisationId}/placements/find`,
        mentors: `/organisations/${req.params.organisationId}/mentors`,
        back: '/'
      }
    })

  } else {
    placements = placementModel.findMany({ organisationId: req.params.organisationId })

    delete req.session.data.placement
    delete req.session.data.currentSubjectLevel

    let pagination = new Pagination(placements, req.query.page, pageSize)
    placements = pagination.getData()

    res.render('../views/placements/schools/list', {
      organisation,
      mentors,
      placements,
      pagination,
      actions: {
        new: `/organisations/${req.params.organisationId}/placements/new`,
        view: `/organisations/${req.params.organisationId}/placements`,
        find: `/organisations/${req.params.organisationId}/placements/find`,
        mentors: `/organisations/${req.params.organisationId}/mentors`,
        back: '/'
      }
    })
  }
}

/// ------------------------------------------------------------------------ ///
/// SHOW PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.placement_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let placement = placementModel.findOne({ placementId: req.params.placementId })

  const actions = {
    change: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
    delete: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/delete`,
    back: `/organisations/${req.params.organisationId}/placements`,
    cancel: `/organisations/${req.params.organisationId}/placements`
  }

  if (['university','scitt'].includes(organisation.type)) {
    placement = placementDecorator.decorate(placement)

    res.render('../views/placements/providers/show', {
      organisation,
      placement,
      actions
    })
  } else {
    res.render('../views/placements/schools/show', {
      organisation,
      placement,
      actions
    })
  }


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

    res.render('../views/placements/schools/subject-level', {
      organisation,
      placement: req.session.data.placement,
      subjectLevelOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/placements`
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
    res.render('../views/placements/schools/subject-level', {
      organisation,
      placement: req.session.data.placement,
      subjectLevelOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/placements`
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

  res.render('../views/placements/schools/subject', {
    organisation,
    placement: req.session.data.placement,
    subjectOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/placements`
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
    res.render('../views/placements/schools/subject', {
      organisation,
      placement: req.session.data.placement,
      subjectOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/placements`
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
  const mentorOptions = mentorHelper.getMentorOptions({
    organisationId: req.params.organisationId,
    otherOption: true,
    otherOptionLabel: 'Not known yet'
  })

  let back = `/organisations/${req.params.organisationId}/placements/new/subject`
  let save = `/organisations/${req.params.organisationId}/placements/new/mentor`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  res.render('../views/placements/schools/mentor', {
    organisation,
    placement: req.session.data.placement,
    mentorOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/placements`
    }
  })
}

exports.new_placement_mentor_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  const otherOptionLabel = 'Not known yet'
  const mentorOptions = mentorHelper.getMentorOptions({
    organisationId: req.params.organisationId,
    otherOption: true,
    otherOptionLabel
  })

  let back = `/organisations/${req.params.organisationId}/placements/new/subject`
  let save = `/organisations/${req.params.organisationId}/placements/new/mentor`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  const errors = []

  if (!req.session.data.placement.mentors?.length) {
    const error = {}
    error.fieldName = 'mentors'
    error.href = '#mentors'
    error.text = 'Select a mentor'
    errors.push(error)
  } else if (
    req.session.data.placement.mentors.length > 1
    && req.session.data.placement.mentors.includes('unknown')
  ) {
    const error = {}
    error.fieldName = 'mentors'
    error.href = '#mentors'
    error.text = `Select a mentor, or select ‘${otherOptionLabel}’`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/placements/schools/mentor', {
      organisation,
      placement: req.session.data.placement,
      mentorOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/placements`
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

  let back = `/organisations/${req.params.organisationId}/placements/new/mentor`
  let save = `/organisations/${req.params.organisationId}/placements/new/window`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  res.render('../views/placements/schools/window', {
    organisation,
    placement: req.session.data.placement,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/placements`
    }
  })
}

exports.new_placement_window_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let back = `/organisations/${req.params.organisationId}/placements/new/mentor`
  let save = `/organisations/${req.params.organisationId}/placements/new/window`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/placements/new/check`
    save += '?referrer=check'
  }

  const errors = []

  if (!req.session.data.placement.window) {
    const error = {}
    error.fieldName = 'window'
    error.href = '#window'
    error.text = 'Select a window'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/placements/schools/window', {
      organisation,
      placement: req.session.data.placement,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/placements`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/check`)
  }
}

exports.new_placement_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/placements/schools/check-your-answers', {
    organisation,
    placement: req.session.data.placement,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/new/check`,
      back: `/organisations/${req.params.organisationId}/placements/new/window`,
      change: `/organisations/${req.params.organisationId}/placements/new`,
      cancel: `/organisations/${req.params.organisationId}/placements`
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

/// ------------------------------------------------------------------------ ///
/// EDIT PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.edit_placement_subject_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const currentPlacement = placementModel.findOne({ placementId: req.params.placementId })
  const subjectOptions = subjectHelper.getSubjectOptions(currentPlacement.subjectLevel)

  res.render('../views/placements/schools/subject', {
    organisation,
    currentPlacement,
    placement: currentPlacement,
    subjectOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/subject`,
      back: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
      cancel: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`
    }
  })
}

exports.edit_placement_subject_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const currentPlacement = placementModel.findOne({ placementId: req.params.placementId })
  // combine submitted data with current placement data
  const placement = {...currentPlacement, ...req.session.data.placement}

  const subjectOptions = subjectHelper.getSubjectOptions(placement.subjectLevel)

  const errors = []

  if (placement.subjectLevel === 'secondary') {
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
    res.render('../views/placements/schools/subject', {
      organisation,
      currentPlacement,
      placement,
      subjectOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/subject`,
        back: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
        cancel: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`
      },
      errors
    })
  } else {
    placementModel.updateOne({
      organisationId: req.params.organisationId,
      placementId: req.params.placementId,
      placement: req.session.data.placement,
    })

    req.flash('success', 'Subject updated')
    res.redirect(`/organisations/${req.params.organisationId}/placements/${req.params.placementId}`)
  }
}

exports.edit_placement_mentor_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const currentPlacement = placementModel.findOne({ placementId: req.params.placementId })
  const mentorOptions = mentorHelper.getMentorOptions({
    organisationId: req.params.organisationId,
    otherOption: true,
    otherOptionLabel: 'Not known yet'
  })

  res.render('../views/placements/schools/mentor', {
    organisation,
    currentPlacement,
    placement: currentPlacement,
    mentorOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/mentor`,
      back: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
      cancel: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`
    }
  })
}

exports.edit_placement_mentor_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const currentPlacement = placementModel.findOne({ placementId: req.params.placementId })
  // combine submitted data with current placement data
  const placement = {...currentPlacement, ...req.session.data.placement}

  const otherOptionLabel = 'Not known yet'
  const mentorOptions = mentorHelper.getMentorOptions({
    organisationId: req.params.organisationId,
    otherOption: true,
    otherOptionLabel
  })

  const errors = []

  if (!req.session.data.placement?.mentors?.length) {
    const error = {}
    error.fieldName = 'mentors'
    error.href = '#mentors'
    error.text = 'Select a mentor'
    errors.push(error)
  } else if (
    req.session.data.placement.mentors.length > 1
    && req.session.data.placement.mentors.includes('unknown')
  ) {
    const error = {}
    error.fieldName = 'mentors'
    error.href = '#mentors'
    error.text = `Select a mentor, or select ‘${otherOptionLabel}’`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/placements/schools/mentor', {
      organisation,
      currentPlacement,
      placement,
      mentorOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/mentor`,
        back: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
        cancel: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`
      },
      errors
    })
  } else {
    placementModel.updateOne({
      organisationId: req.params.organisationId,
      placementId: req.params.placementId,
      placement: req.session.data.placement,
    })

    req.flash('success', 'Mentor updated')
    res.redirect(`/organisations/${req.params.organisationId}/placements/${req.params.placementId}`)
  }
}

exports.edit_placement_window_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const currentPlacement = placementModel.findOne({ placementId: req.params.placementId })

  res.render('../views/placements/schools/window', {
    organisation,
    currentPlacement,
    placement: currentPlacement,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/window`,
      back: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
      cancel: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`
    }
  })
}

exports.edit_placement_window_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const currentPlacement = placementModel.findOne({ placementId: req.params.placementId })
  // combine submitted data with current placement data
  const placement = {...currentPlacement, ...req.session.data.placement}

  const errors = []

  if (!req.session.data.placement.window) {
    const error = {}
    error.fieldName = 'window'
    error.href = '#window'
    error.text = 'Select a window'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/placements/schools/window', {
      organisation,
      currentPlacement,
      placement,
      actions: {
        save: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/window`,
        back: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
        cancel: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`
      },
      errors
    })
  } else {
    placementModel.updateOne({
      organisationId: req.params.organisationId,
      placementId: req.params.placementId,
      placement: req.session.data.placement,
    })

    req.flash('success', 'Window updated')
    res.redirect(`/organisations/${req.params.organisationId}/placements/${req.params.placementId}`)
  }
}

/// ------------------------------------------------------------------------ ///
/// DELETE PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.delete_placement_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const placement = placementModel.findOne({
    organisationId: req.params.organisationId,
    placementId: req.params.placementId
  })

  res.render('../views/placements/schools/delete', {
    organisation,
    placement,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}/delete`,
      back: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`,
      cancel: `/organisations/${req.params.organisationId}/placements/${req.params.placementId}`
    }
  })
}

exports.delete_placement_post = (req, res) => {
  placementModel.deleteOne({
    organisationId: req.params.organisationId,
    placementId: req.params.placementId
  })

  req.flash('success', 'Placement deleted')
  res.redirect(`/organisations/${req.params.organisationId}/placements`)
}
