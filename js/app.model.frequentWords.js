// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
  app.FrequentWords = Backbone.Model.extend((function(){
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
        var max_length = 12;
        var topWords = tuples.filter(function(w){ return w[0].length < max_length && app.stopWords.indexOf(w[0]) == -1; });

        //Select top frequent k words
        topWords = topWords.slice(0, 50);
        return topWords;
      };
      var processWord = function (review, words, type) {
        var feedbacks = "";
        if(type && type!=="all") {
          feedbacks = review[type]; //If specify type, only select review for that type
        } else {
          _(app.FEEDBACK_TYPE).each(function (t) {
            feedbacks += ' ';
            feedbacks += review[t]; //Concat different type review(notable, ideas..) into one string.
          });
        }
        _(feedbacks.split(" ")).each(function (w) {
            words.push([w,review]);
        });
      };

      return {
        initialize: function(reviews, type) {
          var that = this;
          this.feedbackWords = [];
          _(reviews).each(function(r) {
            processWord(r, that.feedbackWords, type);
          });

          this.feedbackWords = findTopWords(this.feedbackWords);
          this.feedbackWordsCount = {};
          _(this.feedbackWords).each(function(d){
            that.feedbackWordsCount[d[0]] = d[1].count;
          });
          //TODO: find better count to be maxCount
          if(this.feedbackWords[0]) {
            this.maxCount = this.feedbackWords[0][1].count;
          } else {
            this.maxCount = 1;
          }
        }
      };
    })()
  );
})(jQuery);