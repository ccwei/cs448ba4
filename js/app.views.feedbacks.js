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
    smallgrid_template: _.template($("#smallGridTemplate").html()),
    scoreListItem_template: _.template($("#scoreListItem").html()),
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

      var byScore = {};

      _.each(this.collection.models, function (item) {
        // that.renderFeedback(item);
        // console.log(item.atrributes);
        // d3.select(".score-distribution").append("div").attr("class", "chart");
        var $feedbackDiv = $(this.item_template(item.toJSON()) );
        $feedbackDiv.find(".score-distribution").each(function(){
          var barChart = new app.BarChart({
            model:[{x: item.get('score_1'), y: 'Presentation'}, {x: item.get('score_2'), y: 'The Market'}, {x: item.get('score_3'), y: 'Business Model'}, {x: item.get('score_4'), y: 'Marketing Page'}, {x: item.get('score_5'), y: 'Prototype'}],
            xName: "score",
            outer_width: 300,
            outer_height: 100,
            el: this
          }).render();
        });
        console.log('score = ', item.get('score'));
        //this.$el.find('.average-score').html(item.get('score'));
        this.$el.find('.feedbacks')
          .append($feedbackDiv)
          .append("<hr class='feedback-hr'/>");
          // .append(this.score_template(item.toJSON()));

        // var d3place = d3.select(".feedbacks .score-distribution");
        // d3place.append("hahah");

        //this.$el.find('.indscores')
        //
        // this.$el.find('.affix')
        //   .append(this.score_template(item.toJSON()))
        //   .append("<hr/>");

        var roundedScore = Math.round(item.get('score'));

        if(byScore[roundedScore]){
          byScore[roundedScore].push(item);
        }else{
          byScore[roundedScore] = [item];
        }


        // this.$el.find(".indscores").append("Put your render of indscore view here!");


      }, this);

      var $indscores = this.$el.find('.indscores');

      for(var i=10 ; i>0 ; i--){
        if(byScore[i]){
          var items = byScore[i];

          var $group = $(this.scoreListItem_template({score:i}));
          var $groupGrids = $group.find(".grids");

          for(var j=0 ;j<items.length ; j++){
            var item = items[j];

            var $grid = $(this.smallgrid_template());

            for(var t=0 ; t<4 ; t++){
              var type = app.FEEDBACK_TYPE[t];
              var text = item.get(type);
              var len = _.isString(text) ? text.length : 0;

              var max = 260;
              var min = 20;

              var scale = (len-min)/(max-min);
              scale = Math.max(0,Math.min(1,scale));
              var opacity =scale *0.8 + 0.2 ;
              $grid.find("."+type).attr('style',"opacity:"+opacity+";");
            }

            $groupGrids.append($grid);
          }
          // var len = group;

          $indscores.append($group);

        }
      }


      // _.each(this.collection.models, function (item) {
      //     that.renderFeedback(item);
      // }, this);

      return this;
    }

  });
})(jQuery);