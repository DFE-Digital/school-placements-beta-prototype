exports.arrayToList = (array, join = ', ', final = ' and ') => {
  const arr = array.slice(0)

  const last = arr.pop()

  if (array.length > 1) {
    return arr.join(join) + final + last
  }

  return last
}

exports.slugify = (text) => {
  return text.trim()
    .toLowerCase()
    // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
    .replace(/[^\w\s-]/g, '')
    // swap any length of whitespace, underscore, hyphen characters with a single -
    .replace(/[\s_-]+/g, '-')
    // remove leading, trailing -
    .replace(/^-+|-+$/g, '')
}

exports.arrayToDateObject = (array) => {
  return new Date(array[2], array[1] - 1, array[0])
}

exports.getSelectedOrganisationTypeItems = (selectedItems, baseHref = '/support/organisations') => {
  const items = []

  selectedItems.forEach((thing) => {
    const item = {}
    item.text = thing.text
    item.href = `${baseHref}/remove-type-filter/${thing.value}`

    items.push(item)
  })

  return items
}

exports.getOrganisationTypeFilterItems = (selectedItems) => {
  const options = require('../data/dist/organisation-types')

  const items = []

  options.forEach((option, i) => {
    const item = {}

    item.text = option.name
    item.value = option.code
    item.id = option.id
    item.checked = (selectedItems && selectedItems.includes(option.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getOrganisationTypeLabel = (code) => {
  const types = require('../data/dist/organisation-types')
  let label = code

  if (code) {
    label = types.find(type => type.code === code).name
  }

  return label
}
