// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};
  app.FeedbackView = Backbone.View.extend({
      className: "feedback-container",
      template: _.template($("#feedbackGridTemplate").html()),

      render: function () {
          // console.log(this.model);
          $(this.el).html(this.template(this.model.toJSON()));
          return this;
      }
  });
})(jQuery);