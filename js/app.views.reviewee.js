// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  var total = 0;

  //View for the reviewee
  app.RevieweeView = Backbone.View.extend({
    template: _.template($("#revieweeViewTemplate").html()),
    el: $("#ind-right-side"),
    // el: $("#ind-right-side"), //TODO(kanitw): use this when we use template!
    initialize: function () {
      this.viewId = total ++;
      this.$el.html(this.template(this));
      this.feedbacksAggregatedView = new app.FeedbacksAggregatedView({el: this.$el.find("#ind-tab-aggregate-grid-"+this.viewId)
      });
      this.revieweeDetailView =  new app.RevieweeDetailView({
        el: this.$el.find("#ind-reviewee-detail-"+this.viewId)
      });

      this.feedbacksView = new app.FeedbacksView({
        el: $('#ind-tab-individual-review-'+this.viewId)
        // id: '#ind-tab-individual-review'
      });
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


      this.feedbacksAggregatedView.loadData(reviewee.reviews);
      this.revieweeDetailView.loadData(reviewee);
      this.feedbacksView.loadData(reviewee.reviews);


      //these two classes have to be moved to feedbacksView any so I won't deal with them
      this.indScoresView = new app.IndScoresView({
        collection:scores,
        el: $('#indscores')
      });
      this.indScoreView = new app.IndScoreView();


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

    }
  });

})(jQuery);