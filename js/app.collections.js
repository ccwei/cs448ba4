// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.IndScoreCollection = Backbone.Collection.extend({
    model: window.app.IndScore
  });

  app.FeedbackCollection = Backbone.Collection.extend({
    model: window.app.Feedback
  });

  app.RevieweeCollection = Backbone.Collection.extend({
    comparator: function(a, b){
      return a.get('score') - b.get('score');
    }
  });

})(jQuery);