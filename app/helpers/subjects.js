exports.getSubjectLevelOptions = () => { // selectedItem
  const items = []
  const subjectLevels = require('../data/subjects/subject-levels')

  subjectLevels.forEach((subjectLevel, i) => {
    const item = {}

    item.text = subjectLevel.name
    item.value = subjectLevel.code
    item.id = subjectLevel.id
    // item.checked = (selectedItem && selectedItem.includes(subjectLevel.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getSubjectLevelLabel = (code) => {
  const subjectLevels = require('../data/subjects/subject-levels')
  const subjectLevel = subjectLevels.find(subjectLevel => subjectLevel.code === code)

  let label = code

  if (subjectLevel) {
    label = subjectLevel.name
  }

  return label
}

exports.getSubjectOptions = (subjectLevel) => { //, selectedItem
  const items = []

  let subjects = require('../data/subjects/subjects')
  subjects = subjects.filter(subject => subject.level === subjectLevel &&
    subject.code !== '24' &&
    subject.parentCode === undefined)

  subjects.forEach((subject, i) => {
    const item = {}

    item.text = subject.name
    item.value = subject.code
    item.id = subject.id
    // item.checked = (selectedItem && selectedItem.includes(subject.code)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a, b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getSubjectLabel = (code) => {
  const subjects = require('../data/subjects/subjects')
  const subject = subjects.find(subject => subject.code === code)

  let label = code

  if (subject) {
    label = subject.name
  }

  return label
}