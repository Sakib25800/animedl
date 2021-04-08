#! /usr/bin/env node
const { program } = require("commander");
const chalk = require("chalk");
const { searchAction, watchlistAction, dlAction } = require("./utils/actions");

program.version("1.0.0");

program
  .command("search")
  .arguments("<query>")
  .description("search for animes")
  .action((query) => {
    searchAction(query);
  });

program
  .command("watchlist")
  .option("-l, --list", "list all the animes you're currently watching")
  .option("-n, --newTitle <title>", "add a new anime to your watchlist")
  .option("-r, --remove", "remove an anime from your watchlist")
  .description("track any anime that you watch")
  .action(async (name, options) => {
    const { list, newTitle, remove } = options._optionValues;
    if (list || newTitle || remove) watchlistAction(options, program);
    else console.log(program.help());
  });

program
  .command("dl <anime_name>")
  .option("-o, --output", "destination of outputted file")
  .description("download an anime")
  .action((name, options) => {
    dlAction(name, options?.output);
  });

program
  .name("animedl")
  .usage(
    `[OPTIONS] COMMAND [ARGS]\n\n${chalk.red(
      "Anime downloader and watchlist tracker"
    )}`
  );

program.parse(process.argv);