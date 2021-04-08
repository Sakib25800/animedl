const puppeteer = require("puppeteer");
const request = require("superagent");
const cheerio = require("cheerio");
const { SITE_URL, SEARCH_URL, API_URL } = require("./constants");
const { collectSearchResults, collectEpisodes } = require("./utils");
const chalk = require("chalk");
const ora = require("ora");
const spinner = ora({ isSilent: false });

/**
 * @param  {string} query
 * @returns {Promise<SearchResults[]>}  searchResults
 */
const search = async (query) => {
  try {
    spinner.start(chalk.blueBright("Searching..."));
    const { text } = await request.get(SEARCH_URL).query({ keyword: query });
    const $ = cheerio.load(text);
    spinner.succeed(chalk.green("Search complete"));
    return collectSearchResults($);
  } catch (error) {
    return null;
  }
};

/**
 * @param  {string} animeUrl
 * @returns {object} title + episodes
 */
const getEpisodes = async (animeUrl) => {
  spinner.start(chalk.blueBright("Retrieving episodes"));
  const { text } = await request.get(animeUrl);
  let $ = cheerio.load(text);
  const title = $("h1").text();
  const id = $("#movie_id").first().attr("value");
  const [, alias] = animeUrl.match(/category\/(.*)$/);
  const params = {
    ep_start: 0,
    ep_end: 1000,
    id,
    default_ep: 0,
    alias,
  };
  const episodePage = await request.get(API_URL).query(params);
  $ = cheerio.load(episodePage.text);
  const episodes = collectEpisodes($);
  spinner.succeed(chalk.green("Retrieved episodes"));
  return { title, episodes };
};

/**
 * @param  {string} episodeUrl
 * @returns {string} episodeLink
 */
const getLink = async (episodeUrl) => {
  spinner.start(chalk.blueBright("Retrieving link..."));
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(episodeUrl); // episode stream page
    await page.waitForSelector(".dowloads a ", { visible: true });
    const downloadsLink = await page.$eval(".dowloads a", (el) =>
      el.getAttribute("href")
    );

    await page.goto(downloadsLink); // episode downloads links page
    await page.waitForSelector(".dowload a", { visible: true });

    const episodeLink = await page.$eval(".dowload a", (el) =>
      el.getAttribute("href")
    );

    await browser.close();
    spinner.succeed();
    return episodeLink;
  } catch (err) {
    spinner.fail();
    return null;
  }
};

module.exports = { search, getEpisodes, getLink };
