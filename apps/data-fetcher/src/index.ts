import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.justwatch.com/se/filmer')

    const linkSelector = 'a.title-list-grid__item--link';
    const links = await page.$$eval(linkSelector, anchors => anchors.map(anchor => anchor.href));


    let movies: string[] = [];


    for (let href of links) {
        await page.goto(href);

        const info = await page.evaluate(() => {
            return document.querySelector('h1')?.innerText;
        });

        info ? movies.push(info) : undefined;

    }

    console.log("This is the extracted info")
    console.log(movies)

    await browser.close()
})()
