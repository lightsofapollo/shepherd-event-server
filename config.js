function env(name, allowEmpty) {
  if (!process.env[name] && !allowEmpty) {
    console.error(
      'Invalid setup missing environment variable "%s"',
      name
    );
  }
  return process.env[name];
}


function config() {
  // build test configuration from environment variables
  return {
    github: {
      token: env('GITHUB_TOKEN'),
      repo: env('GITHUB_REPO', true),
      user: env('GITHUB_USER', true)
    },
    bugzilla: {
      username: env('BUGZILLA_USERNAME'),
      password: env('BUGZILLA_PASSWORD'),
      url: env('BUGZILLA_URL')
    }
  };
}

module.exports = config;
