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
    template: $("#feedbackModalTemplate").html(),

    initialize: function() {

    },
    render: function () {
        var feedbackView = new app.FeedbackView({ model: this.model});
        var tmpl = _.template(this.template);
        $(this.el).html(tmpl());
        $(this.el).children('.feedbackModal').children('.modal-body').append($(feedbackView.render().el).children('.feedback-grid'));
        $(this.el).children('.feedbackModal').modal('show');
        return this;
    }
  });
})(jQuery);