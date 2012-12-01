// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};
  app.AggregatedFeedbackView = Backbone.View.extend({
    render: function () {
        var frame = $(".aggregated-feedback-frame");
        var feedback = this.model.toJSON();
        // console.log("feedback = ", feedback);
        frame.children('#feedback_notable').append($('<li/>').addClass('feedback')
                                          .append(feedback.notable));
        frame.children('#feedback_constructive').append($('<li/>').addClass('feedback')
                                          .append(feedback.constructive));
        frame.children('#feedback_questions').append($('<li/>').addClass('feedback')
                                          .append(feedback.questions));
        frame.children('#feedback_ideas').append($('<li/>').addClass('feedback')
                                          .append(feedback.ideas));
        return this;
    }
  });

  app.AggregatedFeedbackFrameView = Backbone.View.extend({
        tagName: "div",
        className: "aggregated-feedback-frame",
        template: $("#aggregatedFeedbackFrameTemplate").html(),

        render: function (idx) {
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl());
            return this;
        }
    });



  app.FeedbacksAggregatedView = Backbone.View.extend(
    (function(){
      return {
        el: '#aggregate-feedbacks',

        initialize: function (feedbacks) {
            this.collection = new app.FeedbackCollection(feedbacks);
            this.render();
        },
        render: function () {
            var that = this;
            var aggregatedFeedbackView = new app.AggregatedFeedbackFrameView();
            $(this.el).html(aggregatedFeedbackView.render().el);
            //Create on click for each <li>
            $('.' + aggregatedFeedbackView.className).delegate('li', 'click', function () {
              var reviewIdx = $(this).index() - 1;
              var feedbackModal = new app.FeedbackModalView(that.collection.models[reviewIdx]);
              //TODO: link back to one by one view for the review idx reviewIdx
            });
            _.each(this.collection.models, function (item, idx) {
                console.log("idx = ", idx);
                that.renderAggregatedFeedback(item, idx);
            }, this);
        },
        renderAggregatedFeedback: function (item, idx) {
            var feedView = new app.AggregatedFeedbackView({
                model: item
            });
            feedView.render();
        }
      };
    })()
  );
})(jQuery);