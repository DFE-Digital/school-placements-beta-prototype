const placementModel = require('../models/placements')

/// ------------------------------------------------------------------------ ///
/// LIST PLACEMENT
/// ------------------------------------------------------------------------ ///

exports.placement_list = (req, res) => {
    const placements = placementModel.findMany({ organisationId: req.params.organisationId })
  
    delete req.session.data.user
  
    res.render('../views/placements/list', {
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

}

exports.new_placement_post = (req, res) => {

}

exports.new_placement_phase_get = (req, res) => {

}

exports.new_placement_phase_post = (req, res) => {

}

exports.new_placement_subject_get = (req, res) => {

}

exports.new_placement_subject_post = (req, res) => {

}

exports.new_placement_window_get = (req, res) => {

}

exports.new_placement_window_post = (req, res) => {

}

exports.new_placement_check_get = (req, res) => {

}

exports.new_placement_check_post = (req, res) => {

}