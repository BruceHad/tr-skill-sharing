Live Reload
-----------

Use nodemon to reload the application on change.

    npm install --save-dev nodemon
    
Installed locally, it can be run from within an NPM script like npm start. So add a script for dev.

    "dev": "nodemon ./bin/www"

Then run:

    npm run dev

