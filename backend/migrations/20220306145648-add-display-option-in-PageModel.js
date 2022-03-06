module.exports = {
  async up(db, client) {
    await db.collection('pages').updateMany({}, {$set: {display: true}});
  },

  async down(db, client) {
    await db.collection('pages').updateMany({}, {$unset: {display: null}});
  }
};
