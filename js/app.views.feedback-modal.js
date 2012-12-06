// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.FeedbackModalView = Backbone.View.extend({
    el: "#feedback-modal",
    tagName: "div",
    className: "feedback-modal",
    template: _.template($("#feedbackModalTemplate").html()),
    item_template: _.template($("#feedbackGridTemplate").html()),

    initialize: function() {
      this.render();
    },
    render: function () {
      $(this.el).html(this.template());
      $(this.el).children('.feedbackModal').children('.modal-body').append(this.item_template(this.model.attributes));
      $(this.el).children('.feedbackModal').modal('show');
      return this;
    }
  });
})(jQuery);