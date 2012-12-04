// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  //View for the reviewee
  app.RevieweeView = Backbone.View.extend({
    // el: $("#ind-right-side"), //TODO(kanitw): use this when we use template!
    initialize: function () {

      //this.createTagCloud('ind-tab-tag-cloud');
      var that = this;
      //Register event for render tag cloud when switch to the tab
      $('a[data-toggle="tab"]').on('shown', function (e) {
        if($(e.target).attr('href') === '#ind-tab-tag-cloud') {
          that.renderTagCloud();
        }
      });
    },
    loadData: function(reviewee){
      var scores = _.map(reviewee.reviews, function(d, idx) {
        return {score: d.score};
      });
      // If you decide not to parse the whole d.reviews object, I would suggest your to use
      // var scores = _(d.reviews).pluck("score");

      //TODO(kanitw): all these initialization should be in initialize and all these classes should have loadData so we can reuse views
      this.reviewee = reviewee;
      this.revieweeDetailView =  new app.RevieweeDetailView(reviewee);
      this.indScoreView = new app.IndScoreView(reviewee);
      this.feedbacksView = new app.FeedbacksView({
        collection:reviewee.reviews,
        el: $('#ind-tab-individual-review')
        // id: '#ind-tab-individual-review'
      });
      this.indScoresView = new app.IndScoresView({
        collection:scores,
        el: $('#indscores')
      });

      this.FeedbacksAggregatedView = new app.FeedbacksAggregatedView(reviewee.reviews);


      this.frequentWordsNotable = new app.FrequentWords(reviewee.reviews, "notable");
      this.frequentWordsConstructive = new app.FrequentWords(reviewee.reviews, "constructive");
      this.frequentWordsQuestions = new app.FrequentWords(reviewee.reviews, "questions");
      this.frequentWordsIdeas = new app.FrequentWords(reviewee.reviews, "ideas");
      this.renderTagCloud();

    },
    renderTagCloud: function(){
      //DO NOTHING since we haven't used the template for this view yet
      //TODO: not a bad idea to use template here too!
      var that = this;
      if($("#ind-right-side .nav .active a").attr("href") === '#ind-tab-tag-cloud') {
          console.log("render_tagCloud()", $("#ind-right-side .nav .active a").attr("href"));

          this.notableTagCloud = new app.TagCloud({
            model: this.frequentWordsNotable,
            id: "ind-tab-tag-cloud .tag-cloud-notable",
            outer_width: 400,
            outer_height: 400
          });
          setTimeout(function() {
            that.constructiveTagCloud = new app.TagCloud({
              model: that.frequentWordsConstructive,
              id: "ind-tab-tag-cloud .tag-cloud-constructive",
              outer_width: 400,
              outer_height: 400
            });
            that.questionsTagCloud = new app.TagCloud({
              model: that.frequentWordsQuestions,
              id: "ind-tab-tag-cloud .tag-cloud-questions",
              outer_width: 400,
              outer_height: 400
            });
            that.ideasTagCloud = new app.TagCloud({
              model: that.frequentWordsIdeas,
              id: "ind-tab-tag-cloud .tag-cloud-ideas",
              outer_width: 400,
              outer_height: 400
            });
          }, 1000);
      }
    }
  });

})(jQuery);