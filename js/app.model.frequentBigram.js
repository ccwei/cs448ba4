// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
  app.FrequentBigram = Backbone.Model.extend((function(){
      var stopWords = ["http", "i", "you","?", "(", ")", ".", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the", "."];

      var findTopWords = function (words) {
        var freq = {};
        _(words).each(function(w, index){
          var first = w[0][0];
          var second = w[0][1];
          var review = w[1];

          // simply remove all punctuations and digits e.g. awesome and awesome! should mean the same
          // use jQuery.trim() for instead
          first = first.replace(/\d+|[\.,-\/#"!?+<>'$%\^&\*;:{}=\[\]\-_`~()]/g, '');
          first = $.trim(first);

          second = second.replace(/\d+|[\.,-\/#"!?+<>'$%\^&\*;:{}=\[\]\-_`~()]/g, '');
          second = $.trim(second);

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
        //Filter stop words
        var topWords = tuples.filter(function(w){
          var b = w[0].split(" ");
          return stopWords.indexOf(b[0]) == -1 && stopWords.indexOf(b[1]) == -1;
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
          //TODO: find better count to be maxCount
          this.maxCount = this.feedbackWords[0][1].count;
        }
      };
    })()
  );
})(jQuery);