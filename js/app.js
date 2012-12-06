// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.showView = function showView(view){
    if(view=="ind"){
      $("#all-right-side").removeClass('active');
      $("#agg-right-side").removeClass('active');
      $("#ind-right-side").addClass('active');
    }else if(view=="all"){
      $("#all-right-side").addClass('active');
      $("#agg-right-side").removeClass('active');
      $("#ind-right-side").removeClass('active');
    }else{
      $("#all-right-side").removeClass('active');
      $("#agg-right-side").addClass('active');
      $("#ind-right-side").removeClass('active');
    }
  };

$(document).ready(function() {
  d3.tsv("./data/a4_allscores.tsv", function(data) {
    data = _.filter(data, function(d){
      d.score = +d.score;
      return !isNaN(d.score);
    });
    var teamMap = {};
    _.each(data, function(d, idx) {
      if (d["reviewed_id"] in teamMap) {
        teamMap[d["reviewed_id"]].push(d);
      } else {
        teamMap[d["reviewed_id"]] = [d];
      }
    });

    //Convert map to an array of object {teamid: id, score: average_score, reviews: reviews}
    var team_properties = ['first_industry_sector','second_industry_sector','team_score'];
    var teamReviews = [];
    var count = 0;
    for(var key in teamMap) {
      var o = {teamid: key, name:key, reviews: teamMap[key]}; //object to push

      //add team data back from reviews object
      for(var i=0 ; i<team_properties.length ; i++){
        var prop = team_properties[i];
        o[prop] = o.reviews[0][prop];
      }

      teamReviews.push(o);
    }
    _.each(teamReviews, function(tr) {
      var sum = 0;
      _.each(tr.reviews, function(r) {
        sum += r.score;
      });
      if(tr.reviews.length > 10)
        count++;
      tr.score = Math.round(sum * 1.0 / tr.reviews.length);
    });

    var revieweeCollection = new app.RevieweeCollection(teamReviews);

    var theRevieweeView = new app.RevieweeView();
    var allRevieweesView = new app.RevieweesView({
      el: $("#all-right-side"),
      agg:false
    }).loadData(revieweeCollection);
    var aggRevieweesView = new app.RevieweesView({
      el: $("#agg-right-side"),
      agg:true
    }).loadData(revieweeCollection);
    var onReviewee = {
      selected: function(d){
        app.showView('ind');
        theRevieweeView.loadData(d);
      },
      deselected: function(d){
        app.showView('app');
      },
      brushed: function(){
        app.showView("agg");
      },
      unbrushed: function(){
        app.showView("all");
      }
    };

    var chart = new app.StackedChart({
      collection: revieweeCollection,
      xName: "score",
      outer_width: 400,
      outer_height: 300,
      el: "#chart",
      onItemSelected: onReviewee.selected,
      onItemDeselected: onReviewee.deselected,
      onBrushed: onReviewee.brushed,
      onUnbrushed: onReviewee.unbrushed
    }).render();

    var revieweeList = new app.RevieweeList({
      el: $("#reviewee-list"),
      collection: revieweeCollection,
      onItemSelected: onReviewee.selected,
      onItemDeselected: onReviewee.deselected
    });

    var totalReviews = [];
    _.each(_(teamReviews).pluck('reviews'), function(r) {
      totalReviews = totalReviews.concat(r);
    });
    });
  });

})(jQuery);


