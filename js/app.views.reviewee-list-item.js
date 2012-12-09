// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  var total = 0;
  //View for the revieweeListItem
  app.RevieweeListItemView = Backbone.View.extend({
    tagName: "revieweeListItem",
    className: "revieweeListItem-container",
    template: _.template($("#revieweeListItemTemplate").html()),
    initialize: function () {
      this.viewId = ++total;
      if(this.options.hasOwnProperty['data']){
        this.loadData(this.options.data);
      }
      if(this.model) {
        this.model.set('viewId', this.viewId);
        this.render();
      }
      this.onItemClicked = this.options.onItemClicked || app.DO_NOTHING;
    },
    loadData: function (model) {
      if(model) {
        this.model = model;
        this.model.set('viewId', this.viewId);
      }
      this.render();
    },
    render: function () {
      var that = this;
      this.$el.html('');
      this.$el.show();
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.click(function (d) {
        console.log("click");
        that.onItemClicked(that.model);
      });
      var indTeamReviews = [];
      _(this.model.get('reviews')).each(function (r) {
        indTeamReviews.push({teamid: r.user_id, score: Math.round(r.score), reviews:[r]});
      });

      var indChart = new app.StackedChart({
        collection: new app.RevieweeCollection(indTeamReviews),
        outer_width: 180,
        outer_height: 100,
        el: "#revieweeDetailchart-" + that.viewId,
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
    },
    hide: function () {
     this.$el.hide();
    },
    show: function() {
      this.$el.show();
    }
  });
})(jQuery);