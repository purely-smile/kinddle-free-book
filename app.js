var co = require('co');
var rp = require('request-promise');
var fs = require('fs');
var cheerio = require('cheerio');

let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Host': 'www.amazon.cn',
    'Upgrade-Insecure-Requests': '1'
};

var result = {};

co(function*() {
    for (let i = 1; i < 400; i++) {
        let url = `https://www.amazon.cn/s/ref=sr_pg_3?rh=n%3A116087071%2Cn%3A%21116088071%2Cn%3A116169071%2Cn%3A116170071%2Cp_36%3A159125071&page=${i}&bbn=116170071&ie=UTF8&qid=1483353709`;

        let rqData = {
            url,
            headers,
            gzip: true
        };

        let res = yield rp.get(rqData);

        let $ = cheerio.load(res);

        let aNodes = $('.s-access-detail-page');

        aNodes.map((index, e) => {
            let href = $(e).attr('href');
            let title = $(e).find('.a-size-medium').text();
            result[title] = href;
            console.log('当前次序：', i * index, title);
        });
    }
    fs.writeFileSync('./result.json', JSON.stringify(result), 'utf8');
})