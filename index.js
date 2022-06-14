const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");
const request = require('request');
const _async = require('async');

var profiles = [
    "https://www.linkedin.com/in/vaibhavsisinty/",
];

_async.parallel(profiles.map(function(_url) {
    return function(done) {
        const url = "https://linkalyze.app/preview?profileUrl=" + _url;
        request({
            method: "GET",
            url: url,
            header: {
                "set-cookie": "PHPSESSID=f8m3ej20mocvs7ivt1k19edokk; _ga_47LC00T38R=GS1.1.1655189058.1.1.1655189979.0; _ga=GA1.1.454451129.1655189059"
            }
        }, function(err, response, html) {
             if(!err && response.statusCode != 200) {
                return done({
                    url: url,
                    err: err,
                    statusCode: response.statusCode
                });
             } else {
                 let $ = cheerio.load(html);
                 const follower_count = ($('#reportContainer .row .col-6:first-child .text-value').text() || '');
                 const engagement_per_post = ($('#reportContainer .row .col-6:first-child + .col-6 .text-value').text() || '');

                 const net_worth = ($('#reportContainer .report-networth').text() || '').match(/\$[\d,]*/gm);

                 console.log({
                     url: url,
                     net_worth: net_worth,
                     engagement_per_post: engagement_per_post,
                     follower_count: follower_count
                 });
             }
        });
    };
}), function(err, results) {
    console.log(err, results);
});

module.exports = {};
