// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.Reviewee = Backbone.Model.extend({}); //no special property for "reviewee" yet

  app.RevieweeDir = Backbone.Collection.extend(
    (function(){ //use anonymous function here so we can have private variable for this class
      var total={};
      return  {
        model: window.app.Reviewee,
        initialize: function() {

          _(this.models).pluck('attributes').forEach(function(d) {
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
          //return total number of reviewee with each score
          return total[score];
        }

        //TODO(kanitw): implement filter & event

      };
    })()
  );

  app.StackedChart = Backbone.View.extend((function(){ //use anonymous function here so we can have private variable for this class

    //TODO(kanitw): register to RevieweeDir's event

    var x,y,xAxis,yAxis,svg,data;
    var outer_width = 960,
        outer_height = 500,
        margin = {top: 20, right: 20, bottom: 30, left: 40};

    return {
      initialize: function(){
        data = _(this.collection.models).pluck('attributes');
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

        svg = d3.select("body").append("svg")
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
            .on("click", function(d) {console.log("click :" , d);})
            .style("fill", "Blue");
      }
    };
  })()
  );

})(jQuery);