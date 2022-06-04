const { gray } = require("chalk");
const chalk = require("chalk");

const printEpisode = (episode) => {
  const { title, link, currentEpisode, totalEpisodes, status } = episode;
  const { cyan, green, yellow } = chalk; 
  console.log(`
    ${cya("Title")}: ${green(title)}
    ${cyan("Episodes")}: ${yellow(totalEpisodes)}
    ${cyan("Current Episode")}: ${currentEpisode}
    ${cyan("Link")}: ${gray(link)}
    ${cyan(status)}: ${status}`
  )
};

module.exports = printEpisode;
