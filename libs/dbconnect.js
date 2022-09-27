const knex = require("knex")({
    client: "better-sqlite3",
    connection: {
        filename: "./data/data.sqlite",
    },
});

module.exports = knex;
