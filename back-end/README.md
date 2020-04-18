# Overview
This directory contains the backend server for the github connector project.
The backend is hosted on heroku at https://githubconnector.herokuapp.com/

# Local installation and deployment requirements
* From within the back-end directory, use `npm install` to download all of the dependences
* Download the heroku-cli: https://devcenter.heroku.com/articles/heroku-cli and follow the instructions for logging in.
* Install the heroku-pg-extras plugin: https://devcenter.heroku.com/articles/heroku-cli#useful-cli-plugins
* Install postgres and psql locally: https://devcenter.heroku.com/articles/heroku-postgresql#local-setup
** NOTE: Heroku is using postgres version 12.2

# Creating a local copy of the database
* Start your postgres server locally
* Follow the instructions here to sync the heroku database to your local machine: https://devcenter.heroku.com/articles/heroku-postgresql#pg-pull
* Then set up a .env file with information about your local db, and save it to the root of the backend directory: https://www.taniarascia.com/node-express-postgresql-heroku/#environment-variables

# Running the backend server locally
Type `npm run start:dev` to start the server locally on port 3000.
:dev uses nodemon to automatically restart the server when you make changes locally.

# Deploying to heroku
`git subtree push --prefix back-end heroku master`

# Scale heroku deployment down to take the app offline
`heroku ps:scale web=0`

# Useful references
* https://www.postgresql.org/docs/current/app-psql.html
* https://www.postgresqltutorial.com/postgresql-create-table/

psql show databases: `\d`
psql use database: `\c dbname`
psql show tables: `\dt`

Change a db column type:
```
ALTER TABLE <tablename> ALTER COLUMN <columnname> TYPE <newtype>;
```

Find out information about a table:
```
\d table_name
```
