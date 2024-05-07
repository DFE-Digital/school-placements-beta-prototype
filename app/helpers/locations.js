
exports.getDistance = (lat1, lon1, lat2, lon2, unit = 'mi') => {
  // Convert degrees to radians
  const earthRadius = {
    'km': 6371,  // Earth radius in kilometers
    'mi': 3959 // Earth radius in miles
  };

  const lat1Rad = lat1 * Math.PI / 180
  const lat2Rad = lat2 * Math.PI / 180
  const dLat = lat2Rad - lat1Rad
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = earthRadius[unit] * c

  return distance
}


// origin
// destination

// function calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
//   // Convert degrees to radians
//   const earthRadius = {
//     'km': 6371,
//     'mi': 3959 // Earth radius in miles
//   };

//   const lat1Rad = lat1 * Math.PI / 180;
//   const lat2Rad = lat2 * Math.PI / 180;
//   const dLat = lat2Rad - lat1Rad;
//   const dLon = (lon2 - lon1) * Math.PI / 180;

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1Rad) * Math.cos(lat2Rad) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   const distance = earthRadius[unit] * c;

//   return distance;
// }

// // Example usage
// const loc1Lat = 51.505; // London
// const loc1Lon = -0.09;

// const loc2Lat = 48.8566; // Paris
// const loc2Lon = 2.3522;

// const distanceKm = calculateDistance(loc1Lat, loc1Lon, loc2Lat, loc2Lon);
// const distanceMi = calculateDistance(loc1Lat, loc1Lon, loc2Lat, loc2Lon, 'mi');

// console.log(`The distance between London and Paris is approximately ${distanceKm.toFixed(2)} kilometers.`);
// console.log(`The distance between London and Paris is approximately ${distanceMi.toFixed(2)} miles.`);
