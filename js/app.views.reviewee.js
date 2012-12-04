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

      this.createTagCloud('ind-tab-tag-cloud');
      $('a[data-toggle="tab"]').on('shown', function (e) {
        if($(e.target).attr('href') === '#ind-tab-tag-cloud') {
          that.render();
        }
      });


    },
    loadData: function(reviewee){
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


      this.render();
    },
    createTagCloud: function (parentid) {
        console.log("createTagCloud()");
        this.notableTagCloud = new app.TagCloud({
          id: parentid + " .tag-cloud-notable",
          outer_width: 400,
          outer_height: 400
        });
        this.constructiveTagCloud = new app.TagCloud({
        id: parentid + " .tag-cloud-constructive",
        outer_width: 400,
        outer_height: 400
        });
        this.questionsTagCloud = new app.TagCloud({
          id: parentid + " .tag-cloud-questions",
          outer_width: 400,
          outer_height: 400
        });
        this.ideasTagCloud = new app.TagCloud({
          id: parentid + " .tag-cloud-ideas",
          outer_width: 400,
          outer_height: 400
        });
    },
    render: function(){
      //DO NOTHING since we haven't used the template for this view yet
      //TODO: not a bad idea to use template here too!

    }
  });

})(jQuery);
