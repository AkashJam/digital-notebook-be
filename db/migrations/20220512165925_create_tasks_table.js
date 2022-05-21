/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table) {
        table.increments();
        table.string('description').notNullable();
        table.datetime('datetime');
        table.string('location');
        table.boolean('notify').notNullable().defaultTo(false);
        table.boolean('completed').notNullable().defaultTo(false);
        table.boolean('archived').notNullable().defaultTo(false);
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
    return knex.schema.dropTable('tasks');
};
