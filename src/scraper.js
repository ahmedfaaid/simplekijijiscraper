const fetch = require("node-fetch");
const cheerio = require("cheerio");

const baseUrl = "https://www.kijiji.ca";
const searchUrl =
  "https://www.kijiji.ca/b-monitors/city-of-toronto/c782l1700273";
const monitorUrl = "https://www.kijiji.ca/v-monitors/city-of-toronto/";

function searchMonitors() {
  return fetch(searchUrl)
    .then(response => response.text())
    .then(body => {
      const monitors = [];
      const $ = cheerio.load(body);
      $(".search-item").each((i, element) => {
        const $element = $(element);
        const $image = $element.find(".search-item .left-col .image img");
        const $title = $element.find(".search-item .info .title a");
        const $price = $element.find(".search-item .info .price");
        const data = $title.attr("href").split("/"); // returns an array
        const id = data[4];
        const monitor = {
          image: $image.attr("src"),
          title: $title.text(),
          price: $price.text(),
          link: baseUrl + $title.attr("href"),
          id
        };
        monitors.push(monitor); //populate monitors array
      });
      return monitors;
    });
}

function getMonitor(id) {
  return fetch(`${monitorUrl}${id}`)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body);
      const images = [];
      $(".heroImageContainer-2545605810 img").each((i, element) => {
        const imageUrl = $(element).attr("src");
        images.push(imageUrl);
      });
      const $title = $(".mainColumn-1522885425 h1").text();
      const $price = $(
        ".mainColumn-1522885425 .priceContainer-2538502416"
      ).text();
      const $location = $(
        ".sidebarColumn-1522885425 .locationContainer-118575590"
      )
        .text()
        .replace("(View Map)", "");
      const $posted = $(".datePosted-319944123 time").text();
      const description = [];
      $(
        ".showMoreWrapper-4069775982 .descriptionContainer-3544745383 div p"
      ).each((i, element) => {
        const descParagraph = $(element).text();
        description.push(descParagraph);
      });
      console.log(images);
      return {
        images,
        title: $title,
        price: $price,
        loaction: $location,
        posted: $posted,
        description
      };
    });
}

module.exports = {
  searchMonitors,
  getMonitor
};
