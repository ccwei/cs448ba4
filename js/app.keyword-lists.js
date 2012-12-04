// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  app.KeywordListsView = Backbone.View.extend({
    initialize: function () {
      var that = this;
      //this.collection = new app.FeedbackCollection(this.collection);
      this.frequentWords = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.frequentWords[type] = new app.FrequentWords(this.model, type);
      });
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

      this.keywordLists = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.keywordLists[type] = new app.KeywordListView({
          model: that.frequentWords[type],
          id: "agg-tab-keyword-list-" + that.viewId + " .keyword-list-" + type,
          outer_width: 400,
          outer_height: 400
        });
      });

      return this;
    }

  });
})(jQuery);