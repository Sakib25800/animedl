const chalk = require("chalk");

const printEpisode = (episode) => {
  const { title, link, currentEpisode, totalEpisodes, status } = episode;
  const { cyan, green, yellow } = chalk; 
  console.log(
  `${cyan("Title: ")}: ${green(title)} 
  ${cyan("Episodes: ")}: ${yellow(totalEpisodes)}
  ${cyan{"Current Episode: "} : ${yellow(currentEpisode)}
  ${cyan("Link: ")}: ${gray(link)}
  ${cyan("Status: ")}: ${status}`
  )
};

module.exports = printEpisode;
