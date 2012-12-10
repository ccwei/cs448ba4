// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.DO_NOTHING = function() { /*do nothing*/ };

  app.stopWords = ["http", "i", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];

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
    app.containerResize();
  };

app.containerResize = function() {
  var H = $(window).height();
  $('#root').height(H);
  $('#right-side').height(H);
  $('#reviewee-list').height(H-
    $('.left-side h1-container').outerHeight() -
    $('.left-side .upper').outerHeight() -
    $('.left-side h3.mini-header').outerHeight() -
    ( app.selectedRevieweeListItem && app.selectedRevieweeListItem.isShown ? $('#selected-reviewee-item-list').outerHeight() : 0
      )
  );

  var $rightSide = $("#ind-right-side");

  if($("#all-right-side").hasClass("active")){
    $rightSide =  $("#all-right-side");
  }else if ($("#agg-right-side").hasClass("active")) {
    $rightSide =  $("#agg-right-side");
  }

  $rightSide.find('.lower').height(H-
    $rightSide.find(".head").outerHeight()-
    $rightSide.find(".upper").outerHeight()-
    $rightSide.find(".mini-header-tabber").outerHeight()*2
  );

  //notify childrenResize();

};

$(window).bind('resize', function() { app.containerResize(); });

$(document).ready(function() {
  window.app.simWord = {};
  var simWord = window.app.simWord;
  $.get("./data/similar_words/sim_words_t2.tsv", function(data) {
    var lines = data.split("\n");
    _.each(lines, function(d){
      var word = $.trim(d).split("\t");
      var header;
      _.each(word, function(w, index){
        if(index === 0){
          header = w;
          simWord[w] = [];
        }
        else
          simWord[header].push(w);
      });
    });
  });
});

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
    });

    var selectedRevieweeListItem = new app.RevieweeListItemView({
          el: $('#selected-reviewee-item-list'),
          onCancelClicked: function () {
            app.showView("all");
            selectedRevieweeListItem.hide();
            chart.unHighlightAll();
            app.containerResize();
          }
        });
    app.selectedRevieweeListItem  = selectedRevieweeListItem;

    // handler of onReviewee
    var onReviewee = {
      selected: function(d){
        app.showView('ind');
        theRevieweeView.loadData(d);
        selectedRevieweeListItem.loadData(d);
        selectedRevieweeListItem.setupForSelectedItem();
        app.containerResize();
      },
      deselected: function(d){
        app.showView("all");
        selectedRevieweeListItem.hide();
        app.containerResize();
      },
      unbrushed: function(){
        app.showView("all");
        selectedRevieweeListItem.hide();
      }
    };

    var brushed = function(filteredModels){
        var filteredRevieweeCollection = new app.RevieweeCollection(filteredModels);
        aggRevieweesView.loadData(filteredRevieweeCollection);
        revieweeList.loadData(filteredRevieweeCollection);
        app.showView("agg");
        selectedRevieweeListItem.hide();
      };

    var chart = new app.StackedChart({
      collection: revieweeCollection,
      xName: "score",
      outer_width: 350,
      outer_height: 200,
      el: "#chart",
      onItemSelected: onReviewee.selected,
      onItemDeselected: onReviewee.deselected,
      onUnbrushed: onReviewee.unbrushed,
      onBrushed: brushed,
      tooltip: function(d,i){
        return "Team #"+d.get('name');
      },
      xDomain: _.range(1,11)
    }).render();

    var revieweeList = new app.RevieweeList({
      el: $("#reviewee-list"),
      collection: revieweeCollection,
      onItemSelected: onReviewee.selected,
      onItemDeselected: onReviewee.deselected,
      onItemClicked: function(d) {
        onReviewee.selected(d);
        chart.highlightItem(d);
      }
    });

    });
    app.containerResize();
  });

})(jQuery);


