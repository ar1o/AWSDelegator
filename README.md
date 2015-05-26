AWSDelegator
=============

## Code Layout
 
     css/        contains styling data
     js/         helper javascript files and boot.js which is what runs at startup
     lib/        contains backbone, handlebar, jquery, and underscore dependencies
     server/     contains server, CORS, and mongoose schema data
     model/      contains backbone models
     templates/  contains handlebars templates
     view/       contains backbone views
     

## Getting Started
 
 The first time you dev run these:
    
     1. install nodejs
     2. npm install
     3. npm install grunt-cli -g

 Every time you dev run these:
     
     1. $ grunt watch
     2. $ grunt connect
     3. $ grunt express
     4. go to http://localhost:4000
