// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/


  var FEEDBACK_TYPE = ["notable","constructive","questions","ideas"];

  //TODO(kanitw): should be renamed to FeedbacksGroupedView ???
  app.FeedbacksAggregatedView = Backbone.View.extend({
    tagName: "div",
    className: "aggregated-feedback-frame",
    template: _.template($("#aggregatedFeedbackFrameTemplate").html()),

    el: $('#ind-tab-aggregate-grid'),
    keyword: "",

    initialize: function () {

    },
    loadData: function(feedbacks){
      this.collection = new app.FeedbackCollection(feedbacks);
      this.render();
    },

    render: function () {
      var that = this;

      var onSearchTextChange = function(){
        console.log(this);
        that.keyword = $(this).val();
        that.renderFeedbacks();
      };

      this.$el.html(this.template())
        .delegate('li', 'click', function () { //WARNING(kanitw): delegate is deprecated
          var reviewIdx = $(this).index() - 1;
          var feedbackModal = new app.FeedbackModalView({
            model: that.collection.models[reviewIdx]
          });
          //TODO: link back to one by one view for the review idx reviewIdx
        });
      // console.log(this.$el.find(".search-field"));
      this.$el.find(".search-field").on('change',onSearchTextChange);
      this.$el.find(".search-field").on('keyup',onSearchTextChange);

      this.renderFeedbacks();
    },
    renderFeedbacks: function(){
      //TODO(kanitw): Add "n items matched"
      var that = this;
      var $el = this.$el;

      //clean children first
      _(FEEDBACK_TYPE).each(function(type){
        $el.find('.feedback_'+type+' ul').children().remove();
      });

      var matchCount = 0;

      _.each(this.collection.models, function (item, idx) {
        // var frame = $(".aggregated-feedback-frame");

        var feedback = item.toJSON();

        // console.log("feedback = ", feedback);
        _(FEEDBACK_TYPE).each(function(type){
          if(that.keyword.length === 0 || feedback[type].match(new RegExp(that.keyword, "i"))){
            var li = $('<li/>').addClass('feedback').append(feedback[type]);
            matchCount++;
            if(that.keyword.length>0){
              console.log(li);
              li.highlight(that.keyword);

            }
            $el.find('.feedback_'+type+' ul').append(li);
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

      _(FEEDBACK_TYPE).each(function(type){

        if($el.find('.feedback_'+type+' ul').children().length === 0){
          $el.find('.feedback_'+type).addClass('display-none');
        }else {
          $el.find('.feedback_'+type).removeClass('display-none');
        }
      });

    }
  });
})(jQuery);