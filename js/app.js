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
  d3.tsv("./data/a4.tsv", function(data) {
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
    var teamReviews = [];
    var count = 0;
    for(var key in teamMap) {
      teamReviews.push({teamid: key, reviews: teamMap[key]});
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

      var dir = new app.ReviewDir(teamReviews);
      dir.initPos(); //need to be called here

      var theRevieweeView = new app.RevieweeView();
      var allRevieweesView = new app.RevieweesView({
        el: $("#all-right-side"),
        agg:false
      });
      var aggRevieweesView = new app.RevieweesView({
        el: $("#agg-right-side"),
        agg:true
      });
      allRevieweesView.loadData(teamReviews);

    var chart = new app.StackedChart({
      collection: dir,
      outer_width: 400,
      outer_height: 300,
      el: "#chart",
      onItemSelected: function(d){
        app.showView('ind');
        theRevieweeView.loadData(d);
      },
      onItemDeselected: function(d){
        app.showView('app');
      },
      onBrushed: function(){
        app.showView("agg");
      },
      onUnbrushed: function(){
        app.showView("all");
      }
    }).render();
    var totalReviews = [];
    _.each(_(teamReviews).pluck('reviews'), function(r) {
      totalReviews = totalReviews.concat(r);
    });
    });
  });

})(jQuery);


