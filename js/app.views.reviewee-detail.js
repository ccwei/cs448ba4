// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  //View for the reviewee
  app.RevieweeDetailView = Backbone.View.extend({
    tagName: "reviewee",
    className: "reviewee-container",
    template: _.template($("#revieweeDetailTemplate").html()),
    initialize: function () {
      if(this.options.hasOwnProperty['data']){
        this.loadData(this.options.data);
      }
    },
    loadData: function(reviewee){

      this.model = reviewee;
      // console.log(this.model);
      this.render(reviewee);
    },
    render: function (reviewee) {

      this.$el.html(this.template(this.model.toJSON()));

      var indTeamReviews = [];
      _(reviewee.get('reviews')).each(function (r) {
        indTeamReviews.push({teamid: r.user_id, score: Math.round(r.score), reviews:[r]});
      });

      var indChart = new app.StackedChart({
        collection: new app.RevieweeCollection(indTeamReviews),
        outer_width: 200,
        outer_height: 150,
        el: "#revieweeDetailchart",
        showYAxis:false,
        showBgRects: true,
        onItemSelected: function(d){
          var feedbackModal = new app.FeedbackModalView({
            model: new app.Feedback(d.get('reviews')[0])
          });
        },
        onItemDeselected: function(d){},
        xDomain: _.range(1,10)

      });
      indChart.render();
      return this;
    }
  });
})(jQuery);