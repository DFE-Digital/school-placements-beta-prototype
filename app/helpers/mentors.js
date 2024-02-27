const mentorModel = require('../models/mentors')

exports.getMentorOptions = (params) => {
  const items = []

  const mentors = mentorModel.findMany({ organisationId: params.organisationId })

  mentors.forEach((mentor, i) => {
    const item = {}

    item.text = `${mentor.firstName} ${mentor.lastName}`
    item.value = mentor.trn.toString()
    item.id = mentor.id

    // item.hint = {}
    // item.hint.text = mentor.trn

    items.push(item)
  })

  items.sort((a, b) => {
    return a.text.localeCompare(b.text)
  })

  if (params.otherOption) {
    const divider = {}
    divider.divider = 'or'
    items.push(divider)

    const unknown = {}
    unknown.text = params.otherOptionLabel ? params.otherOptionLabel : 'Not known yet'
    unknown.value = 'unknown'
    unknown.id = 'a9495469-9ddc-4db0-9d2d-9f2891886dbe'
    unknown.behaviour = 'exclusive'
    items.push(unknown)
  }

  return items
}


exports.getMentorName = (trn) => {
  const mentor = mentorModel.findOne({ trn: trn })

  let label = trn

  if (mentor) {
    label = `${mentor.firstName} ${mentor.lastName}`
  }

  return label
}
