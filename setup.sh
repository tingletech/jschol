#!/usr/bin/env bash

# If an error occurs, stop this script
set -e

if [[ `/bin/hostname` == pub-submit* ]]; then
  printf "\n== Getting ready for an older version of ruby ==\n"
  rm Gemfile.lock
  echo "gem 'ezid-client'" >> Gemfile
fi

printf "== Installing local Ruby gems ==\n"
bundle install --quiet --path=gems --binstubs

#printf "\n== Uninstalling Ruby gems no longer used ==\n"
bundle clean

printf "\n== Installing node packages (used by gulp and iso via Node) ==\n"
npm install
npm install gulp-cli # shouldn't be necessary, but seems to be

if [[ `/bin/hostname` == pub-submit* ]]; then
  printf "\n== Building splash page generator ==\n"
  cd splash
  ./setupSplash.sh
  cd ..
fi

# test the convert
./tools/convert.rb 2>&1 | grep "Usage:" -q && echo 'convert.rb libraries look good'
