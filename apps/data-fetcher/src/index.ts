import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.justwatch.com/se/filmer')

    const linkSelector = 'a.title-list-grid__item--link';




    const movies: string[] = []

    // Used to keep track of what has been processed in the infinite loading screen
    let lastMovieCount = 0;
    const moviesProcessed = new Set();
    let newMovies: string[] = [];

    // eslint-disable-next-line no-constant-condition
    while(true) {
        console.log("before waiter for link selectors")
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("after waiter for link selectors")

        const links = await page.$$eval(linkSelector, anchors => anchors.map(anchor => anchor.href));

        console.log("These are the links")
        console.log(links)

        // Determine the new movies by filtering out the already processed links
        newMovies = links.filter(href => {
            const condition = !moviesProcessed.has(href)
            console.log("evaluated")
            console.log(href)
            console.log(condition)
            return condition
        });

        console.log("These are the new movies")
        console.log(newMovies)

        // If there are no new movies, then we assume we've reached the end
        if (newMovies.length === 0 || newMovies.length === lastMovieCount) {
            console.log('No more new items found, or same item count reached.');
            break;
        }

        for (const href of links) {
            moviesProcessed.add(href);
            await page.goto(href);

            const info = await page.evaluate(() => {
                return document.querySelector('h1')?.innerText;
            });

            info ? movies.push(info) : undefined;

        }

        lastMovieCount = movies.length;

        // Scroll down
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

        // Wait for lazy loaded images etc
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log("This is the extracted info")
    console.log(movies)

    await browser.close()
})()
