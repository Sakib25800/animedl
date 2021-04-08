const { search } = require("../gogo-anime");
const chalk = require("chalk");

const searchList = async (
  query,
  message = "What anime do you want to add?"
) => {
  const searchResults = await search(query);
  return [
    {
      type: "list",
      name: "title",
      message: chalk.greenBright(message),
      choices: searchResults.map((result) => result.title),
    },
  ];
};

const currentEpisodeList = () => {
  return [
    {
      name: "currentEpisode",
      message: "What episode do you want to start from?",
      default: 1,
    },
  ];
};

const watchlist = (
  watchlist,
  message = "What anime do you want to select?"
) => {
  return [
    {
      type: "list",
      name: "title",
      message,
      choices: Object.keys(watchlist),
    },
  ];
};

const episodesList = async (episodesObj) => {
  return [
    {
      type: "list",
      name: "episodeTitle",
      message: "What episode do you want to download?",
      choices: episodesObj.episodes.map(
        (ep, i) => `${episodesObj.title}-episode ${i + 1}`
      ),
    },
  ];
};

module.exports = { searchList, currentEpisodeList, watchlist, episodesList };
