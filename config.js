var DEFAULT_MONGO_URI = 'mongodb://localhost/shepherd_development';
var DEFAULT_MONGO_CONFIG = { w: 1, j: 1 };
var DEFAULT_AMQP_URI = 'amqp://localhost';

function env(name, allowEmpty) {
  if (!process.env[name] && !allowEmpty) {
    console.error(
      'Invalid setup missing environment variable "%s"',
      name
    );
  }
  return process.env[name];
}

var configurations = {
  mongodb: function() {
    return {
      uri: env('MONGOLAB_URI', true) || DEFAULT_MONGO_URI,
      config: DEFAULT_MONGO_CONFIG
    };
  },

  amqp: function() {
    return { uri: env('CLOUDAMQP_URL', true) || DEFAULT_AMQP_URI };
  },

  github: function() {
    return {
      token: env('GITHUB_TOKEN'),
      repo: env('GITHUB_REPO', true),
      user: env('GITHUB_USER', true)
    };
  },

  bugzilla: function() {
    return {
      username: env('BUGZILLA_USERNAME'),
      password: env('BUGZILLA_PASSWORD'),
      url: env('BUGZILLA_URL')
    };
  }
};


function config(type) {
  return configurations[type]();
}

module.exports = config;
