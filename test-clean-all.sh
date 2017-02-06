#!/bin/bash

HOST=ml9-ml1
USER=admin
PASS=admin

## SLUSH DEFAULT ##

if [ -d slush-default ]; then
  cd slush-default
  ./ml local wipe
  cd ..
  rm -rf slush-default
fi

## SLUSH 3COLUMN ##

if [ -d slush-3column ]; then
  cd slush-3column
  ./ml local wipe
  cd ..
  rm -rf slush-3column
fi

## SLUSH DASHBOARD ##

if [ -d slush-dashboard ]; then
  cd slush-dashboard
  ./ml local wipe
  cd ..
  rm -rf slush-dashboard
fi

## SLUSH MAP ##

if [ -d slush-map ]; then
  cd slush-map
  ./ml local wipe
  cd ..
  rm -rf slush-map
fi

## SLUSH CARDS ##

if [ -d slush-cards ]; then
  cd slush-cards
  ./ml local wipe
  cd ..
  rm -rf slush-cards
fi

./ml local restart
sleep 10

####

echo Done
