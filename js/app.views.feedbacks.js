// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  var total = 0;

  app.FeedbacksView = Backbone.View.extend({
    template: _.template($("#feedbacksTemplate").html()),
    item_template: _.template($("#feedbackGridTemplate").html()),
    score_template: _.template($("#indScoreTemplate").html()),
    tagName: "div",
    className: "feedbacks-view",

    initialize: function () {
      this.viewId = ++total;
      if(this.collection){
        this.loadData(this.collection);
      }
    },

    loadData: function(collection){
      this.collection = new app.FeedbackCollection(collection);
      this.render();
    },
    render: function () {
      var that = this;

      this.$el.html(this.template());


      _.each(this.collection.models, function (item) {
        // that.renderFeedback(item);
        // console.log(item.atrributes);
        // d3.select(".score-distribution").append("div").attr("class", "chart");
        var $feedbackDiv = $(this.item_template(item.toJSON()) );
        $feedbackDiv.find(".score-distribution").each(function(){
          var barChart = new app.BarChart({
            model:[{x: item.get('score_1'), y: 'Presentation'}, {x: item.get('score_2'), y: 'The Market'}, {x: item.get('score_3'), y: 'Business Model'}, {x: item.get('score_4'), y: 'Marketing Page'}, {x: item.get('score_5'), y: 'Prototype'}],
            xName: "score",
            outer_width: 400,
            outer_height: 100,
            el: this
          }).render();
        });
        this.$el.find('.feedbacks')
          .append($feedbackDiv)
          .append("<hr/>");
          // .append(this.score_template(item.toJSON()));

        // var d3place = d3.select(".feedbacks .score-distribution");
        // d3place.append("hahah");

        //this.$el.find('.indscores')
        //
        this.$el.find('.affix')
          .append(this.score_template(item.toJSON()))
          .append("<hr/>");


        // this.$el.find(".indscores").append("Put your render of indscore view here!");


      }, this);

      var $affix = this.$el.find('.affix');


      // _.each(this.collection.models, function (item) {
      //     that.renderFeedback(item);
      // }, this);

      return this;
    }

  });
})(jQuery);