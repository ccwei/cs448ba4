// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.Review = Backbone.Model.extend({}); //no special property for "review" yet
  app.Reviewee = Backbone.Model.extend({});
  app.Feedback = Backbone.Model.extend({});

  //View for the reviewee
  app.RevieweeView = Backbone.View.extend(
    (function(){
      return {
        el: $("#reviewee"),
        tagName: "reviewee",
        className: "reviewee-container",
        template: $("#revieweeTemplate").html(),
        initialize: function (review) {
            this.model = new app.Reviewee({name: review.teamid});
            this.render();
        },
        render: function () {
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl(this.model.toJSON()));
            return this;
        }
      };
    })()
  );

//======Feedback=========
  app.FeedbackCollection = Backbone.Collection.extend(
    (function(){
      return  {
        model: window.app.Feedback
      };
    })()
  );

  app.FeedbackView = Backbone.View.extend({
        tagName: "feedback",
        className: "feedback-container",
        template: $("#feedbackTemplate").html(),

        render: function () {
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl(this.model.toJSON()));
            return this;
        }
    });

  app.FeedbacksView = Backbone.View.extend(
    (function(){
      return {
        el: '#feedbacks',

        initialize: function (feedbacks) {
            this.collection = new app.FeedbackCollection(feedbacks);
            this.render();
        },
        render: function () {
            var that = this;
            $(this.el).html("");
            _.each(this.collection.models, function (item) {
                that.renderFeedback(item);
            }, this);
        },
        renderFeedback: function (item) {
            var feedView = new app.FeedbackView({
                model: item
            });
            $(this.el).append(feedView.render().el);
        }
      };
    })()
  );

//======Feedback=========

  app.ReviewDir = Backbone.Collection.extend(
    (function(){ //use anonymous function here so we can have private variable for this class
      var total = {};
      var that;
      return  {
        model: window.app.Review,
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
        },

        showFeedback: function(d){
          var feedbacks = _.map(d.reviews, function(d) {
            return {notable: d.notable, constructive: d.constructive, questions: d.questions, ideas: d.ideas};
          });
          var f = new app.FeedbacksView(feedbacks);
          new app.RevieweeView(d);
          console.log("number of reviews: ", feedbacks.length);
        }
        //TODO(kanitw): implement filter & event
      };
    })()
  );

  app.StackedChart = Backbone.View.extend((function(){ //use anonymous function here so we can have private variable for this class

    //TODO(kanitw): register to ReviewDir's event

    var x,y,xAxis,yAxis,svg,data;
    var outer_width = 960,
        outer_height = 500,
        margin = {top: 20, right: 20, bottom: 30, left: 40};
    var that;
    return {
      initialize: function(){
        console.log("models", this.collection.models);
        data = _(this.collection.models).pluck('attributes');
        //not sure if this is the right way to do it
        that = this;
        console.log(data);

        var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        //init x, y, xAxis, yAxis, svg
        x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

        y = d3.scale.linear()
            .rangeRound([height, 0]);

        xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(d3.format(".2s"));

        svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d.score; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        //init x axis group on svg
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //init y axis group on svg
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");

        //For brush
        svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().x(x)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend))
          .selectAll("rect")
            .attr("height", height);

        function brushstart() {
          svg.classed("selecting", true);
        }

        function brushmove() {

        }

        function brushend() {
          svg.classed("selecting", !d3.event.target.empty());
          var s = d3.event.target.extent();
           /** To be factored **/
        }
      },
      render: function(){
        //render

        var state = svg.selectAll(".state")
                  .data(data)
                .enter().append("g")
                  .attr("class", "g")
                  .attr("transform", function(d) { return "translate(" + x(d.score) + ",0)"; });
        state.append("rect")
            .classed("bar-rect",true)
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.y1); })
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .on("click", function(d) {
              that.collection.showFeedback(d);
              console.log("click :" , d);});
      }
    };
  })()
  );

})(jQuery);