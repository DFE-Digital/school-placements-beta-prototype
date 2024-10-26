const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/dist/')

exports.update = (params) => {
  const settings = require('../data/dist/settings')

  if (params.settings.useLogin) {
    settings.useLogin = params.settings.useLogin
  }

  if (params.settings.pageSize) {
    settings.pageSize = params.settings.pageSize
  }

  const filePath = directoryPath + '/settings.json'

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(settings)

  // write the JSON data
  fs.writeFileSync(filePath, fileData)

  return settings
}
