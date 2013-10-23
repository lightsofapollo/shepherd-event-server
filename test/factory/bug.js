function factory(overrides) {
  // these fields are required.
  var result = {
    product: 'Testing',
    component: 'Marionette',
    summary: 'I am able to create bugz!',
    version: 'unspecified',
    platform: 'All',
    priority: 'P1',
    op_sys: 'All'
  };

  for (var key in overrides) {
    result[key] = overrides[key]
  }

  return result;
}

module.exports = factory;
