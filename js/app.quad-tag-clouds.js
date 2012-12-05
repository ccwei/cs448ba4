// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  app.TagCloudsView = Backbone.View.extend({
    tagName: "div",
    className: "tagclouds-frame",
    template: _.template($("#tagCloudsFrameTemplate").html()),

    initialize: function () {
      var that = this;
      this.frequentWords = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.frequentWords[type] = new app.FrequentWords(that.model, type);
      });
      this.$el.html(this.template());
      this.render();
    },

    render: function () {
      var that = this;
      this.tagClouds = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.tagClouds[type] = new app.TagCloud({
          model: that.frequentWords[type],
          el: $('#' + that.$el.attr('id') + " .tag-cloud-" + type),
          outer_width: 250,
          outer_height: 250
        });
      });

      return this;
    }

  });
})(jQuery);