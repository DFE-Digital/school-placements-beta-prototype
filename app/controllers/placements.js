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
    // show subject level form
    const subjectLevelOptions = subjectHelper.getSubjectLevelOptions(req.session.data.placement.subjectLevel)
    res.render('../views/placements/subject-level', {
        organisation,
        placement: req.session.data.placement,
        subjectLevelOptions,
        actions: {
          save: `/organisations/${req.params.organisationId}/placements/new`,
          back: `/organisations/${req.params.organisationId}/placements`
        }
      })
    }
}

exports.new_placement_post = (req, res) => {
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/subject`)
}

exports.new_placement_subject_get = (req, res) => {
    const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
    const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.placement.subjectLevel)
    res.render('../views/placements/subject', {
        organisation,
        placement: req.session.data.placement,
        subjectOptions,
        actions: {
          save: `/organisations/${req.params.organisationId}/placements/new/subject`,
          back: `/organisations/${req.params.organisationId}/placements/new`
        }
      })
}

exports.new_placement_subject_post = (req, res) => {
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/mentor`)
}

exports.new_placement_mentor_get = (req, res) => {
    const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
    const mentorOptions = mentorHelper.getMentorOptions({ organisationId: req.params.organisationId })
    res.render('../views/placements/mentor', {
        organisation,
        placement: req.session.data.placement,
        mentorOptions,
        actions: {
          save: `/organisations/${req.params.organisationId}/placements/new/mentor`,
          back: `/organisations/${req.params.organisationId}/placements/new/subject`
        }
      })
}

exports.new_placement_mentor_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const mentorOptions = mentorHelper.getMentorOptions({ organisationId: req.params.organisationId })
  const errors = []

  if (!req.session.data.placement.mentor.length) {
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
        save: `/organisations/${req.params.organisationId}/placements/new/mentor`,
        back: `/organisations/${req.params.organisationId}/placements/new/subject`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/window`)
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
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/check`)
}

exports.new_placement_check_get = (req, res) => {
    const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

    res.render('../views/placements/check', {
        organisation,
        placement: req.session.data.placement,
        actions: {
          save: `/organisations/${req.params.organisationId}/placements/new/check`,
          back: `/organisations/${req.params.organisationId}/placements/new/window`,
          change: `/organisations/${req.params.organisationId}/mentors/new?referrer=check`
        }
      })
}

exports.new_placement_check_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  placementModel.insertOne({
    organisationId: req.params.organisationId,
    placement: req.session.data.placement
  })

  delete req.session.data.placement

  req.flash('success', 'Placement added')
  res.redirect(`/organisations/${req.params.organisationId}/placements`)
}
