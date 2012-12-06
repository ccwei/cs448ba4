// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.FeedbacksView = Backbone.View.extend({
    template: _.template($("#feedbacksTemplate").html()),
    item_template: _.template($("#feedbackGridTemplate").html()),
    tagName: "div",
    className: "feedbacks-view",

    initialize: function () {
      if(this.collection){
        this.loadData(this.collection);
      }
    },

    loadData: function(collection){
      this.collection = new app.FeedbackCollection(collection);
      this.render();
    },
    render: function () {
      var that = this;

      this.$el.html(this.template());

      _.each(this.collection.models, function (item) {
        // that.renderFeedback(item);
        this.$el.find('.feedbacks')
          .append(this.item_template(item.toJSON()))
          .append("<hr/>");


        this.$el.find(".indscores").append("Put your render of indscore view here!");


      }, this);

      // _.each(this.collection.models, function (item) {
      //     that.renderFeedback(item);
      // }, this);

      return this;
    }

  });
})(jQuery);