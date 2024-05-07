const locationService = require('../services/locations')

/// ------------------------------------------------------------------------ ///
/// AUTOCOMPLETE DATA
/// ------------------------------------------------------------------------ ///

exports.location_suggestions_json = async (req, res) => {
  req.headers['Access-Control-Allow-Origin'] = true

  let locations = []

  if (req.query.query) {
    locations = await locationService.getLocationSuggestions(req.query.query)
  }

  res.json(locations)
}
