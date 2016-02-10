#!/bin/sh

sudo npm -g install bower
sudo npm -g install gulp
sudo npm -g install forever

cd ..
npm install
bower install
gulp build

cd /etc
sudo ln -s /space/projects/@sample-app-name.live/etc/prod @sample-app-name
cd /etc/init.d
sudo ln -s /space/projects/@sample-app-name.live/etc/init.d/node-express-service @sample-app-name
sudo chkconfig --add @sample-app-name
sudo chkconfig --levels 2345 @sample-app-name on
