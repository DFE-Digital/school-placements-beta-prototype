exports.getCheckboxValues = (name, data) => {
  return name && (Array.isArray(name)
    ? name
    : [name].filter((name) => {
        return name !== '_unchecked'
      })) || data && (Array.isArray(data) ? data : [data])
}

exports.removeFilter = (value, data) => {
  // do this check because if coming from overview page for example,
  // the query/param will be a string value, not an array containing a string
  if (Array.isArray(data)) {
    return data.filter(item => item !== value)
  } else {
    return null
  }
}

exports.getFilterAItems = () => {
  const options = [
    {
      id: 'b5995d91-a26e-4c4d-b338-30c1d187ece8',
      text: 'Option A1',
      value: 'option-1'
    },
    {
      id: 'a2fce60f-d211-44cc-94fc-50c9c4145d67',
      text: 'Option A2',
      value: 'option-2'
    },
    {
      id: 'aed87067-6aad-4898-8cb0-377d4f84ab99',
      text: 'Option A3',
      value: 'option-3'
    }
  ]

  return options
}

exports.getFilterALabel = (value) => {
  const options = [
    {
      id: 'b5995d91-a26e-4c4d-b338-30c1d187ece8',
      text: 'Option A1',
      value: 'option-1'
    },
    {
      id: 'a2fce60f-d211-44cc-94fc-50c9c4145d67',
      text: 'Option A2',
      value: 'option-2'
    },
    {
      id: 'aed87067-6aad-4898-8cb0-377d4f84ab99',
      text: 'Option A3',
      value: 'option-3'
    }
  ]

  let label = value

  const option = options.find(option => option.value === value)

  if (option) {
    label = option.text
  }

  return label
}

exports.getFilterBItems = () => {
  const options = [
    {
      id: '4d8800ae-a56a-4863-9f38-b9e7980e4832',
      text: 'Option B1',
      value: 'option-1'
    },
    {
      id: '26d60c28-8634-41d5-b8c7-704ec06a8454',
      text: 'Option B2',
      value: 'option-2'
    },
    {
      id: 'ba096960-271b-4fed-9c15-396404f26299',
      text: 'Option B3',
      value: 'option-3'
    }
  ]

  return options
}

exports.getFilterBLabel = (value) => {
  const options = [
    {
      id: '4d8800ae-a56a-4863-9f38-b9e7980e4832',
      text: 'Option B1',
      value: 'option-1'
    },
    {
      id: '26d60c28-8634-41d5-b8c7-704ec06a8454',
      text: 'Option B2',
      value: 'option-2'
    },
    {
      id: 'ba096960-271b-4fed-9c15-396404f26299',
      text: 'Option B3',
      value: 'option-3'
    }
  ]

  let label = value

  const option = options.find(option => option.value === value)

  if (option) {
    label = option.text
  }

  return label
}

exports.getFilterCItems = () => {
  const options = [
    {
      id: '3bc6509f-5d81-4d18-8d78-d524af3b1920',
      text: 'Option C1',
      value: 'option-1'
    },
    {
      id: 'aeb509be-2a71-4ac8-a763-7f3f76de058e',
      text: 'Option C2',
      value: 'option-2'
    },
    {
      id: 'bd33b660-c1e2-4d98-92cc-57c21c7a315d',
      text: 'Option C3',
      value: 'option-3'
    }
  ]

  return options
}

exports.getFilterCLabel = (value) => {
  const options = [
    {
      id: '3bc6509f-5d81-4d18-8d78-d524af3b1920',
      text: 'Option C1',
      value: 'option-1'
    },
    {
      id: 'aeb509be-2a71-4ac8-a763-7f3f76de058e',
      text: 'Option C2',
      value: 'option-2'
    },
    {
      id: 'bd33b660-c1e2-4d98-92cc-57c21c7a315d',
      text: 'Option C3',
      value: 'option-3'
    }
  ]

  let label = value

  const option = options.find(option => option.value === value)

  if (option) {
    label = option.text
  }

  return label
}

exports.getSelectedSubjectItems = (selectedItems, baseHref = '/results') => {
  const items = []

  selectedItems.forEach((item) => {
    const subject = {}
    subject.text = item.text
    subject.href = `${baseHref}/remove-subject-filter/${item.value}`

    items.push(subject)
  })

  return items
}

exports.getSubjectOptions = (subjectLevel, selectedItem) => {
  const items = []

  let subjects = require('../data/dist/subjects/subjects')
  subjects = subjects.filter(subject => subject.level === subjectLevel &&
    !['ML','24'].includes(subject.code))

  subjects.forEach((subject, i) => {
    const item = {}

    item.text = subject.name
    // item.text += ' (' + subject.code + ')'
    item.value = subject.code
    item.id = subject.id
    item.checked = (selectedItem && selectedItem.includes(subject.code)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a, b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}
