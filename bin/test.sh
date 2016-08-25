#!/usr/bin/env bash

IS_TESTING_LOCALLY=false

function basicSetup {
  export NODE_ENV=production
  if [ -d ./tests/configuration ]; then
    # Remove the old configuration
    rm -rf ./tests/configuration
  fi
  mkdir ./tests/configuration
}

function basicTeardown {
  unset NODE_ENV
  rm -rf ./tests/configuration
}

function trustedSetup {
  export GCLOUD_PROJECT=`cat ./tests/configuration/stub_project_id.txt`
  export STUBBED_API_KEY=`cat ./tests/configuration/stub_api_key.txt`
  export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/tests/configuration/stub_default_credentials.json
}

function trustedTeardown {
  unset GCLOUD_PROJECT
  unset STUBBED_API_KEY
  unset GOOGLE_APPLICATION_CREDENTIALS
}

function decryptAcceptanceCredentials {
  openssl aes-256-cbc -K $encrypted_7e22a7c28f69_key \
  -iv $encrypted_7e22a7c28f69_iv -in config.tar.enc \
  -out ./tests/configuration/config.tar -d \
  && tar xvf ./tests/configuration/config.tar
}

function runFullSuite {
  $(npm bin)/istanbul cover -x "fuzzer.js" \
  $(npm bin)/tape ./tests/integration/*.js ./tests/unit/*.js \
  ./tests/fixtures/*.js \
  --report lcovonly -- -R spec && cat ./coverage/lcov.info \
  | $(npm bin)/coveralls && rm -rf ./coverage
}

function runUnitSuite {
  $(npm bin)/istanbul cover -x "fuzzer.js" \
  $(npm bin)/tape ./tests/unit/*.js --report lcovonly -- \
  -R spec && cat ./coverage/lcov.info \
  | $(npm bin)/coveralls && rm -rf ./coverage
}

function run {
  basicSetup
  if [ "$IS_TESTING_LOCALLY" = true ]
  then
    echo "Running integration and unit suites in local development mode"
    runFullSuite
  elif [ "$TRAVIS_TRUSTED_INTERNAL_MERGE" = "true" ]
  then
    echo "Running integration and unit suites in container mode"
    decryptAcceptanceCredentials
    trustedSetup
    runFullSuite
    trustedTeardown
  else
    echo "Running unit suite"
    runUnitSuite
  fi
  basicTeardown
}

while getopts "l" opt
do
  case $opt in
    l)
      IS_TESTING_LOCALLY=true
      ;;
  esac
done

run