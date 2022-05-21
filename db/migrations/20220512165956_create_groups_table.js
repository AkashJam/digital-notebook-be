/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('groups', function(table) {
        table.increments();
        table.string('name').notNullable();
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
    return knex.schema.dropTable('groups');
};