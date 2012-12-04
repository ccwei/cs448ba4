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
      var that = this;
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

      $('a[data-toggle="tab"]').on('shown', function (e) {
        if($(e.target).attr('href') === '#ind-tab-tag-cloud') {
          that.renderTagCloud();
        }
      });
    },
    loadData: function(reviewee){
      var that = this;
      this.feedbacksAggregatedView.loadData(reviewee.reviews);
      this.revieweeDetailView.loadData(reviewee);
      this.feedbacksView.loadData(reviewee.reviews);

      var scores = _.map(reviewee.reviews, function(d, idx) {
        return {score: d.score};
      });
      // If you decide not to parse the whole d.reviews object, I would suggest your to use
      // var scores = _(d.reviews).pluck("score");


      this.indScoresView = new app.IndScoresView({
        collection:scores,
        el: $('#indscores')
      });
      this.indScoreView = new app.IndScoreView();

      this.frequentWords = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.frequentWords[type] = new app.FrequentWords(reviewee.reviews, type);
      });
      this.renderTagCloud();

    },
    renderTagCloud: function(){
      var that = this;
      if($("#ind-right-side .nav .active a").attr("href") === '#ind-tab-tag-cloud') {
          console.log("render_tagCloud()", $("#ind-right-side .nav .active a").attr("href"));

        this.tagClouds = {};
        _(app.FEEDBACK_TYPE).each(function (type) {
          that.tagClouds[type] = new app.TagCloud({
            model: that.frequentWords[type],
            id: "ind-tab-tag-cloud .tag-cloud-" + type,
            outer_width: 400,
            outer_height: 400
          });
        });
      }
    }
  });

})(jQuery);
