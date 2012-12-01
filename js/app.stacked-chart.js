// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  /*
   * additional properties
   * - outer_width
   * - outer_height
   * - onItemClick: function()
   */
  app.StackedChart = Backbone.View.extend((function(){ //use anonymous function here so we can have private variable for this class

    //TODO(kanitw): register to ReviewDir's event

    var x,y,xAxis,yAxis,svg,data;
    var outer_width = 960,
        outer_height = 500,
        margin = {top: 25, right: 20, bottom: 30, left: 40};
    var that;
    return {
      parseOptions: function(){
        var options = that.options;
        if(options.hasOwnProperty("outer_width")){
          outer_width = options.outer_width;
        }
        if(options.hasOwnProperty('outer_height')){
          outer_height = options.outer_height;
        }

        that.onItemClick = options.onItemClick || function() { /*do nothing*/ };
      },
      initialize: function(){

        //Init Collection and options

        // console.log("models", this.collection.models);
        data = _(this.collection.models).pluck('attributes');
        //not sure if this is the right way to do it
        that = this;

        that.parseOptions();
        var width = outer_width - margin.left - margin.right,
        height = outer_height - margin.top - margin.bottom;

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
            //.attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-15")
            .style("text-anchor", "middle")
            .text("# of Teams");

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
              that.onItemClick(d);
              // console.log("click :" , d);
            });
        return this;
      }
    };
  })()
  );

})(jQuery);
