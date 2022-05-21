/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('display_name');
        table.decimal('range').notNullable().defaultTo(0.75);;
        table.boolean('active').notNullable().defaultTo(true);
        table.datetime('created_on').notNullable().defaultTo(knex.fn.now());
        table.datetime('modified_on');
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};