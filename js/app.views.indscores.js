// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  //View for the reviewee
  app.IndScoresView = Backbone.View.extend(
    (function(){
      var that;
      return {
        // el: "#indscore",
        // tagName: "indscores",
        // className: "indscores-container",
        // template: $("#indScoreTemplate").html(),

        initialize: function (data) {
          that = this;

          that.collection = new app.IndScoreCollection(that.collection);

          // console.log(data);





          // this.model = new app.IndScore({score: 1});
          this.render();

        },
        render: function () {
          $(that.el).html("");

         // console.log('myscore');
         // console.log(scores);

         //  _.each(scores, function(item) {
         //    console.log("score= ");
         //    console.log(item);
         //  });

          $(that.el).html("");
          _.each(that.collection.models, function (item) {
              that.renderFeedback(item);
          }, that);

          var indScoreViewClassName = new app.IndScoreView().className;

          $('.' + indScoreViewClassName).delegate('span', 'click', function (d) {
              console.log(" clicked!", d);
              // var reviewIdx = $(this).index() - 1;
              // var feedbackModal = new app.FeedbackModalView(that.collection.models[reviewIdx]);
              // //TODO: link back to one by one view for the review idx reviewIdx
            });
          return this;


            // var tmpl = _.template(this.template);
            // $(this.el).html(tmpl(this.model.toJSON()));
            // // $(this.el).html(tmpl);
            // return this;
        },

        renderFeedback: function (item) {
            var indScoreView = new app.IndScoreView({
                model: item
            });



            $(this.el).append(indScoreView.render().el);
            $(this.el).append("<hr/>");
        }

      };
    })()
  );
})(jQuery);