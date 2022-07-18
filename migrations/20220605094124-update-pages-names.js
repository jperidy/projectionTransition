export const up = async (db) => {
  // TODO write your migration here.
  // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  const pages = await db.collection('pages').find({}).toArray();

    const pagesActions = pages.map((page) => db.collection('pages').updateOne(
          { _id: page._id },
          { $set: { name: '/pages/' + page.name } }
    ));

    const navs = await db.collection('navs').find({ name: 'nav' }).toArray();
    navs[0].TITLE.forEach((title) => title.url = '/pages' + title.url);
    const navsActions = db.collection('navs').updateOne(
      { _id: navs[0]._id},
      { $set: { TITLE: navs[0].TITLE } }
    );

    const footers = await db.collection('footers').find({ name: 'footer' }).toArray();
    footers[0].TITLE.forEach((title) => title.url = '/pages' + title.url);
    const footersActions = db.collection('footers').updateOne(
      { _id: footers[0]._id},
      { $set: { TITLE: footers[0].TITLE } }
    );


    await Promise.all(pagesActions, navsActions, footersActions);
};

export const down = async (db) => {
  // TODO write the statements to rollback your migration (if possible)
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  const pages = await db.collection('pages').find({}).toArray();

    const pagesActions = pages.map((page) => db.collection('pages').updateOne(
          { _id: page._id },
          { $set: { name: page.name.split('/pages/')[1] } }
    ));

    const navs = await db.collection('navs').find({ name: 'nav' }).toArray();
    navs[0].TITLE.forEach((title) => title.url = title.url.split('/pages')[1]);
    const navsActions = db.collection('navs').updateOne(
      { _id: navs[0]._id},
      { $set: { TITLE: navs[0].TITLE } }
    );

    const footers = await db.collection('footers').find({ name: 'footer' }).toArray();
    footers[0].TITLE.forEach((title) => title.url = title.url.split('/pages')[1]);
    const footersActions = db.collection('footers').updateOne(
      { _id: footers[0]._id},
      { $set: { TITLE: footers[0].TITLE } }
    );
    
    return Promise.all(pagesActions, navsActions, footersActions);
};
