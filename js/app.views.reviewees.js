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
      _.each(_(reviewees).pluck('reviews'), function(r) {
        totalReviews = totalReviews.concat(r);
      });

      this.frequentWordsNotable = new app.FrequentWords(totalReviews, "notable");
      this.frequentWordsConstructive = new app.FrequentWords(totalReviews, "constructive");
      this.frequentWordsQuestions = new app.FrequentWords(totalReviews, "questions");
      this.frequentWordsIdeas = new app.FrequentWords(totalReviews, "ideas");
      this.renderTagCloud();
    },

    render: function(){
      //DO NOTHING since we haven't used the template for this view yet
      //TODO: not a bad idea to use template here too!
    },

    renderTagCloud: function() {
      var that = this;
      this.notableTagCloud = new app.TagCloud({
          model: this.frequentWordsNotable,
          id: "agg-tab-tag-cloud .tag-cloud-notable",
          outer_width: 400,
          outer_height: 400
      });
      setTimeout(function() {
        that.constructiveTagCloud = new app.TagCloud({
          model: that.frequentWordsConstructive,
          id: "agg-tab-tag-cloud .tag-cloud-constructive",
          outer_width: 400,
          outer_height: 400
        });
        that.questionsTagCloud = new app.TagCloud({
          model: that.frequentWordsQuestions,
          id: "agg-tab-tag-cloud .tag-cloud-questions",
          outer_width: 400,
          outer_height: 400
        });
        that.ideasTagCloud = new app.TagCloud({
          model: that.frequentWordsIdeas,
          id: "agg-tab-tag-cloud .tag-cloud-ideas",
          outer_width: 400,
          outer_height: 400
        });
      }, 1000);
    }

  });

})(jQuery);
