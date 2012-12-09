// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
  app.FrequentWords = Backbone.Model.extend((function(){
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