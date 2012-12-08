// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};
  var DO_NOTHING = function() { /*do nothing*/ };

  var total = 0;

  //View for the reviewee
  app.GlobalFilter = Backbone.View.extend({
    item_template: _.template($("#revieweeListItemTemplate").html()),
    // el: $("#ind-right-side"), //TODO(kanitw): use this when we use template!
    initialize: function () {

    },
    // events: {
    //   "click .reviewee-list-item": "onItemClicked"
    // },
    loadData: function(newCollection){

    },
    render: function(){

    }
  });

  // app.RevieweeListItem = Backbone.View.extend({
  //   template: _.template($("#revieweeListItemTemplate").html()),
  //   render: function(){

  //   }
  // });

})(jQuery);
