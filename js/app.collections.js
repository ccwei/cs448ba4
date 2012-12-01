// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.FeedbackCollection = Backbone.Collection.extend(
    (function(){
      return  {
        model: window.app.Feedback
      };
    })()
  );

  app.ReviewDir = Backbone.Collection.extend(
    (function(){ //use anonymous function here so we can have private variable for this class
      var total = {};
      var that;
      return  {
        model: window.app.Review,
        comparator: function(a, b){
          return a.attributes.score - b.attributes.score;
        },
        initialize: function() {
          that = this;
          // console.log("ReviewDir.Models");
          // console.log(this);
          // that.initPos();  -- should be called here but a bug theat cause this.models to be null prevent us from calling it here!!
        },
        initPos: function(){
          var reviewData = _(this.models).pluck('attributes');
          reviewData.forEach(function(d) {
            if(!total[d.score]) {
              d.y0 = total[d.score] = 0;
              d.y1 = total[d.score] = 1;
            } else {
              d.y0 = total[d.score];
              d.y1 = total[d.score] = d.y0 + 1;
            }
            d.total = d.y1;
          });
        },
        total: function(score){
          //return total number of review with each score
          return total[score];
        }


        //TODO(kanitw): implement filter & event
      };
    })()
  );
})(jQuery);