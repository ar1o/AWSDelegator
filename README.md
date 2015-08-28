
## Introduction
AWSDelegator provides real-time automated management capabilities to Amazon Web Services,
as well as monitoring capabilities for AWS credits.  AWS Delegator allows account administrators
to assign individual users, collaborative groups, and students in a class, budgeted cloud resources.
     
AWSDelegator uses AWS Programmatic Billing Access to maintain knowledge of user and groups and
their usage of EC2 and RDS instances, as well as their cost. Budgets can either be cost budgets
with a dollar value for a user/group and an expiration, or time budgets, where rates of
consumption are based upon usage of associated resources to the user/group.


[Toward a Solution for the Cloud Account Delegation Problem](http://www.mikesmit.com/wp-content/papercite-data/pdf/casconett2014.pdf)

## Capabilities

*    Over and Under profile budgeting (See graduated resource limitation system, GRLS)
*    AWS credit accounting and estimates
*    Amazon Free Tier cost accounting
*    Automatic shutdown of instances that exceed their budget
*    Cost quota system budgeting (See quota system)
*    Real time RDS and EC2 metrics

## AWS Console Configuration
####   S3 Bucket
          1.   Log into AWS console with full privileges.
          2.   Under ‘Storage & Content Deliver’, select S3.
          3.   Select ‘Create Bucket’, and create a bucket in your primary region with a unique name.
          4.   Create the bucket.
          5.   Select drop-down menu from top right with text ‘username’ @ ‘account’, and select ‘My Account’.
          6.   Select ‘Preferences’ from the links on the left side.
          7.   Type in the Bucket name, and select sample policy on the page. Copy all of the text from
               the modal pop-up
          8.   Go back to S3, and select your bucket
          9.   Select Properties, and from the sliding side menu, select Permission
          10.  Select ‘Edit bucket policy’, and past in the copied text to the field. Save.
####   Billing
          1.   Select drop-down menu from top right with text ‘username’ @ ‘account’, and select ‘My Account’.
          2.   Select ‘Preferences’ from the links on the left side.
          3.   Type in the bucket name in the field labeled ‘Save to S3 Bucket:’, and click Verify.
               A green checkmark should appear. If validation fails, go back to your bucket policy to
               verify that the proper policy was added.
          4.   Under ‘Report’ make sure ‘Detailed billing report with resources and tags’ is selected.
               Save Preferences.
          5.   It will take up to 24 hours for your first billing document to be saved to the selected bucket.

## Server Setup
####Credentials
In Unix/OSX create folder named .aws in your root folder

For windows, create a folder named .aws in your default user folder. For example:  

     C:\Users\username\.aws

Within this folder, create a file named credentials with the following saved to it:

     [default]
     aws_access_key_id = “access key id here”
     aws_secret_access_key = “secret access key here”

#### Config.js
Open AWSDelegator/src/server/config.js and set the following four values:
     
*    awsAccountNumber
*    databaseUrl
*    s3Bucket
*    s3Region
     
Optionally, credits, creditExp, and creditsUsed can be configured if you are using AWS credits.

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
     4. node setup.js

 Every time you dev run these:
 
     1. $ mongod 
     2. $ grunt watch
     3. $ node app.js
     5. go to http://localhost:3000

