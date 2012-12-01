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


    return {

      initialize: function(){
        //put default option into init if need
        _(this.options).defaults({
          outer_width: 960,
          outer_height: 500,
          margin: {top: 25, right: 20, bottom: 30, left: 40}
        });
        var options = this.options;
        this.onItemSelected = options.onItemSelected || function() { /*do nothing*/ };
        this.onItemDeselected = options.onItemDeselected || function() { /*do nothing*/ };
      },
      render: function(){
        var options = this.options;
        console.log(options);

        var outer_width = options.outer_width;
        var outer_height = options.outer_height;
        var margin = options.margin;

        var width = outer_width - margin.left - margin.right,
        height = outer_height - margin.top - margin.bottom;

        //render
        var that = this;

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

        var x,y,xAxis,yAxis,svg;
        var data=_(this.collection.models).pluck('attributes');
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



        var state = svg.selectAll(".state")
                  .data(data)
                .enter().append("g")
                  .attr("class", "g")
                  .attr("transform", function(d) { return "translate(" + x(d.score) + ",0)"; });
        var rects = state.append("rect");

        rects.classed("bar-rect",true)
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.y1); })
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .on("click", function(d) {
              var selected = d3.select(this).classed('selected');
              console.log(this,selected);
              rects.each(function(r){
                d3.select(this).classed('selected',function(){
                  return !selected && r===d; //the select must not be previously selected and is the clicked item.
                });
              });
              if(!selected){
                that.onItemSelected(d);
              }else{
                that.onItemDeselected(d);
              }

              // console.log("click :" , d);
            });
        return this;
      }
    };
  })()
  );

})(jQuery);
