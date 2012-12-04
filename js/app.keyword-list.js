// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  app.KeywordListView = Backbone.View.extend({
    initialize: function () {
      //this.collection = new app.FeedbackCollection(this.collection);
      this.render();
      //this.frequentWords = new app.FrequentWords(totalReviews);
      console.log(this.model.feedbackWords);
    },
    render: function () {
      var that = this;
      var id = this.options.id;
      console.log("id:", '#' + id + ' ol');
      _(this.model.feedbackWords).each(function (d) {
        $('#' + id + ' ol').append($('<li/>').append(d[0]));
      });
      return this;
    },
    renderFeedback: function (item) {
      var feedView = new app.FeedbackView({
          model: item
      });
      // console.log(this.el);
      // console.log(this.$el);
      console.log(this.$frame);
      this.$el.find("#feedbacks")
        .append(feedView.render().el)
        .append("<hr/>");

      this.$el.find("#indscores")
        .append("Put your render of indscore view here!");
    }

  });
})(jQuery);