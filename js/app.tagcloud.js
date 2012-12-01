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
    var divid;

    var stopWords = ["i", "you","?", "(", ")", ".", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the", "."];

    var findTopWords = function (words) {
      var freq = {};
      _(words).each(function(w, index){
        // simply remove all punctuations and digits e.g. awesome and awesome! should mean the same
        // use jQuery.trim() for instead
        w[0] = w[0].replace(/\d+|[\.,-\/#"!?+<>'$%\^&\*;:{}=\[\]\-_`~()]/g, '');
        w[0] = $.trim(w[0]);

        if(w[0].length>0){
          // toLowerCase
          w[0] = w[0].toLowerCase();
          if(w[0] in freq){
            freq[w[0]].count++;
            freq[w[0]].reviews.push(w[1]);
          } else {
            freq[w[0]] = {count: 1, reviews: [w[1]]};
          }
        }
      });

      //Sort based Frequency
      var tuples = [];
      for(var key in freq) tuples.push([key, freq[key]]);
      tuples.sort(function(a, b){
        return b[1].count - a[1].count;
      });
      //Filter stop words
      var topWords = tuples.filter(function(w){ return stopWords.indexOf(w[0]) == -1; });

      //Select top frequent k words
      topWords = topWords.slice(0, 50);
      console.log("topWords = ", topWords);
      return topWords;
    };

    return {
      initialize: function(id){
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
        divid = '#' + id;
      },

      loadData: function(words) {
        words = findTopWords(words);
        data = words;
        console.log("words = ", data);

        //TODO: find better count to be maxCount
        maxCount = words[5][1].count;
        this.render();
      },

      render: function(){
        function draw(words) {
          console.log("id = ", divid);
          d3.select(divid).append("svg")
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
