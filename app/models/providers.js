exports.findMany = (params) => {
  let providers = require('../data/providers/providers.json')

  if (params.query?.length) {
    const query = params.query.toLowerCase()
    return providers.filter(provider =>
      provider.name.toLowerCase().includes(query)
      || provider.ukprn?.toString().includes(query)
      || provider.urn?.toString().includes(query)
      || provider.address?.postcode?.toLowerCase().includes(query)
     )
  }

  return providers
}
