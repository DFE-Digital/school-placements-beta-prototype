const organisationModel = require('../models/organisations.js')
const placementModel = require('../models/placements.js')

const Pagination = require('../helpers/pagination')
const giasHelper = require('../helpers/gias')
const ofstedHelper = require('../helpers/ofsted')
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
  const ageRange = null
  const establishmentType = null
  const gender = null
  const religiousCharacter = null
  const ofstedRating = null

  let ageRanges
  if (req.session.data.filters?.ageRange) {
    ageRanges = filterHelper.getCheckboxValues(ageRange, req.session.data.filters.ageRange)
  }
  // else {
  //   ageRanges = defaults.ageRange
  // }

  let establishmentTypes
  if (req.session.data.filters?.establishmentType) {
    establishmentTypes = filterHelper.getCheckboxValues(establishmentType, req.session.data.filters.establishmentType)
  }
  // else {
  //   establishmentTypes = defaults.establishmentType
  // }

  let genders
  if (req.session.data.filters?.gender) {
    genders = filterHelper.getCheckboxValues(gender, req.session.data.filters.gender)
  }
  // else {
  //   genders = defaults.gender
  // }

  let religiousCharacters
  if (req.session.data.filters?.religiousCharacter) {
    religiousCharacters = filterHelper.getCheckboxValues(religiousCharacter, req.session.data.filters.religiousCharacter)
  }
  // else {
  //   religiousCharacters = defaults.religiousCharacter
  // }

  let ofstedRatings
  if (req.session.data.filters?.ofstedRating) {
    ofstedRatings = filterHelper.getCheckboxValues(ofstedRating, req.session.data.filters.ofstedRating)
  }
  // else {
  //   ofstedRatings = defaults.ofstedRating
  // }

  const hasFilters = !!((ageRanges?.length > 0)
    || (establishmentTypes?.length > 0)
    || (genders?.length > 0)
    || (religiousCharacters?.length > 0)
    || (ofstedRatings?.length > 0)
  )

  let selectedFilters = null

  if (hasFilters) {
    selectedFilters = {
      categories: []
    }

    if (ageRanges?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Age range' },
        items: ageRanges.map((ageRange) => {
          return {
            text: filterHelper.getFilterALabel(ageRange),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-age-range-filter/${ageRange}`
          }
        })
      })
    }

    if (establishmentTypes?.length) {
      selectedFilters.categories.push({
        heading: { text: 'School type' },
        items: establishmentTypes.map((establishmentType) => {
          return {
            text: giasHelper.getEstablishmentTypeLabel(establishmentType),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-establishment-type-filter/${establishmentType}`
          }
        })
      })
    }

    if (genders?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Gender' },
        items: genders.map((gender) => {
          return {
            text: giasHelper.getGenderLabel(gender),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-gender-filter/${gender}`
          }
        })
      })
    }

    if (religiousCharacters?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Religious character' },
        items: religiousCharacters.map((religiousCharacter) => {
          return {
            text: giasHelper.getReligiousCharacterLabel(religiousCharacter),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-religious-character-filter/${religiousCharacter}`
          }
        })
      })
    }

    if (ofstedRatings?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Ofsted rating' },
        items: ofstedRatings.map((ofstedRating) => {
          return {
            text: ofstedHelper.getOfstedRatingLabel(ofstedRating),
            href: `/organisations/${req.params.organisationId}/placements/find/results/remove-ofsted-rating-filter/${ofstedRating}`
          }
        })
      })
    }
  }

  const filterAgeRangeItems = filterHelper.getFilterAItems()

  let selectedEstablishmentType
  if (req.session.data.filters?.establishmentType) {
    selectedEstablishmentType = req.session.data.filters.establishmentType
  }

  const filterEstablishmentTypeItems = giasHelper.getEstablishmentTypeOptions(selectedEstablishmentType)

  let selectedGender
  if (req.session.data.filters?.gender) {
    selectedGender = req.session.data.filters.gender
  }

  const filterGenderItems = giasHelper.getGenderOptions(selectedGender)

  let selectedReligiousCharacter
  if (req.session.data.filters?.religiousCharacter) {
    selectedReligiousCharacter = req.session.data.filters.religiousCharacter
  }

  const filterReligiousCharacterItems = giasHelper.getReligiousCharacterOptions(selectedReligiousCharacter)

  let selectedOfstedRating
  if (req.session.data.filters?.ofstedRating) {
    selectedOfstedRating = req.session.data.filters.ofstedRating
  }

  const filterOfstedRatingItems = ofstedHelper.getOfstedRatingOptions(selectedOfstedRating)

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
    subjectLevel: req.session.data.questions.subjectLevel,
    subjects: req.session.data.questions.subjects
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
    filterAgeRangeItems,
    filterEstablishmentTypeItems,
    filterGenderItems,
    filterReligiousCharacterItems,
    filterOfstedRatingItems,
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

exports.removeFilterAgeRange = (req, res) => {
  req.session.data.filters.ageRange = filterHelper.removeFilter(req.params.ageRange, req.session.data.filters.ageRange)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeFilterEstablishmentType = (req, res) => {
  req.session.data.filters.establishmentType = filterHelper.removeFilter(req.params.establishmentType, req.session.data.filters.establishmentType)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeFilterGender = (req, res) => {
  req.session.data.filters.gender = filterHelper.removeFilter(req.params.gender, req.session.data.filters.gender)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeFilterReligiousCharacter = (req, res) => {
  req.session.data.filters.religiousCharacter = filterHelper.removeFilter(req.params.religiousCharacter, req.session.data.filters.religiousCharacter)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeFilterOfstedRating = (req, res) => {
  req.session.data.filters.ofstedRating = filterHelper.removeFilter(req.params.ofstedRating, req.session.data.filters.ofstedRating)
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.removeAllFilters = (req, res) => {
  delete req.session.data.filters
  res.redirect(`/organisations/${req.params.organisationId}/placements/find/results`)
}

exports.show = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let placement = placementModel.findOne({
    placementId: req.params.placementId
  })

  // add details of the school to the placement
  placement = placementDecorator.decorate(placement)

  // TODO append filter data to back link???

  res.render('../views/placements/find/show', {
    organisation,
    placement,
    actions: {
      back: `/organisations/${req.params.organisationId}/placements/find/results`
    }
  })
}
