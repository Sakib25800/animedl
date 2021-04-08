const chalk = require("chalk");

const printEpisode = (episode) => {
  const { title, link, currentEpisode, totalEpisodes, status } = episode;
  console.log(chalk.cyan("Title: ") + chalk.green(title));
  console.log(chalk.cyan("Episodes: ") + chalk.yellow(totalEpisodes));
  console.log(chalk.cyan("current_episode: ") + chalk.yellow(currentEpisode));
  console.log(chalk.cyan("Link: ") + chalk.gray(link));
  console.log(chalk.cyan("Status: ") + status);
};

module.exports = printEpisode;
