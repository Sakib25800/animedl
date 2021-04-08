const { SITE_URL, SEARCH_URL } = require("./constants");

const collectSearchResults = ($) => {
  let searchResults = [];
  $(".items .img").each(function (ind, element) {
    const title = $(this).find("a").attr("title");
    const poster = $(this).find("img").attr("src");
    let url = `${SITE_URL}${$(this).find("a").attr("href")}`;
    searchResults.push({ title, url, poster });
  });
  return searchResults;
};

const collectEpisodes = ($) => {
  let episodes = [];
  $("#episode_related a").each(function (ind, element) {
    const episodeNum = $(this).find(".name").text().replace("EP ", "");
    let url = $(this).attr("href").trim();
    url = `${SITE_URL}${url}`;
    episodes.push(url);
  });
  return episodes.reverse();
};

module.exports = { collectSearchResults, collectEpisodes };
