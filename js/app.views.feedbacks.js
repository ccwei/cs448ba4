// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.FeedbacksView = Backbone.View.extend({
    initialize: function () {
      this.collection = new app.FeedbackCollection(this.collection);
      this.render();
    },
    render: function () {
      var that = this;

      $(this.el).html("");
      _.each(this.collection.models, function (item) {
          that.renderFeedback(item);
      }, this);

      return this;
    },
    renderFeedback: function (item) {
        var feedView = new app.FeedbackView({
            model: item
        });
        $(this.el).append(feedView.render().el);
        $(this.el).append("<hr/>");
    }

  });
})(jQuery);