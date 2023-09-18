const cheerio = require('cheerio');
const fs = require('fs');
const { default: puppeteer } = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.imdb.com/chart/top/?ref_=nv_mv_250");

    await page.waitForTimeout(5000);

    const Moviedata = [];
    const $ = cheerio.load(await page.content());
    $(".ipc-metadata-list-summary-item").each((index, el) => {
        const name = $('.ipc-title__text', el).text();
        const year = $('.cli-title-metadata > span:nth-child(1)', el).text();
        const duration = $('.cli-title-metadata > span:nth-child(2)', el).text();
        const image = $(el).find('img').attr('src');
        const rating = $('.ratingGroup--imdb-rating', el).text();

        Moviedata.push({
            name: name,
            rating: rating,
            year: year,
            duration:duration,
            image: image,
        });
    });
    fs.writeFile("moviesData.json", JSON.stringify(Moviedata, null, 4), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("success");
        }
    });
    await browser.close();
})();