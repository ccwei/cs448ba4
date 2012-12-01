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
          console.log("RENDER");
          $(that.el).html("");

         // console.log('myscore');
         // console.log(scores);

         //  _.each(scores, function(item) {
         //    console.log("score= ");
         //    console.log(item);
         //  });

          $(that.el).html("");
          _.each(that.collection.models, function (item) {
            console.log(item);
              that.renderFeedback(item);
          }, that);
          return this;


            // var tmpl = _.template(this.template);
            // $(this.el).html(tmpl(this.model.toJSON()));
            // // $(this.el).html(tmpl);
            // return this;
        },

        renderFeedback: function (item) {
            console.log('renderFeedback');
            console.log(item);
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