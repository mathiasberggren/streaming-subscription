import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.justwatch.com/')
    const movieTitles = await page.evaluate(() => {
        const titles: string[] = []
        document.querySelectorAll('.movie-title').forEach(title => {
            titles.push(title.textContent || 'nothing found')
        })
        return titles
    })

    const data = await page.evaluate(() => {
        const title = document?.querySelector('h1')?.innerText
        return { title }
    })
    console.log('These are the movie titles', movieTitles)
    console.log(data)
    await browser.close()
})()

console.log('Just testing')