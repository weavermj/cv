/*  Pagination.js
*   2013-03-07
*   Version 1.0
*   Author: Matthew Weaver
*   Custom jQuery functions for BBC Pagination test
*   This is the initial function I wrote to get the functionality working on a single DIV.
*   I have left it here for reference, but this code is not needed - the plugin file
*   BBCPaginate.jQuery.js is the actual plugin
*/

$(document).ready(function()   {

    var news_items = [];

// load data into array on page load
$.getJSON("http://localhost/data/news-12.json",
    function(data) {
        //var news_items = [];

        //for each news item in the feed, push it into an array
        $.each(data, function(key, val) {
            news_items.push(val);
        });

        //count total number of news items
        var num_news_items = news_items.length;

        //add the first news item to the div
        $("div#news_item span.title").html(news_items[0].title)
        $("div#news_item span.description").html(news_items[0].description)

        // set the pagination options
        $("div#pagination ul.page_controls li.box1").html("1");
        $("div#pagination ul.page_controls li.box1").addClass("active_page");
        $("div#pagination").attr("current_item",1);

        var current_item = $("div#pagination").attr("current_item");
        if(current_item > 1) {
            $("div#pagination ul.page_controls li.back").addClass("enabled");
            $("div#pagination ul.page_controls li.back").removeClass("disabled");
        }
        if(current_item == num_news_items) {
            $("div#pagination ul.page_controls li.next").addClass("disabled");
            $("div#pagination ul.page_controls li.next").removeClass("enabled");
        }

        // set the page links
        updatePageNavigation();

    });

// bind to clicking the back navigation
$("div#pagination ul.page_controls li.back").click(function() {
   if($("div#pagination ul.page_controls li.back").is(".enabled")) {

       // get the current news item number
       var current_item = $("div#pagination").attr("current_item");

       // update div with the previous news item
       // note: minus 2 because the current item is 1 ahead of the actual array index
       $("div#news_item span.title").html(news_items[current_item-2].title)
       $("div#news_item span.description").html(news_items[current_item-2].description)

       // update the current item number
       current_item --;
       $("div#pagination").attr("current_item",current_item);

       //update back and next buttons if needed
       updateBackAndNext();
       updatePageNavigation();
   }
});

// bind to clicking the next navigation
$("div#pagination ul.page_controls li.next").click(function() {
    if($("div#pagination ul.page_controls li.next").is(".enabled")) {

        // get the current news item number
        var current_item = $("div#pagination").attr("current_item");

        // update div with the next news item
        // note: no need to add 1 to the current_item as it is already 1 ahead
        // of the actual array index
        $("div#news_item span.title").html(news_items[current_item].title)
        $("div#news_item span.description").html(news_items[current_item].description)

        // update the current item number
        current_item ++;
        $("div#pagination").attr("current_item",current_item);

        //update back and next buttons if needed
        updateBackAndNext();
        updatePageNavigation();
    }
});


// bind to clicking the navigation item numbers
$("div#pagination ul.page_controls li.page").click(function() {

    //make sure this item isn't currently selected
    if(!$(this).is(".active_page")) {

        //get the news item number
        var item_number = $(this).attr("item_number");

        //display the relevant news item
        $("div#news_item span.title").html(news_items[item_number-1].title)
        $("div#news_item span.description").html(news_items[item_number-1].description)

        //update the current news item pointer
        $("div#pagination").attr("current_item",item_number);

        // remove the active_page class from the active_page
        $("div#pagination ul.page_controls li.active_page").removeClass("active_page");

        // and add the active_page class to the new page
        $(this).addClass("active_page");

        //update front and back navigation if needed
        updateBackAndNext();
        //update the page navigation numbers
        updatePageNavigation();
    }
});


function updatePageNavigation() {
    /*
    This function determines how many news items we have,
    and where we currently are in the navigation, and sets
    the page numbers for pagination accordingly
     */

    // get the current item number
    var current_item = $("div#pagination").attr("current_item");
    var pages_configured = 7;  //unused at the moment
    var max_page = 0;

    // if there are 7 or less news articles, we can just show links 1 to 7 and
    // not worry about truncated pagination
    if(news_items.length <= 7) {
        // add the numbers 1 through 7 to the 7 page buttons
        // also add the news item to the li tag as an attribute
        $("div#pagination ul.page_controls li.page").each(function(i) {
            if(i == news_items.length) {
                max_page = i;
                return false;
            }
            var item_number = i + 1;
            $(this).html(item_number).attr("item_number",item_number).addClass("clickable_page");
        });

        //hide any navigation boxes that aren't needed if we have less than 7 news item
        if(news_items.length < 7) {
            $("div#pagination ul.page_controls li.page").each(function(i) {
                if(i >= max_page) {
                    $(this).hide();
                }
            });
        }

        //clear the previously active page
        $("div#pagination ul.page_controls li.active_page").removeClass("active_page");

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

        $("div#pagination ul.page_controls li.page:nth-child(" + active_item_to_set + ")").addClass("active_page");
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
        $("div#pagination ul.page_controls li.box1").html(box1).addClass("clickable_page").attr("item_number",box1);
        $("div#pagination ul.page_controls li.box2").html(box2).addClass("clickable_page").attr("item_number",box2);
        $("div#pagination ul.page_controls li.box6").html(box6).addClass("clickable_page").attr("item_number",box6);
        $("div#pagination ul.page_controls li.box7").html(box7).addClass("clickable_page").attr("item_number",box7);

        /* Check if we need to show either the left or right ellipses */

        //the BBC GEL guidelines state that ellipses should not be shown when there are
        // less than 2 hidden pages, so the equivalent current item trigger is 5 from each end

        // if we are at the 6th or greater page, show the left ellipses
        if(current_item >= 6) {
            $("div#pagination ul.page_controls li.ellipses_left").show();
        }
        else {
            $("div#pagination ul.page_controls li.ellipses_left").hide();
        }
        // if we are more than 5 items away from the end, show the right ellipses
        if(current_item <= news_items.length - 5) {
            $("div#pagination ul.page_controls li.ellipses_right").show();
        }
        else {
            $("div#pagination ul.page_controls li.ellipses_right").hide();
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
            $("div#pagination ul.page_controls li.active_page").removeClass("active_page");

            $("div#pagination ul.page_controls li.box3").html(box3).attr("item_number",box3).html(box3).addClass("clickable_page");
            $("div#pagination ul.page_controls li.box4").html(box4).attr("item_number",box4).html(box4).addClass("active_page");
            $("div#pagination ul.page_controls li.box5").html(box5).attr("item_number",box5).html(box5).addClass("clickable_page");
        }
        // otherwise we are not in the middle selector, and need to do something for these special cases
        else {
            /* Case when the current item is left of the centre */
            if(current_item < 4) {
                //clear the previously active page
                $("div#pagination ul.page_controls li.active_page").removeClass("active_page");

                // make variable to pass into nth-child css selector below
                var active_item_to_set = parseInt(current_item) + 1 ;

                //the hidden ellipses box counts towards the CSS nth-child selector,
                // so if we are on page 3 add an extra 1 to skip it so that we apply the css to the correct item
                if(current_item == 3) {
                    active_item_to_set ++;
                }

                // box 3 will be a 3, by virtue of other if statements above
                $("div#pagination ul.page_controls li.box3").html("3").addClass("clickable_page").attr("item_number","3");
                // set the nth child to be active
                $("div#pagination ul.page_controls li.page:nth-child(" + active_item_to_set + ")").addClass("active_page");
                //and boxes 4 and 5 will be pages 4 and 5 too
                $("div#pagination ul.page_controls li.box4").html("4").addClass("clickable_page").attr("item_number","4");
                $("div#pagination ul.page_controls li.box5").html("5").addClass("clickable_page").attr("item_number","5");
            }

            /* Case when the current item is right of the centre */
            if(current_item > news_items.length - 5)  {

                //clear the previously active page
                $("div#pagination ul.page_controls li.active_page").removeClass("active_page");

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
                $("div#pagination ul.page_controls li.box3").html(box3).addClass("clickable_page").attr("item_number",box3);
                // set the nth chiuld from the end to be active
                $("div#pagination ul.page_controls li.page:nth-last-child(" + active_item_to_set + ")").addClass("active_page");
                //and boxes 4 and 5 will be 3rd and 2nd from last as defined above
                $("div#pagination ul.page_controls li.box4").html(box4).addClass("clickable_page").attr("item_number",box4);
                $("div#pagination ul.page_controls li.box5").html(box5).addClass("clickable_page").attr("item_number",box5);
            }
        }
    }
}

function updateBackAndNext() {
    /*
    This function checks to see if any updates are needed to the back and next
    navigation depending on where we are jumping to and the current button states
    */

    // get the current item number
    var current_item = $("div#pagination").attr("current_item");

    // enable back button
    // if we are not on the first item and the back button is disabled
    if(current_item != 1 && $("div#pagination ul.page_controls li.back").is(".disabled") ) {
        $("div#pagination ul.page_controls li.back").addClass("enabled");
        $("div#pagination ul.page_controls li.back").removeClass("disabled");
    }

    // disable back button if we are now on the first item and the back button is disabled
    if(current_item == 1 && $("div#pagination ul.page_controls li.back").is(".enabled") ) {
        $("div#pagination ul.page_controls li.back").addClass("disabled");
        $("div#pagination ul.page_controls li.back").removeClass("enabled");
    }

    // enable next button
    // if we are not on the last item, and the next button is disabled
    if(current_item < news_items.length && $("div#pagination ul.page_controls li.next").is(".disabled") ) {
        $("div#pagination ul.page_controls li.next").addClass("enabled");
        $("div#pagination ul.page_controls li.next").removeClass("disabled");
    }

    //disable next button if we are now on the last item and the next button is enabled
    if(current_item == news_items.length && $("div#pagination ul.page_controls li.next").is(".enabled") ) {
        $("div#pagination ul.page_controls li.next").addClass("disabled");
        $("div#pagination ul.page_controls li.next").removeClass("enabled");
    }
}




/*
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: "mount rainier",
            tagmode: "any",
            format: "json"
        },
        function(data) {
            $.each(data.items, function(i,item){
                $("<img/>").attr("src", item.media.m).appendTo("#images");
                if ( i == 3 ) return false;
            });
        });  */

})



