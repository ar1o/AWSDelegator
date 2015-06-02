AWSDelegator
=============
[Toward a Solution for the Cloud Account Delegation Problem](http://www.mikesmit.com/wp-content/papercite-data/pdf/casconett2014.pdf)


## Code Layout
 
     css/        contains styling data
     js/         helper javascript files and boot.js which is what runs at startup
     lib/        contains backbone, handlebar, jquery, and underscore dependencies
     server/     contains server, CORS, Expressjs, and mongo/mongoose schema data
     model/      contains backbone models
     templates/  contains handlebars templates
     view/       contains backbone views
     

## Getting Started
 
 The first time you dev run these:
    
     1. install nodejs
     2. npm install
     3. npm install grunt-cli -g

 Every time you dev run these:
 
     1. $ mongod 
     2. $ grunt watch
     3. $ grunt connect
     4. $ grunt express
     5. go to http://localhost:4000 for client
     6. go to http://localhost:3000 for nodejs

