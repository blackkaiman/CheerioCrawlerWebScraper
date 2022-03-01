    var fs = require("fs");
String.prototype.insert = function (index, string) {
    if (index > 0) {
        return this.substring(0, index) + string + this.substr(index);
    }
    return string + this;
};
const splitter = (textString) =>{
    let arr = textString.split(" ");
    console.log(textString);
    return arr[arr.length-2];
}
const splitFile = () =>{
    var text = fs.readFileSync("laptops.txt").toString('utf-8');

    var textByLine = text.split('\n');
    return textByLine;
}

const Apify = require("apify");

// Apify.utils contains various utilities, e.g. for logging.
// Here we use debug level of logging to improve the debugging experience.
// This functionality is optional!
const { log } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);

// Apify.main() function wraps the crawler logic (it is optional).
Apify.main(async () => {
    // Create an instance of the RequestList class that contains a list of URLs to crawl.
    // Add URLs to a RequestList
    arr = splitFile();
    const sources = [];
    for(let i = 0;i<arr.length;i++){
        let item = {url:arr[i]};
        sources.push(item);
    }
    console.log(sources);
    // And then we add a request to it.
    const requestList = await Apify.openRequestList('my-list', sources);
    // Create an instance of the CheerioCrawler class - a crawler
    // that automatically loads the URLs and parses their HTML using the cheerio library.
    const crawler = new Apify.CheerioCrawler({
        // Let the crawler fetch URLs from our list.
        requestList,

        // The crawler downloads and processes the web pages in parallel, with a concurrency
        // automatically managed based on the available system memory and CPU (see AutoscaledPool class).
        // Here we define some hard limits for the concurrency.
        minConcurrency: 10,
        maxConcurrency: 50,

        // On error, retry each page at most once.
        maxRequestRetries: 1,

        // Increase the timeout for processing of each page.
        handlePageTimeoutSecs: 30,

        // Limit to 10 requests per one crawl
        maxRequestsPerCrawl: 10,

        // This function will be called for each URL to crawl.
        // It accepts a single parameter, which is an object with options as:
        // https://sdk.apify.com/docs/typedefs/cheerio-crawler-options#handlepagefunction
        // We use for demonstration only 2 of them:
        // - request: an instance of the Request class with information such as URL and HTTP method
        // - $: the cheerio object containing parsed HTML
        handlePageFunction: async ({ request, $ }) => {
            log.debug(`Processing ${request.url}...`);

            // Extract data from the page using cheerio.
            const fullTitle = $("title").text();
            const title = fullTitle.substring(0, fullTitle.length - 9); // we take out the emag.ro
            //i find the price presented in 3 ways, so i create a price for each one
            //i select the price using the selector that i get from inspecting the element which contains it using the chrome dev tools
            const price1 = $('#main-container > section:nth-child(1) > div > div.row > div.col-sm-5.col-md-7.col-lg-7 > div > div > div.col-sm-12.col-md-6.col-lg-5 > form > div.product-highlight.product-page-pricing > div:nth-child(1) > div > div.pricing-block.has-installments > p.product-new-price').text();
            const price2 = $('#main-container > section:nth-child(1) > div > div.row > div.col-sm-5.col-md-7.col-lg-7 > div > div > div.col-sm-12.col-md-6.col-lg-5 > form > div.product-highlight.product-page-pricing > div:nth-child(1) > div > div.pricing-block.has-installments > p.product-new-price.has-deal').text();
            const price3 = $('#main-container > section:nth-child(1) > div > div.row > div.col-sm-5.col-md-7.col-lg-7 > div > div > div.col-sm-12.col-md-6.col-lg-5 > div > div:nth-child(1) > p').text();
            //i find the stock presented in 4 ways, so i do the same as with the price, creating one for each one
            const inStock = $('#main-container > section:nth-child(1) > div > div.row > div.col-sm-5.col-md-7.col-lg-7 > div > div > div.col-sm-12.col-md-6.col-lg-5 > form > div.product-highlight.product-page-pricing > div.stock-and-genius > span.label.label-in_stock').text();
            const outOfStock = $('#main-container > section:nth-child(1) > div > div.row > div.col-sm-5.col-md-7.col-lg-7 > div > div > div.col-sm-12.col-md-6.col-lg-5 > form > div.product-highlight.product-page-pricing > div.stock-and-genius > span.label.label-out_of_stock').text();
            const limitedStockType1 = $('#main-container > section:nth-child(1) > div > div.row > div.col-sm-5.col-md-7.col-lg-7 > div > div > div.col-sm-12.col-md-6.col-lg-5 > form > div.product-highlight.product-page-pricing > div.stock-and-genius > span.label.label-limited_stock_qty').text().toString();
            const limitedStockType2 = $('#main-container > section:nth-child(1) > div > div.row > div.col-sm-5.col-md-7.col-lg-7 > div > div > div.col-sm-12.col-md-6.col-lg-5 > div > div.product-highlight.product-page-actions.js-product-page-actions > a').text();
            //here i choose the correct price and stock
            //by checking if the jquery returned anything
            //i do it for each type of price and stock
            if(price1.length!=0){
                var price = price1;
                price = splitter(price);
                price = price.insert(price.length-2,",");
                var stock;
                if(inStock.length!=0){
                    stock = "inStock";
                }
                if(outOfStock.length!=0){
                    stock="outOfStock";
                }
                if(limitedStockType1.length!=0){
                    stock="inStock";
                }
                if(limitedStockType2.length!=0){
                    stock = "inStock";
                }
            }
            if(price2.length!=0){
                var price = price2;
                price = splitter(price);
                price = price.insert(price.length-2,",");
                var stock;
                if(inStock.length!=0){
                    stock = "inStock";
                }
                if(outOfStock.length!=0){
                    stock="outOfStock";
                }
                if(limitedStockType1.length!=0){
                    stock="inStock";
                }
                if(limitedStockType2.length!=0){
                    stock = "inStock";
                }
            }
            if(price3.length!=0){
                var price = price3;
                price = splitter(price);
                price = price.insert(price.length-2,",");
                var stock;
                if(inStock.length!=0){
                    stock = "inStock";
                }
                if(outOfStock.length!=0){
                    stock="outOfStock";
                }
                if(limitedStockType1.length!=0){
                    stock="inStock";
                }
                if(limitedStockType2.length!=0){
                    stock = "inStock";
                }
            }
            //after getting the appropiate values, we push the data to the default dataset
            await Apify.pushData({
                url: request.url,
                title,
                price,
                stock,
            });
            // Store the results to the default dataset. In local configuration,
            // the data will be stored as JSON files in ./apify_storage/datasets/default
            
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async ({ request }) => {
            log.debug(`Request ${request.url} failed twice.`);
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();

    log.debug("Crawler finished.");
});
