const puppeteer = require('puppeteer');

const typeActiveWord = async (page) => {
    let activeWordExists = true;

    while (activeWordExists) {
        const typeWord = await getWord(page);
        if (typeWord) {
            await page.type('#typingTest', typeWord + ' ', { delay: 50 });
        } else {
            activeWordExists = false;
        }
    }
};

const getWord = async (page) => {
    const word = await page.evaluate(() => {
        const wordElement = document.querySelector('.word.active');
        if (wordElement) {
            const letters = Array.from(wordElement.querySelectorAll('letter'));
            return letters.map(l => l.textContent).join('');
        } else {
            return null;
        }
    });
    return word;
};

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://monkeytype.com/');

    await page.setViewport({ width: 1080, height: 1024 });

    const searchResultSelector = '#cookiePopup > div.main > div.buttons > button.active.acceptAll';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    await page.waitForSelector('#typingTest');
    await page.waitForSelector('.word.active', { timeout: 15000 });
    await typeActiveWord(page);

})();
