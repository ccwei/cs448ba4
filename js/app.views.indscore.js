// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};
  app.IndScoreView = Backbone.View.extend({
      tagName: "indscore",
      className: "indscore-container",
      template: $("#indScoreTemplate").html(),

      render: function () {
          console.log("IndScoreView.render()");
          // console.log(this.model);
          var tmpl = _.template(this.template);
          $(this.el).html(tmpl(this.model.toJSON()));
          return this;
      }
  });
})(jQuery);