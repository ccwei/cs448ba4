// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.TagCloud = Backbone.View.extend((function(){

    return {
      initialize: function(){
        this.data = this.model.feedbackWords;
        this.maxCount = this.model.maxCount;
        this.render();
      },

      render: function(){
        var x,y,xAxis,yAxis,svg;
        var outer_width = 320,
            outer_height = 320,
            margin = {top: 0, right: 0, bottom: 0, left: 0};
        var fill = d3.scale.category20();
        var width, height;
        var that = this;
        var draw = function (words) {
          d3.select(that.$el.selector + " svg").remove();
          d3.select(that.$el.selector).append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return d.size + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr('id', function(d) { return "id_" + d.text; })
              .attr('rel', 'popover')
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.text; })
              .on("click", function(d) {console.log("click :", d.text);});
        };

        var options = this.options;
        if(options.hasOwnProperty("outer_width")){
          outer_width = options.outer_width;
        }
        if(options.hasOwnProperty('outer_height')){
          outer_height = options.outer_height;
        }
        width = outer_width - margin.left - margin.right,
        height = outer_height - margin.top - margin.bottom;
        //render
        d3.layout.cloud().size([width, height])
          .words(this.data.map(function(d) {
            return {text: d[0], size: 5 + (d[1].count * 1.0)/that.maxCount * 90};
          }))
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .fontSize(function(d) { return d.size; })
          .on("end", draw)
          .start();

        return this;
      }
    };
  })()
  );

})(jQuery);
