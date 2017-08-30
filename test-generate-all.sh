#!/bin/bash

HOST=ml9-ml1
USER=admin
PASS=admin

## SLUSH DEFAULT ##

if [ -d slush-default ]; then
  cd slush-default
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-default
fi

gulp --gulpfile=slushfile.js --app-name=slush-default --theme=default --ml-version=8 --ml-host=$HOST --ml-admin-user=$USER --ml-admin-pass=$PASS ---ml-http-port=8040 --node-port=8050 --guest-access=true --disallow-updates=true --appusers-only=true

cd slush-default

gulp build

./ml local install local mlcp -options_file import-sample-data.options

cd ..

## SLUSH 3COLUMN ##

if [ -d slush-3column ]; then
  cd slush-3column
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-3column
fi

gulp --gulpfile=slushfile.js --app-name=slush-3column --theme=3column --ml-version=8 --ml-host=$HOST --ml-admin-user=$USER --ml-admin-pass=$PASS ---ml-http-port=8041 --node-port=8051 --guest-access=true --disallow-updates=true --appusers-only=true

cd slush-3column

gulp build

./ml local install local mlcp -options_file import-sample-data.options

cd ..

## SLUSH DASHBOARD ##

if [ -d slush-dashboard ]; then
  cd slush-dashboard
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-dashboard
fi

gulp --gulpfile=slushfile.js --app-name=slush-dashboard --theme=dashboard --ml-version=8 --ml-host=$HOST --ml-admin-user=$USER --ml-admin-pass=$PASS ---ml-http-port=8042 --node-port=8052 --guest-access=true --disallow-updates=true --appusers-only=true

cd slush-dashboard

gulp build

./ml local install local mlcp -options_file import-sample-data.options

cd ..

## SLUSH MAP ##

if [ -d slush-map ]; then
  cd slush-map
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-map
fi

gulp --gulpfile=slushfile.js --app-name=slush-map --theme=map --ml-version=8 --ml-host=$HOST --ml-admin-user=$USER --ml-admin-pass=$PASS ---ml-http-port=8043 --node-port=8053 --guest-access=true --disallow-updates=true --appusers-only=true

cd slush-map

gulp build

./ml local install local mlcp -options_file import-sample-data.options

cd ..

## SLUSH CARDS ##

if [ -d slush-cards ]; then
  cd slush-cards
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-cards
fi

gulp --gulpfile=slushfile.js --app-name=slush-cards --theme=cards --ml-version=8 --ml-host=$HOST --ml-admin-user=$USER --ml-admin-pass=$PASS ---ml-http-port=8044 --node-port=8054 --guest-access=true --disallow-updates=true --appusers-only=true

cd slush-cards

gulp build

./ml local install local mlcp -options_file import-sample-data.options

cd ..

####

echo Done
