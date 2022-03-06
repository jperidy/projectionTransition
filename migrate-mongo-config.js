const { getDatabaseUri } = require('./backend/config/db');
const config = require('./config/config.json');


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
