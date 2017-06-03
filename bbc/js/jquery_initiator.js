/* jQuery Initiator
 * 2013-03-08
 * Call the BBCPaginate plugin from here on relevant components
 */

$(document).ready(function()   {

    $("div#feed1").BBCPaginate({
        feed_url: "data/news-12.json",
        feed_type: "static",
        update_interval:  "6000"
    });

    $("div#feed2").BBCPaginate({
        feed_url: "data/news-7.json",
        feed_type: "static"
    });

    $("div#feed3").BBCPaginate({
        feed_url: "data/news-3.json",
        feed_type: "static"
    });

    $("div#feed4").BBCPaginate({
        feed_url: "data/news-large.json",
        feed_type: "static"
    });

    $("div#feed_multiple").BBCPaginate({
        feed_url: "http://polling.bbc.co.uk/sport/0/16189337/ticker.sjson|http://www.bbc.co.uk/news/10284448/ticker.sjson",
        feed_type: "bbc_ticker",
        show_title: true,
        update_interval:  "120000"
    });

    $("div#feed_bbcsport").BBCPaginate( {
            feed_url: "http://polling.bbc.co.uk/sport/0/16189337/ticker.sjson",
            feed_type: "bbc_ticker"
    });

    $("div#feed_bbcnews").BBCPaginate( {
        feed_url: "http://www.bbc.co.uk/news/10284448/ticker.sjson",
        feed_type: "bbc_ticker",
        show_title:  false
    });

    $("div#feed_bbc_breaking").BBCPaginate( {
        feed_url: "http://www.bbc.co.uk/news/10284448/ticker.sjson|http://polling.bbc.co.uk/sport/0/16189337/ticker.sjson",
        feed_type: "bbc_ticker",
        show_title:  true,
        news_type: "breaking",
        update_interval: 20000
    });

    $("div#feed_1item").BBCPaginate( {
        feed_url: "data/news-1.json",
        feed_type: "static"
    });

    $("div#feed_0items").BBCPaginate( {
        feed_url: "data/news-0.json",
        feed_type: "static"
    });

    $("div#feed_baditem").BBCPaginate( {
        feed_url: "data/news-baditem.json",
        feed_type: "static"
    });

    $("div#feed_emptyitem").BBCPaginate( {
        feed_url: "data/news-emptyitem.json",
        feed_type: "static"
    });

    $("div#feed_malformed").BBCPaginate( {
        feed_url: "data/news-malformed.json",
        feed_type: "static"
    });

    $("div#feed_updated").BBCPaginate( {
        feed_url: "data/news-updated.json",
        feed_type: "static",
        update_interval: 100000
    });

    $("div#feed_updated_first").BBCPaginate( {
        feed_url: "data/news-updated-first.json",
        feed_type: "static",
        update_interval: 100000
    });

    $("div#feed_updated_last").BBCPaginate( {
        feed_url: "data/news-updated-last.json",
        feed_type: "static",
        update_interval: 100000
    });

    $("div#feed_removed").BBCPaginate( {
        feed_url: "data/news-removed.json",
        feed_type: "static",
        update_interval: 100000
    });

    $("div#feed_removed_last").BBCPaginate( {
        feed_url: "data/news-removed-last.json",
        feed_type: "static",
        update_interval: 100000
    });

    $("div#feed_removed_first").BBCPaginate( {
        feed_url: "data/news-removed-first.json",
        feed_type: "static",
        update_interval: 100000
    });

});



