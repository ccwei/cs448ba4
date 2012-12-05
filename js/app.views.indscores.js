// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  //View for the reviewee
  app.IndScoresView = Backbone.View.extend({
    // el: "#indscore",
    // tagName: "indscores",
    // className: "indscores-container",
    // template: $("#indScoreTemplate").html(),

    initialize: function (collection) {

      // FIXME initialize should not override parameter
      // put in the collection when calling constructor instead.
      if(this.collection){
        this.loadData(this.collection);
      }


    },
    loadData: function(collection){
      this.collection = new app.IndScoreCollection(collection);
      // console.log(data);
      // this.model = new app.IndScore({score: 1});
      this.render();
    },

    render: function () {
      var that =this;
      $(this.el).html("");

     // console.log('myscore');
     // console.log(scores);

     //  _.each(scores, function(item) {
     //    console.log("score= ");
     //    console.log(item);
     //  });

      $(this.el).html("");
      _.each(this.collection.models, function (item) {
          that.renderFeedback(item);
      }, this);

      var indScoreViewClassName = new app.IndScoreView().className;

      $('.' + indScoreViewClassName).delegate('span', 'click', function (d) {
          console.log(" clicked!", d);
          // var reviewIdx = $(this).index() - 1;
          // var feedbackModal = new app.FeedbackModalView({model: that.collection.models[reviewIdx]});
          // //TODO: link back to one by one view for the review idx reviewIdx
        });
      return this;
    },

    renderFeedback: function (item) {
        var indScoreView = new app.IndScoreView({
            model: item
        });



        $(this.el).append(indScoreView.render().el);
        $(this.el).append("<hr/>");
    }

  });
})(jQuery);