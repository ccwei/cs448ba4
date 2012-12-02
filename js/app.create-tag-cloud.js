// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */

var notableTagCloud;
var constructiveTagCloud;
var questionsTagCloud;
var ideasTagCloud;
var tabEventRegistered = false;

var indNotableFeedbackWords = [];
var indConstructiveFeedbackWords = [];
var indQuestionsFeedbackWords = [];
var indIdeasFeedbackWords = [];

function createTagCloud(parentid, notableWords, constructiveWords, questionsWords, ideasWords) {
  console.log("createTagCloud()");
  notableTagCloud = new app.TagCloud({
    id: parentid + " .tag-cloud-notable",
    outer_width: 400,
    outer_height: 400
  });
  notableTagCloud.loadData(notableWords);

  setTimeout(function(){
    	constructiveTagCloud = new app.TagCloud({
      id: parentid + " .tag-cloud-constructive",
      outer_width: 400,
      outer_height: 400
      });

      constructiveTagCloud.loadData(constructiveWords);

      questionsTagCloud = new app.TagCloud({
        id: parentid + " .tag-cloud-questions",
        outer_width: 400,
        outer_height: 400
      });

      questionsTagCloud.loadData(questionsWords);

      ideasTagCloud = new app.TagCloud({
        id: parentid + " .tag-cloud-ideas",
        outer_width: 400,
        outer_height: 400
      });

      ideasTagCloud.loadData(ideasWords);
    }, 1000);
	}

function render_tagCloud() {
  if($("#ind-right-side .nav .active a").attr("href") === '#ind-tab-tag-cloud') {
    console.log("render_tagCloud()", $("#ind-right-side .nav .active a").attr("href"));
    createTagCloud("ind-tab-tag-cloud", indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords);
  } else if (!tabEventRegistered){
      $('a[data-toggle="tab"]').on('shown', function (e) {
        if($(e.target).attr('href') === '#ind-tab-tag-cloud') {
          createTagCloud("ind-tab-tag-cloud", indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords);
        }
      });
      tabEventRegistered = true;
  }
}

function processWord(review, notableWords, constructiveWords, questionsWords, ideasWords) {
  _(review.notable.split(" ")).each(function (w) {
    notableWords.push([w,review]);
  });
  _(review.constructive.split(" ")).each(function (w) {
    constructiveWords.push([w,review]);
  });
  _(review.questions.split(" ")).each(function (w) {
    questionsWords.push([w,review]);
  });
  _(review.ideas.split(" ")).each(function (w) {
    ideasWords.push([w,review]);
  });
}