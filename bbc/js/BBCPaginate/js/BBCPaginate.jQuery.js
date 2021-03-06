/*  BBCPaginate.js
 *   2013-03-09
 *   Version 1.0
 *   Author: Matthew Weaver
 *   Custom jQuery plugin to paginate a div container in line with the BBC GEL Pagination Pattern
 */

//We need an anonymous function to wrap around my function to avoid conflict with other libraries that use $
(function($){

    //Attach the new function to jQuery
    $.fn.extend({

        //Here we define the BBCPaginate function
        BBCPaginate: function(options) {

            var defaults = {
                feed_url: "http://www.bbc.co.uk/news/10284448/ticker.sjson",
                feed_type: "bbc_ticker" ,
                show_title: true,
                update_interval: 60000,
                news_type: "all"
            }

            var options = $.extend(defaults, options);

            //Iterate over the current set of matched elements
            return this.each(function() {

                var PaginationDevice = $(this);

                // to fix some quirks with touch-screen devices, we detect if the pagination
                // device is being views on a touch screen device

                // append the placeholders for the title and description
                PaginationDevice.append('<div id="news_item"><span class="title"></span><span class="description"></span></div>');
                PaginationDevice.append('<div id="pagination"></div>');

                // add a new div for the pagination, and hide it, to prevent elements that aren't needed and will be hidden
                // by a call to updatePageNavigation later on from being drawn on screen
                PaginationDevice.children("div#pagination").hide();
                PaginationDevice.children("div#pagination").append('<ul class="page_controls"><li class="arrow back disabled">Previous</li><li class="page box1"></li><li class="page box2"></li><li class="ellipses_left">...</li><li class="page box3"></li><li class="page box4"></li><li class="page box5"></li><li class="ellipses_right">...</li><li class="page box6"></li><li class="page box7"></li><li class="arrow next enabled">Next</li></ul>');

                // add mobile navigation for previous and back links
                PaginationDevice.children("div#pagination").append('<ul class="mobile_nav"><li class="arrow back disabled">Previous</li><li class="arrow next enabled">Next</li></ul>');


                // hide the title if the show_title option is set to false
                if(options.show_title === false) {
                    PaginationDevice.children("div#news_item").children("span.title").hide();
                }

                // get the user agent
                var ua = navigator.userAgent;
                // create a boolean of isTouchScreen if we detect a touch screen
                // note: this method probably won't catch all touch screen devices, but it will capture some
                // suggest: more work needed here to add better touch screen device detection
                var isTouchScreen = 'createTouch' in document ||
                    ua.match(/(iPhone|iPod|iPad)/) || ua.match(/BlackBerry/) ||
                    ua.match(/Android/);

                // if we aren't on a touch screen device, add a class of show_hover to the pagination div
                // this is to prevent a quirk of touch screen devices showing a stuck hover CSS when navigation
                // the pagination by tapping the numbered page links
                if(!isTouchScreen) {
                    PaginationDevice.children("div#pagination").addClass("show_hover");
                }

                // parse the input URL string into an array of URLs
                var feeds = [];
                var urls = options.feed_url.split('|');
                // keep track of how many feeds we have and how many we have processed
                var num_feeds = urls.length;
                var num_processed_feeds = 0;

                // news items from the feed will be stored in this array
                var news_items = [];
                var first_load = true;
                getDataFromFeed();

                function getDataFromFeed() {
                    // each time we pull from the feed(s), wipe out the previous articles
                    news_items = [];
                    // set the number of processed feeds back to zero
                    num_processed_feeds = 0;
                    // loop through the url array to pull out stories into a singe news_feeds array
                    $.each(urls, function(key,feed_url) {
                        // load data into array named news_items
                        $.getJSON(feed_url,
                            function(data) {

                                //if feed_type is bbc_ticker, manipulate the data to get the title and description from the BBC feed
                                if(options.feed_type == "bbc_ticker" ) {
                                    // BBC ticker feed data is contained in the 'entries' element of the JSON data
                                    entries = data.entries;
                                    $.each(entries, function(key, val) {
                                        // if the breaking option is set,
                                        if(options.news_type == "breaking") {
                                            //and this isn't a breaking news item,
                                            if(val.isBreaking == "false") {
                                                // don't add it to the array
                                                return true;
                                            }
                                        }
                                        // otherwise we assume all stories are to be displayed

                                        //create a new JavaScript object
                                        news_item = new Object();
                                        // map the title, description and url fields to the prompt, headline and url attributes in the feed

                                        // if we have a prompt, then set it in the array
                                        if(typeof val.prompt != 'undefined') {
                                            news_item.title = val.prompt;
                                        }

                                        // if we have a headline, set it as description in the array
                                        if(typeof val.headline != 'undefined') {
                                            // if a headlket exists, then set it
                                            if(val.headline) {
                                                news_item.description = val.headline;
                                            }
                                            else {
                                                // otherwise we have a null headline, so skip and don't add this item to the array
                                                return true;
                                            }
                                        }
                                        else {
                                            // the description of the news item is fundamental, therefore if we can't identify it in
                                            // the feed then skip this item and don't add it to the array
                                            return true;
                                        }

                                        // if we have a URL in the BBC feed, add it to the object
                                        if(typeof val.url != 'undefined') {
                                            news_item.url = val.url;
                                        }
                                        news_items.push(news_item);
                                    });
                                }
                                else {
                                    //we must be using static feed_type as default
                                    $.each(data, function(key, val) {
                                        // create a new JavaScript object to allow us to decide whether to pass the title or not
                                        // into the new object
                                        news_item = new Object();

                                        if(typeof val.title != 'undefined') {
                                            news_item.title = val.title;
                                        }

                                        // if we have a headline, set it as description in the array
                                        if(typeof val.description != 'undefined') {
                                            // if a description exists, then set it
                                            if(val.description) {
                                                news_item.description = val.description;
                                            }
                                            else {
                                                // otherwise we have a null description, so skip and don't add this item to the array
                                                return true;
                                            }

                                        }
                                        else {
                                            // the description of the news item is fundamental, therefore if we can't identify it in
                                            // the feed then skip this item and don't add it to the array
                                            return true;
                                        }

                                        // if we have a URL set, add it to the object
                                        if(typeof val.url != 'undefined') {
                                            news_item.url = val.url;
                                        }
                                        news_items.push(news_item);
                                    });
                                }

                            }
                        ).success(function() {
                                // when we have processed this feed, add 1 to the number processed
                                num_processed_feeds ++;

                                // when we have processed all the feeds we are expecting
                                if(num_processed_feeds == num_feeds) {
                                    if(first_load) {
                                        // configure the page navigation option defaults
                                        setNavigationOnFirstLoad();
                                    }
                                    first_load = false;
                                    updatePageNavigation();
                                    updateBackAndNext();
                                }
                        }).error(function(xhr,status,error) {
                                PaginationDevice.hide();
                                console.log("JSON Error - the format of the passed JSON file was invalid (" + options.feed_url + ")");
                                return false;
                        });
                    }); // end loop through array of urls

                    // update the array with the JSON data every 60 seconds
                    setTimeout(getDataFromFeed,options.update_interval);
                }//end function getDataFromFeed


                function setNavigationOnFirstLoad()   {
                    /*
                    If this is the first time the page is loading, we need to get the first news item details
                    and add them to the page element, plus set some default pagination options
                     */

                    //count total number of news items
                    var num_news_items = news_items.length;

                    // if we have some news items in the feed, then show the pagination device
                    // otherwise it stays hidden
                    if(num_news_items > 0) {
                        //add the necessary html to the target div
                        PaginationDevice.children("div#pagination").show();
                    }

                    if(num_news_items == 0) {
                        PaginationDevice.hide();
                    }

                    if(num_news_items == 1 ) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").hide();
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").hide();
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").hide();
                    }

                    //add the first news item to the div
                    updateTitle(0);
                    updateDescription(0);

                    // set the pagination options
                    PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box1").html("1");
                    PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box1").addClass("active_page");
                    PaginationDevice.children("div#pagination").attr("current_item",1);

                    var screen_width = $(window).width();

                    var current_item =  PaginationDevice.children("div#pagination").attr("current_item");
                    if(current_item > 1) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").removeClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").removeClass("disabled");
                    }
                    if(current_item == num_news_items) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").addClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").removeClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").addClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").removeClass("enabled");
                    }

                    // set the page links
                    updatePageNavigation();
                }

                // bind to clicking the back navigation
                PaginationDevice.children("div#pagination").children("ul.page_controls, ul.mobile_nav").children("li.back").click(function() {
                    if(PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").is(".enabled")) {

                        // get the current news item number
                        var current_item = PaginationDevice.children("div#pagination").attr("current_item");

                        // update div with the previous news item
                        // note: minus 2 because the current item is 1 ahead of the actual array index
                        updateTitle(current_item-2);
                        updateDescription(current_item-2);


                        // update the current item number
                        current_item --;
                        PaginationDevice.children("div#pagination").attr("current_item",current_item);

                        //update back and next buttons if needed
                        updateBackAndNext();
                        updatePageNavigation();
                    }
                });

                // bind to clicking the next navigation
                PaginationDevice.children("div#pagination").children("ul.page_controls, ul.mobile_nav").children("li.next").click(function() {
                    if(PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").is(".enabled")) {

                        // get the current news item number
                        var current_item = PaginationDevice.children("div#pagination").attr("current_item");

                        // update div with the next news item
                        // note: no need to add 1 to the current_item as it is already 1 ahead
                        // of the actual array index
                        updateTitle(current_item);
                        updateDescription(current_item);

                        // update the current item number
                        current_item ++;
                        PaginationDevice.children("div#pagination").attr("current_item",current_item);

                        //update back and next buttons if needed
                        updateBackAndNext();
                        updatePageNavigation();
                    }
                });


                // bind to clicking the navigation item numbers
                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.page").click(function() {

                    //make sure this item isn't currently selected
                    if(!$(this).is(".active_page")) {

                        //get the news item number
                        var item_number = $(this).attr("item_number");

                        //display the relevant news item
                        updateTitle(item_number-1);
                        updateDescription(item_number-1);

                        //update the current news item pointer
                        PaginationDevice.children("div#pagination").attr("current_item",item_number);

                        // remove the active_page class from the active_page
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.active_page").removeClass("active_page");

                        // and add the active_page class to the new page
                        $(this).addClass("active_page");

                        //update front and back navigation if needed
                        updateBackAndNext();
                        //update the page navigation numbers
                        updatePageNavigation();
                    }
                });

                function updateTitle(item) {
                    /*
                     This function takes the index of the current news item in the news_items array as item
                     and updates the title. If the title is not present in the array for whatever reason, we hide
                     the title from display to conserve space and prevent incorrect titles being displayed
                     */

                    var title = PaginationDevice.children("div#news_item").children("span.title");

                    // if the options are configured to show a title, we need to check if it is in the array
                    if(options.show_title === true) {
                        // if we don't have a title set for this news_item
                        if(typeof news_items[item].title == 'undefined' || !news_items[item].title) {
                            // hide the title
                            title.hide()
                        }
                        else {
                            title.html(news_items[item].title);
                            title.show();
                        }
                    }
                    // otherwise just hide the title
                    else {
                        title.hide();
                    }

                }

                function updateDescription(item) {
                    /*
                      This function takes the index of the current news item in the news_items array as item
                      and updates the description. The description is  displayed as text if no URL exists,
                      otherwise we add the description as a hyper link to the full news article
                     */

                    var desc = PaginationDevice.children("div#news_item").children("span.description");

                    // if we don't have a URL set for this news_item
                    if(typeof news_items[item].url == 'undefined') {
                        // just update the description with the text
                        desc.html(news_items[item].description);
                    }
                    else {
                        var hyperlink = "<a href=\"" + news_items[item].url + "\" target=\"_new\">" + news_items[item].description + "</a>";
                        desc.html(hyperlink);
                    }
                }


                function updatePageNavigation() {
                    /*
                     This function determines how many news items we have,
                     and where we currently are in the navigation, and sets
                     the page numbers for pagination accordingly
                     */

                    // get the current item number
                    var current_item = PaginationDevice.children("div#pagination").attr("current_item");
                    var pages_configured = 7;  //unused at the moment
                    var max_page = 0;

                    // get the display's screen width, and only update the back and next links if wider than 520px
                    var screen_width = $(window).width();

                    if(screen_width > 520) {
                        //if there is only 1 news article, hide the back and next navigation
                        if(news_items.length == 1) {
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").hide();
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").hide();
                            PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").hide();
                            PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").hide();
                        }
                        else {
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").show();
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").show();
                            PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").show();
                            PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").show();
                        }
                    }
                    // if there are 7 or less news articles, we can just show links 1 to 7 and
                    // not worry about truncated pagination
                    if(news_items.length <= 7) {
                        // add the numbers 1 through 7 to the 7 page buttons
                        // also add the news item to the li tag as an attribute
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.page").each(function(i) {
                            if(i == news_items.length) {
                                max_page = i;
                                return false;
                            }
                            var item_number = i + 1;
                            $(this).html(item_number).attr("item_number",item_number).addClass("clickable_page");
                        });

                        //hide any navigation boxes that aren't needed if we have less than 7 news item
                        if(news_items.length < 7) {
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.page").each(function(i) {
                                if(i >= max_page) {
                                    $(this).hide();
                                }
                            });
                        }

                        //clear the previously active page
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.active_page").removeClass("active_page");

                        /* Now set the active page accordingly */

                        // make variable to pass into nth-child css selector below
                        var active_item_to_set = parseInt(current_item) + 1 ;

                        // the hidden ellipses box counts towards the CSS nth-child selector,
                        // so if we are on page 3 or more add an extra 1 to skip it so that we apply the css to the correct item
                        if(current_item >= 3) {
                            active_item_to_set ++;
                        }
                        // if we are on page 6 or more add an extra 1 again to skip it so that we apply the css to the correct item
                        if(current_item >= 6) {
                            active_item_to_set ++;
                        }
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.page:nth-child(" + active_item_to_set + ")").addClass("active_page");
                    }
                    // otherwise we have more than 7, so we need to calculate which links should show
                    else {
                        // boxes 1 and 2 are always 1 and 2
                        var box1 = "1";
                        var box2 = "2";

                        // boxes 6 and 7 need to be calculated based on the number of news items
                        var box6 = news_items.length -1 ;
                        var box7 = news_items.length ;

                        // set the left and right numbers
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box1").html(box1).addClass("clickable_page").attr("item_number",box1);
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box2").html(box2).addClass("clickable_page").attr("item_number",box2);
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box6").html(box6).addClass("clickable_page").attr("item_number",box6);
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box7").html(box7).addClass("clickable_page").attr("item_number",box7);

                        /* Check if we need to show either the left or right ellipses */

                        //the BBC GEL guidelines state that ellipses should not be shown when there are
                        // less than 2 hidden pages, so the equivalent current item trigger is 5 from each end

                        // if we are at the 6th or greater page, show the left ellipses
                        if(current_item >= 6) {
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.ellipses_left").show();
                        }
                        else {
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.ellipses_left").hide();
                        }
                        // if we are more than 5 items away from the end, show the right ellipses
                        if(current_item <= news_items.length - 5) {
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.ellipses_right").show();
                        }
                        else {
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.ellipses_right").hide();
                        }

                        /* Now check how we need to set the page numbers */

                        // for the majority of pages in a large set of news items, we will keep the
                        // current item in the middle of the pagination
                        if(current_item >= 4 && current_item <= news_items.length - 4)  {
                            //calculate values of boxes 3, 4 and 5
                            var box3 = parseInt(current_item) - 1 ;
                            var box4 = current_item ;
                            var box5 = parseInt(current_item) + 1 ;

                            //clear the previously active page
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.active_page").removeClass("active_page");

                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box3").html(box3).attr("item_number",box3).html(box3).addClass("clickable_page");
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box4").html(box4).attr("item_number",box4).html(box4).addClass("active_page");
                            PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box5").html(box5).attr("item_number",box5).html(box5).addClass("clickable_page");
                        }
                        // otherwise we are not in the middle selector, and need to do something for these special cases
                        else {
                            /* Case when the current item is left of the centre */
                            if(current_item < 4) {
                                //clear the previously active page
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.active_page").removeClass("active_page");

                                // make variable to pass into nth-child css selector below
                                var active_item_to_set = parseInt(current_item) + 1 ;

                                //the hidden ellipses box counts towards the CSS nth-child selector,
                                // so if we are on page 3 add an extra 1 to skip it so that we apply the css to the correct item
                                if(current_item == 3) {
                                    active_item_to_set ++;
                                }

                                // box 3 will be a 3, by virtue of other if statements above
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box3").html("3").addClass("clickable_page").attr("item_number","3");
                                // set the nth child to be active
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.page:nth-child(" + active_item_to_set + ")").addClass("active_page");
                                //and boxes 4 and 5 will be pages 4 and 5 too
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box4").html("4").addClass("clickable_page").attr("item_number","4");
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box5").html("5").addClass("clickable_page").attr("item_number","5");
                            }

                            /* Case when the current item is right of the centre */
                            if(current_item > news_items.length - 5)  {

                                //clear the previously active page
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.active_page").removeClass("active_page");

                                // make variable to pass into nth-child css selector below
                                var active_item_to_set = parseInt(news_items.length - current_item) + 2 ;

                                //the hidden ellipses box counts towards the CSS nth-last-child selector, so if we are on the
                                // 3rd from last page add an extra 1 to skip it so that we apply the css to the correct item
                                if(current_item == news_items.length - 2 || current_item == news_items.length - 3 ) {
                                    active_item_to_set ++ ;
                                }


                                //calculate values for the page navigation boxes
                                var box3 = parseInt(news_items.length) - 4 ;
                                var box4 = parseInt(news_items.length) - 3 ;
                                var box5 = parseInt(news_items.length) - 2 ;

                                // box 3 will be 4th from last, by virtue of other if statements above
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box3").html(box3).addClass("clickable_page").attr("item_number",box3);
                                // set the nth chiuld from the end to be active
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.page:nth-last-child(" + active_item_to_set + ")").addClass("active_page");
                                //and boxes 4 and 5 will be 3rd and 2nd from last as defined above
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box4").html(box4).addClass("clickable_page").attr("item_number",box4);
                                PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.box5").html(box5).addClass("clickable_page").attr("item_number",box5);
                            }
                        }
                    }
                    // after every update to the pagination, make sure the active page can't be clicked
                    PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.active_page").removeClass("clickable_page");
                }

                function updateBackAndNext() {
                    /*
                     This function checks to see if any updates are needed to the back and next
                     navigation depending on where we are jumping to and the current button states
                     */



                    // get the current item number
                    var current_item = PaginationDevice.children("div#pagination").attr("current_item");

                    // enable back button
                    // if we are not on the first item and the back button is disabled
                    if(current_item != 1 && PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").is(".disabled") ) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").removeClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").removeClass("disabled");
                    }

                    // disable back button if we are now on the first item and the back button is disabled
                    if(current_item == 1 && PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").is(".enabled") ) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").addClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.back").removeClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").addClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.back").removeClass("enabled");
                    }

                    // enable next button
                    // if we are not on the last item, and the next button is disabled
                    if(current_item < news_items.length && PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").is(".disabled") ) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").removeClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").removeClass("disabled");
                    }

                    //disable next button if we are now on the last item and the next button is enabled
                    if(current_item == news_items.length && PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").is(".enabled") ) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").addClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").removeClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").addClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").removeClass("enabled");
                    }

                    // if the currently active page is not the last one in the set, make sure the next navigation button is enabled
                    if(current_item < news_items.length) {
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.page_controls").children("li.next").removeClass("disabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").addClass("enabled");
                        PaginationDevice.children("div#pagination").children("ul.mobile_nav").children("li.next").removeClass("disabled");
                    }

                }

            });
        }//end BBCPaginate function
    });

// Pass jQuery to the function,
// So that we will able to use any valid Javascript variable name
// to replace "$" SIGN. For convention, I have used $
})(jQuery);