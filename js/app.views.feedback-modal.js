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
      var item = this.model;
      var that = this;
      $(this.el).html(this.template());
      $(this.el).children('.feedbackModal').children('.modal-body').append(this.item_template(this.model.attributes));
      console.log($(that.el).find(".score-distribution"));
      var barChart = new app.BarChart({
        model:[{x: item.get('score_1'), y: 'Presentation'}, {x: item.get('score_2'), y: 'The Market'}, {x: item.get('score_3'), y: 'Business Model'}, {x: item.get('score_4'), y: 'Marketing Page'}, {x: item.get('score_5'), y: 'Prototype'}],
        xName: "score",
        outer_width: 240,
        outer_height: 100,
        el: $(that.el).find(".score-distribution").selector
      }).render();

      $(this.el).children('.feedbackModal').modal('show');
      return this;
    }
  });
})(jQuery);