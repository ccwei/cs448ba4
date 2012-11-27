// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  app.TagCloud = Backbone.View.extend((function(){

    var x,y,xAxis,yAxis,svg,data;
    var outer_width = 500,
        outer_height = 500,
        margin = {top: 25, right: 20, bottom: 30, left: 40};
    var that;
    var fill = d3.scale.category20();
    var width, height;
    var maxCount;

    return {
      initialize: function(words){
        data = words;
        console.log(data);

        //TODO: find better count to be maxCount
        maxCount = words[5][1].count;

        //not sure if this is the right way to do it
        that = this;

        //load options
        var options = that.options;
        if(options.hasOwnProperty("outer_width")){
          outer_width = options.outer_width;
        }
        if(options.hasOwnProperty('outer_height')){
          outer_height = options.outer_height;
        }
        width = outer_width - margin.left - margin.right,
        height = outer_height - margin.top - margin.bottom;

        this.render();
      },

      render: function(){
        function draw(words) {
          d3.select("#tab-tag-cloud").append("svg")
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
              .on("click", function(d) {console.log("click :", d.text)});
        }
        //render
        d3.layout.cloud().size([width, height])
          .words(data.map(function(d) {
            console.log("d", d);
            return {text: d[0], size: 10 + (d[1].count * 1.0)/maxCount * 90};
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
