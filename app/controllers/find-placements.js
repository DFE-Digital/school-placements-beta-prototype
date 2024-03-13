const organisationModel = require('../models/organisations.js')
const placementModel = require('../models/placements.js')

const Pagination = require('../helpers/pagination')
const subjectHelper = require('../helpers/subjects')
const filterHelper = require('../helpers/filters.js')

const placementDecorator = require('../decorators/placements.js')

/// ------------------------------------------------------------------------ ///
/// Find
/// ------------------------------------------------------------------------ ///

exports.find_location_get = (req, res) => {
  delete req.session.data.questions
  delete req.session.data.filters
  delete req.session.data.location
  delete req.session.data.school
  delete req.session.data.q
  delete req.session.data.sortBy
  delete req.session.data.keywords

  res.render('placements/find/location', {
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/find`,
      back: `/organisations/${req.params.organisationId}/placements`,
      cancel: `/organisations/${req.params.organisationId}/placements`
    }
  })
}

exports.find_location_post = (req, res) => {
  // Search query
  // const q = req.session.data.q || req.query.q

  const errors = []

  if (req.session.data.q === undefined) {
    const error = {}
    error.fieldName = "q"
    error.href = "#q"
    error.text = "Select find placements by location or by school"
    errors.push(error)
  } else {
    if (req.session.data.q === 'location' && !req.session.data.location.length) {
      const error = {}
      error.fieldName = "location"
      error.href = "#location"
      error.text = "Enter a city, town or postcode"
      errors.push(error)
    }

    if (req.session.data.q === 'school' && !req.session.data.school.length) {
      const error = {}
      error.fieldName = "school"
      error.href = "#school"
      error.text = "Enter a school name, URN or postcode"
      errors.push(error)
    }
  }

  if (errors.length) {
    res.render('placements/find/location', {
      actions: {
        save: `/organisations/${req.params.organisationId}/placements/find`,
        back: `/organisations/${req.params.organisationId}/placements`,
        cancel: `/organisations/${req.params.organisationId}/placements`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/placements/find/subject-level`)
  }
}

exports.find_subject_level_get = (req, res) => {
  const subjectLevelOptions = subjectHelper.getSubjectLevelOptions()

  res.render('placements/find/subject-level', {
    questions: req.session.data.questions,
    subjectLevelOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/find/subject-level`,
      back: `/organisations/${req.params.organisationId}/placements/find`,
      cancel: `/organisations/${req.params.organisationId}/placements`
    }
  })
}

exports.find_subject_level_post = (req, res) => {
  const errors = []

  if (!req.session.data.questions.subjectLevel?.length) {
    const error = {}
    error.fieldName = "subject-level"
    error.href = "#subject-level"
    error.text = "Select a subject level"
    errors.push(error)
  }

  if (errors.length) {
    const subjectLevelOptions = subjectHelper.getSubjectLevelOptions()

    res.render('placements/find/subject-level', {
      questions: req.session.data.questions,
      subjectLevelOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/placements/find/subject-level`,
        back: `/organisations/${req.params.organisationId}/placements/find`,
        cancel: `/organisations/${req.params.organisationId}/placements`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/placements/find/subject`)
  }
}

exports.find_subject_get = (req, res) => {
  const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.questions.subjectLevel)

  res.render('placements/find/subject', {
    questions: req.session.data.questions,
    subjectOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/placements/find/subject`,
      back: `/organisations/${req.params.organisationId}/placements/find/subject-level`,
      cancel: `/organisations/${req.params.organisationId}/placements`
    }
  })
}

exports.find_subject_post = (req, res) => {
  const errors = []

  if (req.session.data.questions.subjectLevel === 'secondary') {
    if (!req.session.data.questions.subjects.length) {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a least one secondary subject'
      errors.push(error)
    }
  } else {
    if (!req.session.data.questions.subjects.length) {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a least one primary subject specialism'
      errors.push(error)
    }
  }

  if (errors.length) {
    const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.questions.subjectLevel)

    res.render('placements/find/subject', {
      questions: req.session.data.questions,
      subjectOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/placements/find/subject`,
        back: `/organisations/${req.params.organisationId}/placements/find/subject-level`,
        cancel: `/organisations/${req.params.organisationId}/placements`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
  }
}

/// ------------------------------------------------------------------------ ///
/// Results
/// ------------------------------------------------------------------------ ///

exports.placements_list = (req, res) => {
  // Search
  const keywords = req.session.data.keywords

  const hasSearch = !!((keywords))

  // Filters
  const a = null
  const b = null
  const c = null

  let as
  if (req.session.data.filters?.a) {
    as = filterHelper.getCheckboxValues(a, req.session.data.filters.a)
  }
  // else {
  //   as = defaults.a
  // }

  let bs
  if (req.session.data.filters?.b) {
    bs = filterHelper.getCheckboxValues(b, req.session.data.filters.b)
  }
  // else {
  //   bs = defaults.b
  // }

  let cs
  if (req.session.data.filters?.c) {
    cs = filterHelper.getCheckboxValues(c, req.session.data.filters.c)
  }
  // else {
  //   cs = defaults.c
  // }

  const hasFilters = !!((as?.length > 0)
    || (bs?.length > 0)
    || (cs?.length > 0)
  )

  let selectedFilters = null

  if (hasFilters) {
    selectedFilters = {
      categories: []
    }

    if (as?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Filter A' },
        items: as.map((a) => {
          return {
            text: filterHelper.getFilterALabel(a),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-a-filter/${a}`
          }
        })
      })
    }

    if (bs?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Filter B' },
        items: bs.map((b) => {
          return {
            text: filterHelper.getFilterBLabel(b),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-b-filter/${b}`
          }
        })
      })
    }

    if (cs?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Filter C' },
        items: cs.map((c) => {
          return {
            text: filterHelper.getFilterCLabel(c),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-c-filter/${c}`
          }
        })
      })
    }
  }

  // let selectedA
  // if (req.session.data.filters?.a) {
  //   selectedA = req.session.data.filters.a
  // }
  // else {
  //   selectedA = defaults.a
  // }

  const filterAItems = filterHelper.getFilterAItems()

  // let selectedB
  // if (req.session.data.filters?.b) {
  //   selectedB = req.session.data.filters.b
  // }
  // else {
  //   selectedB = defaults.b
  // }

  const filterBItems = filterHelper.getFilterBItems()

  // let selectedC
  // if (req.session.data.filters?.c) {
  //   selectedC = req.session.data.filters.c
  // }
  // else {
  //   selectedC = defaults.c
  // }

  const filterCItems = filterHelper.getFilterCItems()

  // Search radius - 5, 10, 50
  // default to 50
  // needed to get a list of results rather than 1
  // const radius = req.session.data.radius || req.query.radius || defaults.radius

  // Search query
  // const q = req.session.data.q || req.query.q

  // sort by settings
  // const sortBy = req.query.sortBy || req.session.data.sortBy || 0
  // const sortByItems = utilsHelper.getCourseSortBySelectOptions(sortBy)

  // pagination settings
  // const page = req.query.page || 1
  // const perPage = 20

  // let selectedSubject
  // if (req.session.data.questions?.subjects) {
  //   selectedSubject = req.session.data.questions.subjects
  // }
  // else {
  //   selectedSubject = defaults.subject
  // }

  // const subjectItems = filterHelper.getSubjectOptions(req.session.data.questions.subjectLevel, selectedSubject)

  // get an array of selected subjects for use in the search terms subject list
  // const selectedSubjects = filterHelper.getSelectedSubjectItems(subjectItems.filter(subject => subject.checked === 'checked'))

  let results = placementModel.findMany({
    subjectLevel: req.session.data.questions.subjectLevel
  })

  // add details of school to each placement result
  if (results.length) {

    results = results.map(result => {
      return result = placementDecorator.decorate(result)
    })

  }

  // sort results
  results.sort((a, b) => {
    return a.name.localeCompare(b.name) || a.school.name.localeCompare(b.school.name)
  })

  let pageSize = 25
  let pagination = new Pagination(results, req.query.page, pageSize)
  results = pagination.getData()

  res.render('../views/placements/find/list', {
    results,
    pagination,
    selectedFilters,
    hasFilters,
    hasSearch,
    keywords,
    filterAItems,
    filterBItems,
    filterCItems,
    filters: req.session.data.filters,
    questions: req.session.data.questions,
    selectedSubjects: req.session.data.questions.subjects,
    actions: {
      view: `/organisations/${req.params.organisationId}/placements/find/results`,
      back: `/organisations/${req.params.organisationId}/placements/find/subject`,
      change: `/organisations/${req.params.organisationId}/placements/find`,
      filters: {
        apply: `/organisations/${req.params.organisationId}/placements/find/results`,
        remove: `/organisations/${req.params.organisationId}/placements/find/results/remove-all-filters`
      },
      search: {
        find: `/organisations/${req.params.organisationId}/placements/find/results`,
        remove: `/organisations/${req.params.organisationId}/placements/find/results/remove-keyword-search`
      }
    }
  })

}

exports.removeKeywordSearch = (req, res) => {
  delete req.session.data.keywords
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeFilterA = (req, res) => {
  req.session.data.filters.a = filterHelper.removeFilter(req.params.a, req.session.data.filters.a)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeFilterB = (req, res) => {
  req.session.data.filters.b = filterHelper.removeFilter(req.params.b, req.session.data.filters.b)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeFilterC = (req, res) => {
  req.session.data.filters.c = filterHelper.removeFilter(req.params.c, req.session.data.filters.c)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeAllFilters = (req, res) => {
  delete req.session.data.filters
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.show = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const placement = placementModel.findOne({
    organisationId: req.params.organisationId,
    placementId: req.params.placementId
  })

  // TODO append filter data to back link

  res.render('../views/placements/find/show', {
    placement,
    organisation,
    actions: {
      back: `/organisations/${req.params.organisationId}/placements/find/results`
    }
  })
}
