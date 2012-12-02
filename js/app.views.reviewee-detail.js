// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  //View for the reviewee
  app.RevieweeDetailView = Backbone.View.extend(
    (function(){
      return {
        el: "#reviewee", //TODO(kanitw): make sure we need this line.
        tagName: "reviewee",
        className: "reviewee-container",
        template: $("#revieweeDetailTemplate").html(),
        initialize: function (reviewee) {
            this.model = new app.Reviewee({name: reviewee.teamid});

            this.render(reviewee);
        },
        render: function (reviewee) {
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl(this.model.toJSON()));

            var indTeamReviews = [];
            _(reviewee.reviews).each(function (r) {
              indTeamReviews.push({teamid: r.user_id, score: Math.round(r.score), reviews:[r]});
            });
            var reviewDir = new app.ReviewDir(indTeamReviews);
            reviewDir.initPos(); //need to be called here

            var indChart = new app.StackedChart({
              collection: reviewDir,
              outer_width: 200,
              outer_height: 150,
              el: "#revieweeDetailchart",
              onItemSelected: function(d){
                showIndividualView(true);
                console.log("onItemClick: ");
                console.log(d);
                var feedbackModal = new app.FeedbackModalView(new app.Feedback(d.reviews[0]));
              },
              onItemDeselected: function(d){
              }
            });
            indChart.render();
            return this;
        }
      };
    })()
  );
})(jQuery);