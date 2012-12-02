function showIndividualView(show){
  if(show){
    $("#agg-right-side").removeClass('active');
    $("#ind-right-side").addClass('active');
  }else{
    $("#agg-right-side").addClass('active');
    $("#ind-right-side").removeClass('active');
  }
}

function createTagCloud(parentid, reviews, notableTagCloud, constructiveTagCloud, questionsTagCloud, ideasTagCloud) {
  console.log("createTagCloud()");
  notableTagCloud = new app.TagCloud({
    id: parentid + " .tag-cloud-notable",
    outer_width: 400,
    outer_height: 400
  });
  notableTagCloud.loadData(reviews, "notable");
  constructiveTagCloud = new app.TagCloud({
  id: parentid + " .tag-cloud-constructive",
  outer_width: 400,
  outer_height: 400
  });
  questionsTagCloud = new app.TagCloud({
    id: parentid + " .tag-cloud-questions",
    outer_width: 400,
    outer_height: 400
  });
  ideasTagCloud = new app.TagCloud({
    id: parentid + " .tag-cloud-ideas",
    outer_width: 400,
    outer_height: 400
  });
  notableTagCloud.loadData(reviews, "notable");
  constructiveTagCloud.loadData(reviews, "constructive");
  questionsTagCloud.loadData(reviews, "questions");
  ideasTagCloud.loadData(reviews, "ideas");
}

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
  console.log(count, "teams have more than 10 reivews" );

  var dir = new app.ReviewDir(teamReviews);
  dir.initPos(); //need to be called here

  var theReviewView = new app.RevieweeView();

  var chart = new app.StackedChart({
    collection: dir,
    outer_width: 400,
    outer_height: 300,
    el: "#chart",
    onItemSelected: function(d){
      showIndividualView(true);
      theReviewView.loadData(d);
    },
    onItemDeselected: function(d){
      showIndividualView(false);
    }
  });
  chart.render();
  var totalReviews = [];
  _.each(_(teamReviews).pluck('reviews'), function(r) {
    totalReviews = totalReviews.concat(r);
  });
  //For Tag Cloud
  var notableTagCloud, constructiveTagCloud, questionsTagCloud, ideasTagCloud;
  createTagCloud('agg-tab-tag-cloud', totalReviews,notableTagCloud, constructiveTagCloud, questionsTagCloud, ideasTagCloud);
  });
});



