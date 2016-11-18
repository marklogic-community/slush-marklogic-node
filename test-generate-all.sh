#!/bin/bash

## SLUSH DEFAULT ##

if [ -d slush-default ]; then
  cd slush-default
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-default
fi

gulp --gulpfile=slushfile.js --app-name=slush-default --theme=default --ml-version=8 --ml-host=ml8-ml1 --ml-admin-user=admin --ml-admin-pass=admin ---ml-http-port=8040 --node-port=8050 --guest-access=true --disallow-updates=true --appusers-only=true

cd slush-default

gulp build

./ml local bootstrap local deploy modules local deploy content local mlcp -options_file import-sample-data.options

cd ..

####

echo Done
