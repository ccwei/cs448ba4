// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  var total = 0;

  //View for the reviewee
  app.RevieweeList = Backbone.View.extend({
    template: _.template($("#revieweeListTemplate").html()),
    // el: $("#ind-right-side"), //TODO(kanitw): use this when we use template!
    initialize: function () {

    },
    loadData: function(reviewee){

    }


  });

})(jQuery);
