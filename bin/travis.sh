#! /bin/bash -e

if [ "$TRAVIS_SECURE_ENV_VARS" ]
then
  make test
else
  echo "Cannot run tests on pull requests or without env vars"
fi
