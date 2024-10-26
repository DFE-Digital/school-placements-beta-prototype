const gcpApiKey = process.env.GCP_API_KEY

const locationSuggestionsService = {
  async getLocationSuggestions (query) {
    // https://developers.google.com/maps/documentation/places/web-service/autocomplete

    // Build the request URL with input and API key
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.set('input', query)
    url.searchParams.set('language', 'en')
    url.searchParams.set('components', 'country:uk')
    url.searchParams.set('key', gcpApiKey)

    // Fetch data asynchronously
    const locationSuggestions = fetch(url)
      .then(response => response.json())
      .then(data => {
        // Process the response data (predictions)
        console.log('Predictions:', data.predictions)

        if (data.predictions) {
          return data.predictions.map((prediction) => {
            return prediction.description.split(',').slice(0, -1).join(',')
          })
        } else {
          return []
        }
      })
      .catch(error => console.error('Error fetching predictions:', error))

    return locationSuggestions
  },

  async getLocations (query) {
    // https://developers.google.com/maps/documentation/places/web-service/autocomplete

    // Build the request URL with input and API key
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.set('input', query)
    url.searchParams.set('language', 'en')
    url.searchParams.set('components', 'country:uk')
    url.searchParams.set('key', gcpApiKey)

    // Fetch data asynchronously
    const locations = fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Predictions:', data.predictions)
        return data.predictions
      })
      .catch(error => console.error('Error fetching predictions:', error))

    return locations
  },

  async getLocation (query) {
    // https://developers.google.com/maps/documentation/places/web-service/details

    const getLocationPlaceId = (predictions) => {
      console.log('Predictions:', predictions)
      const location = predictions[0]
      return location.place_id
    }

    const location = this.getLocations(query)
      .then(getLocationPlaceId)
      .then((placeId) => {
        console.log('placeId:', placeId)
        // Build the request URL with input and API key
        const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
        url.searchParams.set('place_id', placeId)
        url.searchParams.set('language', 'en')
        url.searchParams.set('components', 'country:uk')
        url.searchParams.set('key', gcpApiKey)

        const location = fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log('Place details:', data)
            return data.result
          })
          .catch(error => console.error('Error fetching place details:', error))

        return location
      })

    return location
  }
}

module.exports = locationSuggestionsService
