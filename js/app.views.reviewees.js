// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  var total = 0;
  //View for the reviewee
  app.RevieweesView = Backbone.View.extend({
    template: _.template($("#revieweesViewTemplate").html()),
    initialize: function () {
      var that = this;
      this.viewId = total ++;
      this.$el.html(this.template(this));
      if(this.options['agg']){
        this.$el.find("#reviewees-show-all-"+this.viewId).addClass("display-none");
        this.$el.find("#reviewees-show-agg-"+this.viewId).removeClass("display-none");
      }
      $('a[data-toggle="tab"]').on('shown', function (e) {
        if($(e.target).attr('href') === '#agg-tab-tag-cloud-' + that.viewId) {
          that.renderTagCloud();
        }
      });
    },
    loadData: function(reviewees){
      this.totalReviews = [];
      var that = this;
      if(reviewees && reviewees.length > 0) {
        var tmpReviews = _(reviewees.models).map(function (reviewee) {
          return reviewee.get('reviews');
        });
        _.each(tmpReviews, function(r) {
          that.totalReviews = that.totalReviews.concat(r);
        });
      }

      this.feedbacksAggregatedView = new app.FeedbacksAggregatedView({el: this.$el.find("#agg-tab-aggregate-grid-"+this.viewId)
      }).loadData(that.totalReviews);

      this.keywordListsView = new app.KeywordListsView({
        model: this.totalReviews,
        el: $("#agg-tab-keyword-list-" + that.viewId),
        onWordClick: function (text) {
          console.log('click ', text);
          that.feedbacksAggregatedView.setSearchWord(text);
          $('#agg-tab-reviews-menu' + ' a[href="#agg-tab-aggregate-grid-' + that.viewId + '"]').tab('show');
       }
      });

      this.phraseListsView = new app.KeywordListsView({
        model: this.totalReviews,
        bigram: true,
        el: $("#agg-tab-phrase-list-" + that.viewId),
        onWordClick: function (text) {
          console.log('click ', text);
          that.feedbacksAggregatedView.setSearchWord(text);
          $('#agg-tab-reviews-menu' + ' a[href="#agg-tab-aggregate-grid-' + that.viewId + '"]').tab('show');
        }
      });

      this.redrawTagCloud = true;
      this.renderTagCloud();
      app.containerResize();
    },

    render: function(){
      //DO NOTHING since we haven't used the template for this view yet
      //TODO: not a bad idea to use template here too!
    },

    renderTagCloud: function() {
      var that = this;
      var displayTagCloud = function () {
        return ( ($("#all-right-side .nav .active a").attr("href") === '#agg-tab-tag-cloud-' + that.viewId) || ($("#agg-right-side .nav .active a").attr("href") === '#agg-tab-tag-cloud-' + that.viewId) ) && that.redrawTagCloud;
      };

      if(displayTagCloud()){
        this.tagCloudsView = new app.TagCloudsView({
          model: this.totalReviews,
          el: $("#agg-tab-tag-cloud-" + that.viewId)
        });
        this.redrawTagCloud = false;
      }
    }

  });

})(jQuery);
