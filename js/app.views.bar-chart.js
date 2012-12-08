// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  var DO_NOTHING = function() { /*do nothing*/ };
  /*
   * additional properties
   * - outer_width
   * - outer_height
   * - onItemClick: function()
   */


  app.BarChart = Backbone.View.extend({
    //TODO(kanitw): register to ReviewDir's event

    initialize: function(){
      //put default option into init if need
      _(this.options).defaults({
        outer_width: 200,
        outer_height: 200,
        showYAxis: true,
        showBgRects: false,
        xDomain: false //override with range to for domain of X
      });

      _(this.options).defaults({
        margin: {top: 25, right: 20, bottom: 30, left: 120}
      });


      var options = this.options;
      this.onItemSelected = options.onItemSelected || DO_NOTHING;
      this.onItemDeselected = options.onItemDeselected || DO_NOTHING;
      this.onBrushed = options.onBrushed || DO_NOTHING;
      this.onUnbrushed = options.onUnbrushed || DO_NOTHING;
      this.tooltip = options.tooltip;
      this.xName = options.xName || "score";
    },
    render: function(){
      var options = this.options;
      var xName = this.xName;
      // console.log(options);

      var outer_width = options.outer_width;
      var outer_height = options.outer_height;
      var margin = options.margin;
      var el = options.el;
      var width = outer_width - margin.left - margin.right,
      height = outer_height - margin.top - margin.bottom;

      //render
      var that = this;
      var yAxis, brush,rects,state, rangeBand;
      var data = this.model;
      var x0 = Math.max(0, 9);
      var x = d3.scale.linear()
          .domain([0, x0])
          .range([0, width]);
      var y = d3.scale.ordinal()
          .domain(_(data).pluck('y'))
          .rangeRoundBands([0, height], 0.1);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("top")
          .tickFormat(d3.format("d"));

          yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var svg = d3.select(el).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", function(d) { return d.x < 0 ? "bar negative" : "bar positive"; })
          .attr("x", function(d) { return x(Math.min(0, d.x)); })
          .attr("y", function(d, i) { return y(d.y); })
          .attr("width", function(d) { return Math.abs(x(d.x) - x(0)); })
          .attr("height", y.rangeBand());

      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y1", 0)
          .attr("y2", height);
      }
  });

})(jQuery);
