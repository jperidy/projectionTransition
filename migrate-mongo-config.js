const { getDatabaseUri } = require('./backend/config/db');

module.exports = {
  mongodb: {
    url: getDatabaseUri(),

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "backend/migrations",

  changelogCollectionName: "changelog",

  migrationFileExtension: ".js",

  useFileHash: false
};
