const userModel = require('../../models/users')
const organisationModel = require('../../models/organisations')
const validationHelper = require('../../helpers/validators')

/// ------------------------------------------------------------------------ ///
/// SHOW USER
/// ------------------------------------------------------------------------ ///

exports.user_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const users = userModel.findMany({ organisationId: req.params.organisationId })

  users.sort((a, b) => {
    return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName)
  })

  delete req.session.data.user

  res.render('../views/support/users/list', {
    organisation,
    users,
    actions: {
      new: `/support/organisations/${req.params.organisationId}/users/new`,
      view: `/support/organisations/${req.params.organisationId}/users`,
      back: `/support/organisations/${req.params.organisationId}`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW USER
/// ------------------------------------------------------------------------ ///

exports.user_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const user = userModel.findOne({ userId: req.params.userId })

  const signedInUser = userModel.findOne({ userId: req.session.passport.user.id })

  res.render('../views/support/users/details', {
    organisation,
    user,
    signedInUser,
    actions: {
      change: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/edit?referrer=change`,
      delete: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/delete`,
      back: `/support/organisations/${req.params.organisationId}/users`,
      cancel: `/support/organisations/${req.params.organisationId}/users`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// NEW USER
/// ------------------------------------------------------------------------ ///

exports.new_user_get = (req, res) => {
  let back = `/support/organisations/${req.params.organisationId}/users`
  if (req.query.referrer === 'check') {
    back = `/support/organisations/${req.params.organisationId}/users/new/check`
  }

  res.render('../views/support/users/edit', {
    user: req.session.data.user,
    actions: {
      save: `/support/organisations/${req.params.organisationId}/users/new`,
      back,
      cancel: `/support/organisations/${req.params.organisationId}/users`
    }
  })
}

exports.new_user_post = (req, res) => {
  const errors = []

  if (!req.session.data.user.firstName.length) {
    const error = {}
    error.fieldName = 'firstName'
    error.href = '#firstName'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.user.lastName.length) {
    const error = {}
    error.fieldName = 'lastName'
    error.href = '#lastName'
    error.text = 'Enter a last name'
    errors.push(error)
  }

  const user = userModel.findOne({
    organisationId: req.params.organisationId,
    email: req.session.data.user.email
  })

  if (!req.session.data.user.email.length) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  } else if (!validationHelper.isValidEmail(req.session.data.user.email)) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address in the correct format, like name@example.com'
    errors.push(error)
  } else if (user) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Email address already in use'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/support/users/edit', {
      user: req.session.data.user,
      actions: {
        save: `/support/organisations/${req.params.organisationId}/users/new`,
        back: `/support/organisations/${req.params.organisationId}/users`,
        cancel: `/support/organisations/${req.params.organisationId}/users`
      },
      errors
    })
  } else {
    res.redirect(`/support/organisations/${req.params.organisationId}/users/new/check`)
  }
}

exports.new_user_check_get = (req, res) => {
  res.render('../views/support/users/check-your-answers', {
    user: req.session.data.user,
    actions: {
      save: `/support/organisations/${req.params.organisationId}/users/new/check`,
      back: `/support/organisations/${req.params.organisationId}/users/new`,
      change: `/support/organisations/${req.params.organisationId}/users/new?referrer=check`,
      cancel: `/support/organisations/${req.params.organisationId}/users`
    }
  })
}

exports.new_user_check_post = (req, res) => {
  userModel.saveOne({
    organisationId: req.params.organisationId,
    user: req.session.data.user
  })

  delete req.session.data.user

  req.flash('success', 'User added')
  res.redirect(`/support/organisations/${req.params.organisationId}/users`)
}

/// ------------------------------------------------------------------------ ///
/// EDIT USER
/// ------------------------------------------------------------------------ ///

exports.edit_user_get = (req, res) => {
  const currentUser = userModel.findOne({ organisationId: req.params.organisationId, userId: req.params.userId })

  if (req.session.data.user) {
    user = req.session.data.user
  } else {
    user = currentUser
  }

  res.render('../views/support/users/edit', {
    currentUser,
    user,
    actions: {
      save: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/edit`,
      back: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}`,
      cancel: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}`
    }
  })
}

exports.edit_user_post = (req, res) => {
  const errors = []

  if (!req.session.data.user.firstName.length) {
    const error = {}
    error.fieldName = 'firstName'
    error.href = '#firstName'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.user.lastName.length) {
    const error = {}
    error.fieldName = 'lastName'
    error.href = '#lastName'
    error.text = 'Enter a last name'
    errors.push(error)
  }

  if (!validationHelper.isValidEmail(req.session.data.user.email)) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/support/users/edit', {
      user: req.session.data.user,
      actions: {
        save: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/edit`,
        back: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}`,
        cancel: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}`
      },
      errors
    })
  } else {
    // userModel.saveOne({
    //   organisationId: req.params.organisationId,
    //   userId: req.params.userId,
    //   user: req.session.data.user
    // })
    //
    // req.flash('success', 'User updated')
    res.redirect(`/support/organisations/${req.params.organisationId}/users/${req.params.userId}/edit/check`)
  }
}

exports.edit_user_check_get = (req, res) => {
  const currentUser = userModel.findOne({ organisationId: req.params.organisationId, userId: req.params.userId })

  res.render('../views/support/users/check-your-answers', {
    currentUser,
    user: req.session.data.user,
    referrer: 'change',
    actions: {
      save: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/edit/check`,
      back: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/edit`,
      change: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/edit?referrer=change`,
      cancel: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}`
    }
  })
}

exports.edit_user_check_post = (req, res) => {
  userModel.saveOne({
    organisationId: req.params.organisationId,
    userId: req.params.userId,
    user: req.session.data.user
  })

  delete req.session.data.user

  req.flash('success', 'User updated')
  res.redirect(`/support/organisations/${req.params.organisationId}/users/${req.params.userId}`)
}

/// ------------------------------------------------------------------------ ///
/// DELETE USER
/// ------------------------------------------------------------------------ ///

exports.delete_user_get = (req, res) => {
  const user = userModel.findOne({ organisationId: req.params.organisationId, userId: req.params.userId })

  res.render('../views/support/users/delete', {
    user,
    actions: {
      save: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}/delete`,
      back: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}`,
      cancel: `/support/organisations/${req.params.organisationId}/users/${req.params.userId}`
    }
  })
}

exports.delete_user_post = (req, res) => {
  userModel.deleteOne({
    organisationId: req.params.organisationId,
    userId: req.params.userId
  })

  req.flash('success', 'User removed')
  res.redirect(`/support/organisations/${req.params.organisationId}/users`)
}
