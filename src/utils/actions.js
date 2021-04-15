const { printTable } = require("console-table-printer");
const readline = require("readline");
const { spawn } = require("child_process");
const chalk = require("chalk");
const jsonfile = require("jsonfile");
const inquirer = require("inquirer");
const genTableValues = require("./genTableValues");
const download = require("./download");
const { search, getEpisodes, getLink } = require("../gogo-anime");
const {
  searchList,
  watchlist,
  currentEpisodeList,
  episodesList,
} = require("./lists");
const printEpisode = require("./printEpisode");
const updateWatchlist = require("./updateWatchlist");

const db = `${process.env.HOME}/code/js/animedl/src/db.json`;
const downloadReg = /download \d+$/;
const selectEpisodesReg = /download \d+(:\d+)$/;
const setEpisodeReg = /set current_episode=\d+$/;
const digitReg = /^\D+/g;

const searchAction = async (query) => {
  console.log(chalk.green(`Search results for '${query}'`));
  (await search(query)).forEach((result) => {
    console.log(" " + result.title);
  });
};

const watchlistAction = async (options, program) => {
  const { list, newTitle, remove } = options._optionValues;
  const data = jsonfile.readFileSync(db);

  if (list) {
    printTable(genTableValues(data.watchlist));
    const { title } = await inquirer.prompt(watchlist(data.watchlist, "Select an anime")); // prettier-ignore
    let anime = data.watchlist[title];
    const episodes = (await getEpisodes(anime.link)).episodes;
    const commandQuestion = {
      name: "command",
      message: "Available commands: set, update, download \nPress q to exit [q]: ",
    };

    process.stdout.write("\x1Bc");
    printEpisode({ ...anime, title });
    let { command } = await inquirer.prompt(commandQuestion);
    while (command != "q") {
      process.stdout.write("\x1Bc");
      printEpisode({ ...anime, title });
      const downloadCom = command.match(downloadReg);
      const selectEpisodesCom = command.match(selectEpisodesReg);
      const setEpisodeCom = command.match(setEpisodeReg);

      if (downloadCom) {
        const amount = parseInt(downloadCom[0].split(" ")[1]);
        if (anime.currentEpisode + (amount-1) > anime.totalEpisodes) {
          console.log(chalk.red("Episodes out of range"));
          return;
        }
        for (let i = 0; i < amount; i++) {
          const anime = jsonfile.readFileSync(db).watchlist[title];
          const downloadName = `${title}-${anime.currentEpisode}.mp4`;
          await download(
            await getLink(episodes[anime.currentEpisode - 1]),
            downloadName,
            title
          );
          updateWatchlist(
            { ...anime, currentEpisode: anime.currentEpisode + 1 },
            title
          );
        }
      } else if (selectEpisodesCom) {
        let [
          fromStr,
          toStr,
          from = parseInt(fromStr),
          to = parseInt(toStr),
        ] = selectEpisodesCom.input.replace(digitReg, "").split(":");
        if (
          !(from > 0 && from < anime.totalEpisodes) ||
          !(to > 0 && to < anime.totalEpisodes)
        )
          console.log(chalk.red("Episodes out of range"));
        while (from <= to) {
          const episodeLink = await getLink(episodes[from - 1]);
          const downloadName = `${title}-episode-${from}.mp4`;
          download(episodeLink, downloadName, title);
          from++;
        }
      } else if (setEpisodeCom) {
        const newValue = setEpisodeCom.input.replace(digitReg, "");
        if (newValue > anime.totalEpisodes)
          console.log(chalk.red("Episodes out of range"));
        else {
          anime.currentEpisode = parseInt(newValue);
          updateWatchlist(anime, title);
          process.stdout.write("\x1Bc");
          printEpisode({ ...anime, title });
        }
      } else if (command === "update") {
        const episodes = await getEpisodes(anime.link);
        updateWatchlist({ ...anime, totalEpisodes: episodes.episodes.length}, title);
      }
      command = (await inquirer.prompt(commandQuestion)).command;
    }
  } else if (remove) {
    const { title } = await inquirer.prompt(watchlist(data.watchlist));
    delete data.watchlist[title];
    jsonfile.writeFileSync(db, data);
  } else if (newTitle) {
    const { title } = await inquirer.prompt(await searchList(newTitle, "What anime do you want to add?")); // prettier-ignore
    const animeSearchTitle = (await search(title))[0].url;
    const episodesObj = await getEpisodes(animeSearchTitle);
    const max = episodesObj.episodes.length;
    const { currentEpisode } = await inquirer.prompt(currentEpisodeList());
    if (currentEpisode > max) console.log(chalk.red(`There are only ${max} episodes in ${title}`)); // prettier-ignore
    updateWatchlist(
      {
        currentEpisode: parseInt(currentEpisode),
        totalEpisodes: episodesObj.episodes.length,
        status: "watching",
        link: animeSearchTitle,
      },
      title
    );
    console.log(chalk.green(`${title} has been added to your watchlist`));
  }
};

const dlAction = async (name, output) => {
  const { title } = await inquirer.prompt(await searchList(name));
  const animeSearchTitle = (await search(title))[0].url;
  const episodesObj = await getEpisodes(animeSearchTitle);
  const { episodeTitle } = await inquirer.prompt(
    await episodesList(episodesObj)
  );
  const episodeNum = episodeTitle.replace(digitReg, "");
  const episode = episodesObj.episodes[episodeNum - 1];
  const downloadName = `${title}-episode-${episodeNum}.mp4`;
  const link = await getLink(episode);
  download(link, downloadName, title, output ? output : undefined);
};

module.exports = { searchAction, watchlistAction, dlAction };
