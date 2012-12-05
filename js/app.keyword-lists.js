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
    render: function () {
      var that = this;

      this.keywordLists = {};

      _(app.FEEDBACK_TYPE).each(function(type){
        $(that.$el.selector + " .keyword-list-" + type + ' ol').children().remove();
      });
      var matchCount = 0;
      _(app.FEEDBACK_TYPE).each(function (type) {
        _(that.frequentWords[type].feedbackWords).each(function (d) {
          if(that.keyword.length === 0 || d[0].match(new RegExp(that.keyword, "i"))){
            var li = $('<li/>').append(d[0]);
            matchCount++;
            if(that.keyword.length > 0){
              console.log(li);
              li.highlight(that.keyword);
            }
            $(that.$el.selector + " .keyword-list-" + type + ' ol').append(li);
          }
          //d is like ["nice", {count:17, reviews: array of review}]
          $('#' + that.$el.attr('id') + " .keyword-list-" + type + ' ol').append($('<li/>').append(d[0]));
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
