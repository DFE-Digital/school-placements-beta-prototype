const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

const giasHelper = require('./helpers/gias')

/* ------------------------------------------------------------------
utility function to get an error for a component
example: {{ errors | getErrorMessage('title') }}
outputs: "Enter a title"
------------------------------------------------------------------ */
addFilter('getErrorMessage', (array, fieldName) => {
  if (!array || !fieldName) {
    return null
  }

  const error = array.filter((obj) =>
    obj.fieldName === fieldName
  )[0]

  return error
})

/* ------------------------------------------------------------------
GIAS utility functions
------------------------------------------------------------------ */
addFilter('getEstablishmentTypeLabel', giasHelper.getEstablishmentTypeLabel)

addFilter('getEstablishmentGroupLabel', giasHelper.getEstablishmentGroupLabel)

addFilter('getEstablishmentStatusLabel', giasHelper.getEstablishmentStatusLabel)

addFilter('getEstablishmentPhaseLabel', giasHelper.getEstablishmentPhaseLabel)

addFilter('getGenderLabel', giasHelper.getGenderLabel)

addFilter('getOfficialSixthFormLabel', giasHelper.getOfficialSixthFormLabel)

addFilter('getNurseryProvisionLabel', giasHelper.getNurseryProvisionLabel)

addFilter('getReligiousCharacterLabel', giasHelper.getReligiousCharacterLabel)

addFilter('getAdmissionsPolicyLabel', giasHelper.getAdmissionsPolicyLabel)

addFilter('getSpecialClassesLabel', giasHelper.getSpecialClassesLabel)

addFilter('getUrbanRuralLabel', giasHelper.getUrbanRuralLabel)

addFilter('getOfstedRatingLabel', giasHelper.getOfstedRatingLabel)

addFilter('getSENDProvisionLabel', giasHelper.getSENDProvisionLabel)
