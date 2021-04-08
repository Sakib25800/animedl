const genTableValues = (watchlist) => {
  return Object.entries(watchlist).map(([key, value]) => {
    return {
      Title: key,
      Episodes: `${value.currentEpisode}/${value.totalEpisodes}`,
      Status: value.status,
    };
  });
};

module.exports = genTableValues;
