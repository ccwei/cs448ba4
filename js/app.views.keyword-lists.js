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
      this.showAll = false;
      var that = this;
      this.frequentWords = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        if(that.options.bigram){
          that.frequentWords[type] = new app.FrequentBigram(that.model, type);
        }else {
          that.frequentWords[type] = new app.FrequentWords(that.model, type);
        }

      });
      if(that.options.bigram){
        that.frequentWords['all'] = new app.FrequentBigram(that.model, 'all');
      }else{
        this.frequentWords['all'] = new app.FrequentWords(that.model,'all');
      }
      this.$el.html(this.template());
      //Add search field
      var onSearchTextChange = function(){
        that.keyword = $(this).val();
        that.render();
      };

      var onToggleView = function(){
        var $this = $(this);
        $this.toggleClass('toggled');
        that.showAll = !that.showAll;
        that.$el.find('.legend-blocks-container').toggle();
        that.render();
      };

      this.$el.find(".header-bar").append(_.template($("#searchFieldTemplate").html())())
        .find('a[rel="tooltip"]').tooltip({placement:'bottom'});


      this.$el.find(".search-field").on('change',onSearchTextChange);
      this.$el.find(".search-field").on('keyup',onSearchTextChange);
      this.$el.find(".toggle-view-btn").on('click',onToggleView);

      this.onWordClick = this.options.onWordClick || function() {};
      this.$el.delegate('li', 'click', function(event) {
            var text = $(this).find('.text').text();
            that.onWordClick(text);
      });
      this.render();
    },
    render: function () {

      if(this.showAll){
        this.renderMergedList.apply(this);
        this.$el.find(".seperated-view").addClass("display-none");
        this.$el.find(".all-view").removeClass("display-none");
      }else {
        this.renderSeparateList.apply(this);
        this.$el.find(".seperated-view").removeClass("display-none");
        this.$el.find(".all-view").addClass("display-none");
      }
    },
    renderMergedList: function(){
      var that = this;
      var type = 'all';
      var matchCount = 0;
      var maxCount = {};

      that.$el.find(".keyword-list-" + type + ' ul').children().remove();

      _(this.frequentWords[type].feedbackWords).each(function(d){
        if(that.keyword.length === 0 || d[0].match(new RegExp(that.keyword, "i"))){
          if(!maxCount[type] || maxCount[type] < d[1].count)
            maxCount[type] = d[1].count;
          var divInLi = that.renderDivInLi(d,that.keyword);
          var bar = $('<div/>').addClass('keyword-item-bar').addClass('parent');
          var percentage = (d[1].count * 1.0) / maxCount[type];
          bar.width(percentage * 100 + '%');

          var toprint=[];
          var x=0;
          _(app.FEEDBACK_TYPE).each(function (t) {
            var subbar = $('<div/>').addClass('keyword-item-bar-'+t);
            var count = that.frequentWords[t].feedbackWordsCount[d[0]];
            toprint.push(count);
            if(_.isNumber(count) && count > 0){
              var sub_percent = Math.floor(count * 10000.0 / d[1].count)/100.0; //need to floor other wise sum of them might slightly exceed 100%.
              subbar.width(sub_percent+"%");
              bar.append(subbar);
            }
          });

          var barparent = $('<div/>').addClass('keyword-item-container').append(bar);

          divInLi.prepend(barparent);
          that.$el.find(".keyword-list-" + type + ' ul').append($('<li/>').append(divInLi));
          //$(that.$el.selector + " .keyword-list-" + type + ' ul').append(li);
          matchCount++;
        }
      });
    },

    renderSeparateList: function(){
      var that = this;

      this.keywordLists = {};

      _(app.FEEDBACK_TYPE).each(function(type){
        $(that.$el.selector + " .keyword-list-" + type + ' ul').children().remove();
      });
      var matchCount = 0;
      var maxCount = {};
      _(app.FEEDBACK_TYPE).each(function (type) {
        _(that.frequentWords[type].feedbackWords).each(function(d){
          //d is like ["nice", {count:17, reviews: array of review}]
          if(that.keyword.length === 0 || d[0].match(new RegExp(that.keyword, "i"))){
            if(!maxCount[type] || maxCount[type] < d[1].count)
              maxCount[type] = d[1].count;
            //it is sort so we don't have to worry.

            var divInLi = that.renderDivInLi(d,that.keyword);
            var bar = $('<div/>').addClass('keyword-item-bar');
            var percentage = (d[1].count * 1.0) / maxCount[type];
            bar.width(percentage * 100 + '%');

            divInLi.prepend(bar);

            $(that.$el.selector + " .keyword-list-" + type + ' ul').append($("<li/>").append(divInLi));
            matchCount++;
          }
        });
      });

      if(that.keyword.length>0){
        this.$el.find(".found-count").html("("+matchCount+" Found)");
      }else {
        this.$el.find(".found-count").html("");
      }

      return this;
    },
    renderDivInLi: function(d,keyword){
      var textSpan = $("<span/>").addClass("text").append(d[0]);
      var countSpan = $("<span/>").addClass("count").append(d[1].count);
      var li = $('<div/>').addClass("divInLi").append(textSpan).append(countSpan);
      li.addClass('clickable keyword');

      if(keyword.length > 0){
        li.highlight(keyword);
      }
      return li;
    }

  });
})(jQuery);
