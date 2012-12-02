// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  //View for the reviewee
  app.RevieweeView = Backbone.View.extend({
    el: "#ind-right-side", //TODO(kanitw): make sure we need this line.
    initialize: function () {

    },
    loadData: function(reviewee){
      _.each(reviewee.reviews, function(r) {
        // console.log(r);
        processWord(r, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords);
      });
      var scores = _.map(reviewee.reviews, function(d, idx) {
        return {score: d.score};
      });
      // If you decide not to parse the whole d.reviews object, I would suggest your to use
      // var scores = _(d.reviews).pluck("score");

      //TODO(kanitw): all these initialization should be in initialize and all these classes should have loadData so we can reuse views
      this.revieweeDetailView =  new app.RevieweeDetailView(reviewee);
      this.indScoreView = new app.IndScoreView(reviewee);
      this.feedbacksView = new app.FeedbacksView({
        collection:reviewee.reviews,
        el: '#feedbacks'
      });
      this.indScoresView = new app.IndScoresView({
        collection:scores,
        el: '#indscores'
      });

      this.FeedbacksAggregatedView = new app.FeedbacksAggregatedView(reviewee.reviews);

      //TODO(kanitw): this junkies for tagCloud should be Backbonified or at least classified
      var idvNotableFeedbackWords = [];
      var idvConstructiveFeedbackWords = [];
      var idvQuestionsFeedbackWords = [];
      var idvIdeasFeedbackWords = [];

      _(reviewee.reviews).each(function(r) {
        processWord(r, idvNotableFeedbackWords, idvConstructiveFeedbackWords, idvQuestionsFeedbackWords, idvIdeasFeedbackWords);
      });

      render_tagCloud();
    },
    render: function(){
      //DO NOTHING since we haven't used the template for this view yet
      //TODO: not a bad idea to use template here too!
    }
  });

})(jQuery);