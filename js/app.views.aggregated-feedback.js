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
    template: $("#aggregatedFeedbackFrameTemplate").html(),

    el: '#aggregate-feedbacks',
    keyword: "",

    initialize: function (feedbacks) {
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

      var tmpl = _.template(this.template);
      this.$frame = $(this.el).html(tmpl()).delegate('li', 'click', function () { //WARNING(kanitw): delegate is deprecated

        var reviewIdx = $(this).index() - 1;
        var feedbackModal = new app.FeedbackModalView(that.collection.models[reviewIdx]);
        //TODO: link back to one by one view for the review idx reviewIdx
      });
      console.log(this.$frame.find(".search-field"));
      this.$frame.find(".search-field").on('change',onSearchTextChange);
      this.$frame.find(".search-field").on('keyup',onSearchTextChange);

      this.renderFeedbacks();
    },
    renderFeedbacks: function(){
      //TODO(kanitw): Add "n items matched"
      var that = this;
      var $frame = this.$frame;

      //clean children first
      _(FEEDBACK_TYPE).each(function(type){
        $frame.find('#feedback_'+type+' ul').children().remove();
      });

      _.each(this.collection.models, function (item, idx) {
        // var frame = $(".aggregated-feedback-frame");

        var feedback = item.toJSON();
        // console.log("feedback = ", feedback);
        _(FEEDBACK_TYPE).each(function(type){
          if(that.keyword.length === 0 || feedback[type].indexOf(that.keyword)!=-1){
            var li = $('<li/>').addClass('feedback').append(feedback[type]);
            if(that.keyword.length>0){
              console.log(li);
              li.highlight(that.keyword);
            }
            $frame.find('#feedback_'+type+' ul').append(li);
          }
        });

        return this;
      }, this);

      //hide empty category

      _(FEEDBACK_TYPE).each(function(type){

        if($frame.find('#feedback_'+type+' ul').children().length === 0){
          console.log("removing " +type);
          console.log($frame.find('#feedback_'+type));
          $frame.find('#feedback_'+type).addClass('display-none');
        }
      });

    }
  });
})(jQuery);