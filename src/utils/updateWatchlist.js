const db = `${process.env.HOME}/code/js/animedl/src/db.json`;
const jsonfile = require("jsonfile");

const updateWatchlist = (anime, title) => {
  const data = jsonfile.readFileSync(db);
  const exists = data?.title;
  if (exists)
    exists.status =
      exists.currentEpisode == exists.totalEpisodes ? "Finished" : "Watching";
  data.watchlist[title] = anime;
  jsonfile.writeFileSync(db, data);
};

module.exports = updateWatchlist;
