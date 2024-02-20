const placementModel = require('../models/placements')
const organisationModel = require('../models/organisations')
const mentorHelper = require('../helpers/mentors')

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
/// NEW PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.new_placement_get = (req, res) => {

    res.render('../views/placements/phase', {
        placement: req.session.data.placement,
        actions: {
          save: `/organisations/${req.params.organisationId}/placements/new`,
          back: `/organisations/${req.params.organisationId}/placements`
        }
      })
}

exports.new_placement_post = (req, res) => {
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/subject`)
}

exports.new_placement_subject_get = (req, res) => {

    res.render('../views/placements/subject', {
        placement: req.session.data.placement,
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
    const mentorOptions = mentorHelper.getMentorOptions({ organisationId: req.params.organisationId })
    res.render('../views/placements/mentor', {
        placement: req.session.data.placement,
        mentorOptions,
        actions: {
          save: `/organisations/${req.params.organisationId}/placements/new/mentor`,
          back: `/organisations/${req.params.organisationId}/placements/new/subject`
        }
      })
}

exports.new_placement_mentor_post = (req, res) => {
    res.redirect(`/organisations/${req.params.organisationId}/placements/new/window`)
}

exports.new_placement_window_get = (req, res) => {

    res.render('../views/placements/window', {
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

    res.render('../views/placements/check', {
        placement: req.session.data.placement,
        actions: {
          save: `/organisations/${req.params.organisationId}/placements/new`,
          back: `/organisations/${req.params.organisationId}/placements/new/window`
        }
      })
}

exports.new_placement_check_post = (req, res) => {

}