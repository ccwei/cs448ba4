// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};
  app.FEEDBACK_TYPE = ["notable","constructive","questions","ideas"];

  app.Reviewee = Backbone.Model.extend({});
  app.Feedback = Backbone.Model.extend({});
  app.IndScore = Backbone.Model.extend({});

})(jQuery);