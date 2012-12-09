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
      this.render(reviewee);
    },
    render: function () {

      this.$el.html(this.template(this.model.toJSON()));

      var indTeamReviews = [];
      _(this.model.get('reviews')).each(function (r) {
        indTeamReviews.push({teamid: r.user_id, score: Math.round(r.score), reviews:[r]});
      });
      console.log(this.$el.selector);
      console.log(this.$el.find(".revieweeDetailchart").selector);

      var indChart = new app.StackedChart({
        collection: new app.RevieweeCollection(indTeamReviews),
        outer_width: 200,
        outer_height: 120,
        el: this.$el.find(".revieweeDetailchart").selector,
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