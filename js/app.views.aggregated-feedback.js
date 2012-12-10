// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  var total = 0;
  //TODO(kanitw): should be renamed to FeedbacksGroupedView ???
  app.FeedbacksAggregatedView = Backbone.View.extend({
    tagName: "div",
    className: "aggregated-feedback-frame",
    template: _.template($("#aggregatedFeedbackFrameTemplate").html()),

    el: $('#ind-tab-aggregate-grid'),
    keyword: "",

    initialize: function () {
      var that = this;
      this.viewId = total++;
      this.$el.html(this.template({viewId: this.viewId}))
        .delegate('li', 'click', function () { //WARNING(kanitw): delegate is deprecated
          var reviewIdx = $(this).index();
          var feedbackModal = new app.FeedbackModalView({
            model: that.collection.models[reviewIdx]
          });
          //TODO: link back to one by one view for the review idx reviewIdx
      });
      this.$el.children(".header-bar").append(_.template($("#searchFieldTemplate").html())());
      console.log('initialize feedbacks aggregate view');
      that.$el.find('[class*=link-notable]').click(function (event) {
        $('#all-right-side .lower').animate({
            scrollTop: '0px'}, 'fast'
          );
        $('#ind-right-side .lower').animate({
            scrollTop: '0px'}, 'fast'
          );
      });
      /*_(app.FEEDBACK_TYPE).each(function (t) {
        var linkSelector = '.link-' + t;
        that.$el.find(linkSelector).click(function (event) {
          $('#all-right-side .lower').animate({
            scrollTop: (that.$el.find('.feedback_' + t).offset().top)+'px'}, 'slow'
          );
          event.preventDefault();
          console.log(that.$el.find('.feedback_' + t));
          console.log(that.$el.find('.lower'));
        });
      });*/
    },
    loadData: function(feedbacks){
      this.collection = new app.FeedbackCollection(feedbacks);
      this.render();
      return this;
    },

    render: function () {
      var that = this;

      var onSearchTextChange = function(){
        that.keyword = $(this).val();
        that.renderFeedbacks();
      };

      this.$el.find(".search-field").on('change',onSearchTextChange);
      this.$el.find(".search-field").on('keyup',onSearchTextChange);

      this.renderFeedbacks();
    },
    setSearchWord: function (word) {
      this.$el.find(".search-field").val(word);
      this.$el.find(".search-field").trigger('change');
    },
    renderFeedbacks: function(){
      //TODO(kanitw): Add "n items matched"
      var that = this;
      var $el = this.$el;

      //clean children first
      _(app.FEEDBACK_TYPE).each(function(type){
        var className = '[class*=feedback_' + type + ']';
        $el.find(className + ' ul').children().remove();
      });

      var matchCount = 0;

      _.each(this.collection.models, function (item, idx) {
        // var frame = $(".aggregated-feedback-frame");

        var feedback = item.toJSON();

        // console.log("feedback = ", feedback);
        _(app.FEEDBACK_TYPE).each(function(type){
          if(that.keyword.length === 0 || feedback[type].match(new RegExp(that.keyword, "i"))){
            var li = $('<li/>').addClass('feedback').append(feedback[type]);
            matchCount++;
            if(that.keyword.length>0){
              li.highlight(that.keyword);

            }
            var className = '[class*=feedback_' + type + ']';
            $el.find(className + ' ul').append(li);
          }
        });

        return this;
      }, this);

      if(that.keyword.length>0){
        $el.find(".found-count").html("("+matchCount+" Found)");
      }else {
        $el.find(".found-count").html("");
      }

      //hide empty category

      _(app.FEEDBACK_TYPE).each(function(type){

        if($el.find('.feedback_'+type+' ul').children().length === 0){
          $el.find('.feedback_'+type).addClass('display-none');
        }else {
          $el.find('.feedback_'+type).removeClass('display-none');
        }
      });
    }
  });
})(jQuery);