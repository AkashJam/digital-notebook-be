# digital-notebook-be
Digital Notebook's server side code

Create knexfile.js
./node_modules/.bin/knex init

Create a migration
npx knex migrate:make migration_name

Run migrations
npx knex migrate:latest

Rollback
npx knex migrate:rollback