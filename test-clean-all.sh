#!/bin/bash

## SLUSH DEFAULT ##

if [ -d slush-default ]; then
  cd slush-default
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-default
  sleep 10
fi

## SLUSH 3COLUMN ##

if [ -d slush-3column ]; then
  cd slush-3column
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-3column
  sleep 10
fi

## SLUSH DASHBOARD ##

if [ -d slush-dashboard ]; then
  cd slush-dashboard
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-dashboard
  sleep 10
fi

## SLUSH MAP ##

if [ -d slush-map ]; then
  cd slush-map
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-map
  sleep 10
fi

## SLUSH CARDS ##

if [ -d slush-cards ]; then
  cd slush-cards
  ./ml local wipe
  ./ml local restart
  cd ..
  rm -rf slush-cards
  sleep 10
fi

####

echo Done
