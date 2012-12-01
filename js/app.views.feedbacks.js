// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.FeedbacksView = Backbone.View.extend(
    (function(){
      var that;
      return {

        initialize: function () {
          that=this;
          that.collection = new app.FeedbackCollection(that.collection);
          that.render();
        },
        render: function () {

          $(that.el).html("");
          _.each(that.collection.models, function (item) {
              that.renderFeedback(item);
          }, that);
          return this;
        },
        renderFeedback: function (item) {
            var feedView = new app.FeedbackView({
                model: item
            });
            $(this.el).append(feedView.render().el);
            $(this.el).append("<hr/>");
        }
      };
    })()
  );
})(jQuery);