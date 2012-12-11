// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
  app.FrequentBigram = Backbone.Model.extend((function(){    
      var findTopWords = function (words) {
        var freq = {};
        _(words).each(function(w, index){
          var first = w[0][0];
          var second = w[0][1];
          var review = w[1];

          // simply remove all punctuations and digits e.g. awesome and awesome! should mean the same
          // use jQuery.trim() for instead
          first = $.trim(first);
          first = first.replace(/\d+|[\.,-\/#"!?+<>'$%\^&\*;:{}=\[\]\-_`~()]/g, '');
          
          second = $.trim(second);
          second = second.replace(/\d+|[\.,-\/#"!?+<>'$%\^&\*;:{}=\[\]\-_`~()]/g, '');
          

          if(first.length>0 && second.length>0){

            // toLowerCase
            first  = first.toLowerCase();
            second  = second.toLowerCase();

            var bigram = first + " " + second;

            if(bigram in freq){
              freq[bigram].count++;
              freq[bigram].reviews.push(review);
            } else {
              freq[bigram] = {count: 1, reviews: [review]};
            }
          }
        });

        //Sort based Frequency
        var tuples = [];
        for(var key in freq) tuples.push([key, freq[key]]);
        tuples.sort(function(a, b){
          return b[1].count - a[1].count;
        });

        //Filter stop words and length limit
        var max_length = 12;
        var topWords = tuples.filter(function(w){
          var b = w[0].split(" ");
          return b[0].length < max_length && b[1].length < max_length && b.length <= 2 && app.stopWords.indexOf(b[0]) == -1 && app.stopWords.indexOf(b[1]) == -1;
        });

        //Select top frequent k bigram
        topWords = topWords.slice(0, 50);

        return topWords;
      };
      var processWord = function (review, words, type) {
        var feedbacks = "";
        if(type  && type!=="all" ) {
          feedbacks = review[type]; //If specify type, only select review for that type
        } else {
          _(app.FEEDBACK_TYPE).each(function (t) {
            feedbacks += ' ';
            feedbacks += review[t]; //Concat different type review(notable, ideas..) into one string.
          });
        }

        var feedbacksSplit = feedbacks.split(" ");

        // var words2 = [];
        for(var i=0;i<feedbacksSplit.length-1;i++){
          var first = feedbacksSplit[i];
          var second = feedbacksSplit[i+1];

          words.push([[first, second],review]);
        }

        // _(feedbacks.split(" ")).each(function (w) {
        //     words.push([w,review]);
        // });
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
        }
      };
    })()
  );
})(jQuery);