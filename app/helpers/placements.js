const subjectHelper = require('./subjects')
const utils = require('./utils')

exports.getPlacementLabel = (subjects) => {
  let placementLabel = ''
  const labels = []

  if (Array.isArray(subjects)) {
    subjects.forEach((subject, i) => {
      labels.push(
        subjectHelper.getSubjectLabel(subject)
      )
    })

    placementLabel += utils.arrayToList(
      array = labels,
      join = ', ',
      final = ' and '
    )
  } else {
    placementLabel = subjectHelper.getSubjectLabel(subjects)
  }

  return placementLabel
}
