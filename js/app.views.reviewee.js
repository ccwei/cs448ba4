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
        el: this.$el.find("#reviewee-detail-"+this.viewId)
      });
      this.feedbacksView = new app.FeedbacksView({
        el: this.$el.find('#ind-tab-individual-review-'+this.viewId)
        // id: '#ind-tab-individual-review'
      });

      $('a[data-toggle="tab"]').on('shown', function (e) {
        if($(e.target).attr('href') === '#ind-tab-tag-cloud-' + that.viewId) {
          that.renderTagCloud();
        }
      });
    },
    loadData: function(reviewee){
      var that = this;
      this.modal = new app.Reviewee(reviewee);
      console.log(this.modal);
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

      this.keywordListsView = new app.KeywordListsView({
        model: reviewee.reviews,
        el: $("#ind-tab-keyword-list-" + that.viewId),
        onWordClick: function (event) {
                        var text = $(event.target).text();
                        console.log("click on ", text);
                        text = text.substr(0, text.indexOf(" ("));
                        that.feedbacksAggregatedView.setSearchWord(text);
                        $('#ind-tab-menu' + ' a[href="#ind-tab-aggregate-grid-' + that.viewId + '"]').tab('show');
                     }
      });
      this.redrawTagCloud = true;
      this.renderTagCloud();
    },

    renderTagCloud: function(){
      var that = this;
      if($("#ind-right-side .nav .active a").attr("href") === '#ind-tab-tag-cloud-' + that.viewId && this.redrawTagCloud) {
          this.tagCloudsView = new app.TagCloudsView({
            model: that.modal["attributes"].reviews,
            el: $("#ind-tab-tag-cloud-" + that.viewId),
            onWordClick: function (d) {
              console.log("clieck ", d);
                          var text = d.text;
                          that.feedbacksAggregatedView.setSearchWord(text);
                          $('#ind-tab-menu' + ' a[href="#ind-tab-aggregate-grid-' + that.viewId + '"]').tab('show');
                        }
          });
          this.redrawTagCloud = false;
        }
      }
  });

})(jQuery);
