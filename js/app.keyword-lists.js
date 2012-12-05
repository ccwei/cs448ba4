// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  app.KeywordListsView = Backbone.View.extend({
    tagName: "div",
    className: "keywordlists-frame",
    template: _.template($("#keywordListsFrameTemplate").html()),

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

      this.keywordLists = {};

      _(app.FEEDBACK_TYPE).each(function (type) {
        _(that.frequentWords[type].feedbackWords).each(function (d) {
          //d is like ["nice", {count:17, reviews: array of review}]
          $('#' + that.$el.attr('id') + " .keyword-list-" + type + ' ol').append($('<li/>').append(d[0]));
        });
      });

      return this;
    }

  });
})(jQuery);