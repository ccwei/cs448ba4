// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  var total = 0;
  var FEEDBACK_TYPE = ["notable","constructive","questions","ideas"];
  //View for the reviewee
  app.RevieweesView = Backbone.View.extend({
    template: _.template($("#revieweesViewTemplate").html()),
    el: $("#agg-right-side"),
    // el: $("#ind-right-side"), //TODO(kanitw): use this when we use template!
    initialize: function () {
      var that = this;
      this.viewId = total ++;
      this.$el.html(this.template(this));

    },
    loadData: function(reviewees){
      var totalReviews = [];
      var that = this;
      _.each(_(reviewees).pluck('reviews'), function(r) {
        totalReviews = totalReviews.concat(r);
      });

      this.keywordListsView = new app.KeywordListsView({model: totalReviews});
      this.renderTagCloud();
      //this.renderKeywordList();
    },

    render: function(){
      //DO NOTHING since we haven't used the template for this view yet
      //TODO: not a bad idea to use template here too!

    },

    renderTagCloud: function() {
      var that = this;
      this.tagClouds = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.tagClouds[type] = new app.TagCloud({
          model: that.frequentWords[type],
          id: "agg-tab-tag-cloud .tag-cloud-" + type,
          outer_width: 400,
          outer_height: 400
        });
      });
    },

    renderKeywordList: function() {

      var that = this;
      this.keywordLists = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.keywordLists[type] = new app.KeywordListView({
          model: that.frequentWords[type],
          id: "agg-tab-keyword-list-" + that.viewId + " .keyword-list-" + type,
          outer_width: 400,
          outer_height: 400
        });
      });
    }
  });

})(jQuery);
