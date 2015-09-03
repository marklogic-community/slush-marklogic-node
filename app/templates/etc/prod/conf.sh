
# Define overrides for init script defaults here, defaults shown in comments..

# name of the project
#NAME=${0##*/}

# location of your project's root
# SOURCE_DIR=/space/projects/$NAME.live

# js entry point
#SOURCE_FILE=boot.js

# server script to be launched
#SERVER_SCRIPT=./node-server/node-app.js

# port at which node server should be listening
#APP_PORT=9040
APP_PORT=80

# Node environment.  This should be 'build' for distribution or 'dev' for iterative development
NODE_ENV=build

# MarkLogic host to which node server should proxy
#ML_HOST=localhost

# MarkLogic port to which node server should proxy
#ML_PORT=8040
ML_PORT=8040
