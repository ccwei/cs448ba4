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


  app.StackedChart = Backbone.View.extend({
    //TODO(kanitw): register to ReviewDir's event

    initialize: function(){
      //put default option into init if need
      _(this.options).defaults({
        outer_width: 960,
        outer_height: 500,
        showYAxis: true,
        showBgRects: false,
        xDomain: false //override with range to for domain of X
      });

      _(this.options).defaults({
        margin: {top: 25, right: 20, bottom: 30, left: (this.options.showYAxis? 30: 10)}
      });


      var options = this.options;
      this.onItemSelected = options.onItemSelected || DO_NOTHING;
      this.onItemDeselected = options.onItemDeselected || DO_NOTHING;
      this.onBrushed = options.onBrushed || DO_NOTHING;
      this.onUnbrushed = options.onUnbrushed || DO_NOTHING;
      this.tooltip = options.tooltip;
      this.xName = options.xName || "score";

      this.initPos();
    },
    initPos: function(){
      var xName = this.xName;
      var total = {};
      this.collection.models.forEach(function(d) {
        if(!total[d.get(xName)]) {
          d.y0 = total[d.get(xName)] = 0;
          d.y1 = total[d.get(xName)] = 1;
        } else {
          d.y0 = total[d.get(xName)];
          d.y1 = total[d.get(xName)] = d.y0 + 1;
        }
        d.total = d.y1;
      });
      return this;
    },
    highlightItem: function (reviewee) {
      var that = this;
      that.rects.classed("selected", function(d) {
        return d.get('teamid') === reviewee.get('teamid');
      });
    },
    unHighlightAll: function () {
      var that = this;
      that.rects.classed("selected", function(d) {
        return false;
      });
    },
    filterDataByTeamId: function (teamid) {
      var that = this;
      var filterData = [];
      //Hack when teamid lenght is less than than 2
      var classedRectInFiltered = function(className, teamid){
          that.rects.classed(className, function(d) {
            if(teamid.length < 2)
              return false;
            var id = d.get('teamid');
            return id.indexOf(teamid) != -1;
          });
      };

      if(teamid.length < 2) {
        classedRectInFiltered('brushed', "");
        that.onUnbrushed();
        return;
      }

      _(this.collection.models).each(function(reviewee) {
        var id = reviewee.get('teamid');
        if(id.indexOf(teamid) != -1) {
          filterData.push(reviewee);
        }
      });
      classedRectInFiltered('brushed', teamid);
      this.onBrushed(filterData);
      return filterData;
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
      var x,y,xAxis,yAxis,svg,brush,state, rangeBand;
      var models = this.collection.models;
      /**
       * Call classed given className for rect in the selection brush
       * @param  {[type]} className
       * @param  {[type]} s         d3.event.target.extent();
       */
      var classedRectInBrush = function(className, extent){
        if(extent[0] === extent[1]){
          // if the selection is empty!
          that.rects.classed(className,false);
        }else{
          that.rects.classed(className, function(d) {
            var _lx = x(d.get(xName));
            var _rx = _lx + x.rangeBand(d.get(xName));

            // console.log(s[0],_rx,_lx,s[1]);
            return extent[0] <= _rx && _lx <= extent[1];
          });
        }
      };

      var filterData = function(extent){
        var filterData = [];
        if(extent[0] !== extent[1]){
          _(models).each(function(reviewee) {
            var _lx = x(reviewee.get(xName));
            var _rx = _lx + x.rangeBand(reviewee.get(xName));
            if(extent[0] <= _rx && _lx <= extent[1]) {
              filterData.push(reviewee);
            }
          });
        }
        return filterData;
      };

      var brushstart = function () {
        svg.classed("selecting", true);
      };

      var brushmove = function () {
        var s = d3.event.target.extent();
        classedRectInBrush("brushing",s);
        clearSelectedRects();
      };

      var brushend = function () {
        svg.classed("selecting", !d3.event.target.empty());
        that.rects.classed("brushing",false);
        var s = d3.event.target.extent();
        classedRectInBrush("brushed",s);
        console.log("brushend");
        if(!d3.event.target.empty()){
          that.onBrushed(filterData(s));
        }else{
          that.onUnbrushed();
        }
      };

      var clearBrush = function(){
        if(!brush) return;  //we might not have a brush in case that we don't have onBrushed and onUnbrushed handlers.
        d3.select(".brush").call(brush.clear());
        that.rects.classed("brushed",false);
      };

      var clearSelectedRects = function(){
        that.rects.classed('selected',false);
      };

      //init x, y, xAxis, yAxis, svg
      x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
      y = d3.scale.linear()
          .rangeRound([height, 0]);

      xAxis = d3.svg.axis()
        .scale(x)
        // .tickSize(0)
        .orient("bottom");

      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("0d"))
        .ticks(5);

      svg = d3.select(el).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var xDomain = this.options.xDomain || models.map(function(d) { return d.get(xName); });
      var yMaxDomain = d3.max(models, function(d) { return d.total; });

      x.domain(xDomain );
      y.domain([0, yMaxDomain]);

      //init x axis group on svg
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      //init y axis group on svg
      if(this.options.showYAxis){
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            //.attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-20")
            .style("text-anchor", "middle")
            .text("# of Teams");
      }
      //For brush

      if(this.options.onBrushed || this.options.onUnbrushed ){
        //Don't create brush if we don't have handlers for  brush and unbrush
        svg.append("g")
          .attr("class", "brush")
          .call((brush = d3.svg.brush().x(x)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend))
          )
          .selectAll("rect")
            .attr("height", height);
      }

      if(this.options.showBgRects){
        var bg_rects = svg.append("g").attr("class","bg-rects")
          .selectAll(".bg-rect")
            .data(xDomain)
            .enter()
            .append("g")
              .attr("transform", function(d){
                return "translate("+x(d)+",0)";
              })
              .append("rect")
                .attr('class','bg-rect')
                .attr("width", x.rangeBand())
                .attr("height", y(0));
      }
      state = svg.selectAll(".state")
                .data(models)
              .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.get(xName)) + ",0)"; });
      this.rects = state.append("rect");

      var clickable = that.options.hasOwnProperty('onItemSelected') || that.options.hasOwnProperty('onItemDeselected');

      this.rects.classed("bar-rect",true)
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.y1); })
          .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          .classed("clickable",clickable)
          .on("click", function(d) {
            if(!clickable) return;
            var selected = d3.select(this).classed('selected');
            // console.log(this,selected);
            that.rects.each(function(r){
              d3.select(this).classed('selected',function(){
                return !selected && r===d; //the select must not be previously selected and is the clicked item.
              });
            });
            if(!selected){
              clearBrush();
              that.onItemSelected(d);
            }else{
              that.onItemDeselected(d);
            }

            // console.log("click :" , d);
          });
      if(this.tooltip)
        that.rects.append("svg:title")
          .text(this.tooltip);
      return this;
    }
  });

})(jQuery);
