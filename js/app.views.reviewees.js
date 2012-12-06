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
    },
    loadData: function(reviewees){
      var totalReviews = [];
      var that = this;
      _.each(_(reviewees).pluck('reviews'), function(r) {
        totalReviews = totalReviews.concat(r);
      });

      this.keywordListsView = new app.KeywordListsView({
        model: totalReviews,
        el: $("#agg-tab-keyword-list-" + that.viewId)
      });

      this.tagCloudsView = new app.TagCloudsView({
        model: totalReviews,
        el: $("#agg-tab-tag-cloud-" + that.viewId)
      });
      this.tagCloudsView.render();
    },

    render: function(){
      //DO NOTHING since we haven't used the template for this view yet
      //TODO: not a bad idea to use template here too!
    }

  });

})(jQuery);
