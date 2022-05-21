/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('user_groups', function(table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.integer('group_id').notNullable();
        table.boolean('owner').notNullable();
        table.boolean('maintainer').notNullable();
        table.boolean('reviewer').notNullable();
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
    return knex.schema.dropTable('user_groups');
}