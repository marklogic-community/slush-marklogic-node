#!/bin/bash

HOST=ml9-ml1
USER=admin
PASS=admin

## WIPE ##

if [ -d slush-default ]; then
  cd slush-default
  ./ml local wipe
  cd ..
fi

if [ -d slush-3column ]; then
  cd slush-3column
  ./ml local wipe
  cd ..
fi

if [ -d slush-dashboard ]; then
  cd slush-dashboard
  ./ml local wipe
  cd ..
fi

if [ -d slush-map ]; then
  cd slush-map
  ./ml local wipe
  cd ..
fi

if [ -d slush-cards ]; then
  cd slush-cards
  ./ml local wipe
  cd ..
fi

## RESTART ##

if [ -d slush-default ]; then
  cd slush-default
  ./ml local restart
  sleep 10
  cd ..
elif [ -d slush-3column ]; then
  cd slush-3column
  ./ml local restart
  sleep 10
  cd ..
  rm -rf slush-3column
elif [ -d slush-dashboard ]; then
  cd slush-dashboard
  ./ml local restart
  sleep 10
  cd ..
  rm -rf slush-dashboard
elif [ -d slush-map ]; then
  cd slush-map
  ./ml local restart
  sleep 10
  cd ..
  rm -rf slush-map
elif [ -d slush-cards ]; then
  cd slush-cards
  ./ml local restart
  sleep 10
  cd ..
fi

## REMOVE ##

if [ -d slush-default ]; then
  rm -rf slush-default
fi

if [ -d slush-3column ]; then
  rm -rf slush-3column
fi

if [ -d slush-dashboard ]; then
  rm -rf slush-dashboard
fi

if [ -d slush-map ]; then
  rm -rf slush-map
fi

if [ -d slush-cards ]; then
  rm -rf slush-cards
fi

####

echo Done
