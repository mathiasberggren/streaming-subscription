/* eslint-disable no-constant-condition */
import puppeteer from 'puppeteer';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const mainPage = await browser.newPage();
  await mainPage.goto('https://www.justwatch.com/se/filmer');

  const linkSelector = 'a.title-list-grid__item--link';

  const movies: string[] = [];

  // Used to keep track of what has been processed in the infinite loading screen
  let lastMovieCount = 0;
  const moviesProcessed = new Set();
  let newMovies: string[] = [];

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const links = await mainPage.$$eval(linkSelector, (anchors) =>
      anchors.map((anchor) => anchor.href)
    );

    // Determine the new movies by filtering out the already processed links
    newMovies = links.filter((href) => {
      const movieHasNotBeenProcessed = !moviesProcessed.has(href);
      return movieHasNotBeenProcessed;
    });

    // If there are no new movies, then we assume we've reached the end
    if (newMovies.length === 0 || newMovies.length === lastMovieCount) {
      console.log('No more new items found, or same item count reached.');
      break;
    }

    for (const href of links) {
      moviesProcessed.add(href);
      // Open a new tab for each href to not ruin scrolling position for main page
      const newPage = await browser.newPage();
      await newPage.goto(href);

      // Data extraction for a specific movie will be done here
      const info = await newPage.evaluate(() => {
        return document.querySelector('h1')?.innerText;
      });

      await newPage.close();

      // Avoid trigger rate-limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (info !== undefined) {
        movies.push(info);
      }
    }

    lastMovieCount = movies.length;

    // Scroll down
    await mainPage.evaluate('window.scrollTo(0, document.body.scrollHeight)');

    // Wait for lazy loaded images etc
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log('This is the extracted info');
  console.log(movies);

  await browser.close();
})();
