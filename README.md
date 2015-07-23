AWSDelegator
=============
[Toward a Solution for the Cloud Account Delegation Problem](http://www.mikesmit.com/wp-content/papercite-data/pdf/casconett2014.pdf)

## Features


## Code Layout
     src/
     | -- setup.js (initial run to setup the application)
     | -- app.js (main file)
     | -- public/ (Backbone/Handlebars, LESS)
          | -- css/
          | -- js/ (contains helper functions)
          | -- model/ 
          | -- templates/ (contains handlebars templates)
          | -- view/
     | -- server/ (Nodejs, Expressjs, Mongo/Mongoose)
          | -- config.js (contains configuration items for setting up the server)
          | -- model/ (Mongoose schemas)
          | -- parse/ (processes AWS related data)
          | -- route/ (reads and routes processed information to various endpoints)


## Getting Started
 
 The first time you dev run these:
    
     1. install nodejs
     2. npm install
     3. npm install grunt-cli -g

 Every time you dev run these:
 
     1. $ mongod 
     2. $ grunt watch
     3. $ node app.js
     5. go to http://localhost:3000

By:
Deepak Mahendrakar - https://github.com/dpkm95
Karl Simon - https://github.com/Ulric19
Ario Khoshzamir - https://github.com/ar1o
