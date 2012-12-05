// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  app.KeywordListsView = Backbone.View.extend({
    tagName: "div",
    className: "keywordlists-frame",
    template: _.template($("#keywordListsFrameTemplate").html()),
    keyword: "",
    liOnclick: function() {},

    initialize: function () {
      var that = this;
      this.frequentWords = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        that.frequentWords[type] = new app.FrequentWords(that.model, type);
      });
      this.$el.html(this.template());
      //Add search field
      var onSearchTextChange = function(){
        that.keyword = $(this).val();
        that.render();
      };

      this.$el.prepend(_.template($("#searchFieldTemplate").html())());
      this.$el.find(".search-field").on('change',onSearchTextChange);
      this.$el.find(".search-field").on('keyup',onSearchTextChange);
      this.render();
    },
    setliOnclick: function (liOnclick) {
      var that = this;
      this.liOnclick = liOnclick;
      this.$el.delegate('li', 'click', function(event) {
            that.liOnclick(event);
        });
    },
    render: function () {
      var that = this;

      this.keywordLists = {};

      _(app.FEEDBACK_TYPE).each(function(type){
        $(that.$el.selector + " .keyword-list-" + type + ' ol').children().remove();
      });
      var matchCount = 0;
      var maxCount = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        _(that.frequentWords[type].feedbackWords).each(function (d) {
          //d is like ["nice", {count:17, reviews: array of review}]
          if(that.keyword.length === 0 || d[0].match(new RegExp(that.keyword, "i"))){
            if(!maxCount[type] || maxCount[type] < d[1].count)
              maxCount[type] = d[1].count;
            var li = $('<li/>').append(d[0] + ' (' + d[1].count + ')');
            li.addClass('clickable keyword');
            matchCount++;
            if(that.keyword.length > 0){
              console.log(li);
              li.highlight(that.keyword);
            }
            var bar = $('<div/>').addClass('keyword-item-bar');
            $(that.$el.selector + " .keyword-list-" + type + ' ul').append(bar).append(li);
            var percentage = (d[1].count * 1.0) / maxCount[type];
            bar.width(percentage * 80 + '%');
          }
        });
      });

      if(that.keyword.length>0){
        this.$el.find(".found-count").html("("+matchCount+" Found)");
      }else {
        this.$el.find(".found-count").html("");
      }

      return this;
    }

  });
})(jQuery);
