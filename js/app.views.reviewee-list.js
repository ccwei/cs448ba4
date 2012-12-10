// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};


  var total = 0;

  //View for the RevieweeList
  app.RevieweeList = Backbone.View.extend({
    item_template: _.template($("#revieweeListItemTemplate").html()),
    // el: $("#ind-right-side"), //TODO(kanitw): use this when we use template!
    initialize: function () {
      var options = this.options;
      this.onItemSelected = options.onItemSelected || app.DO_NOTHING;
      this.onItemDeselected = options.onItemDeselected || app.DO_NOTHING;
      this.onItemClicked = options.onItemClicked || app.DO_NOTHING;
      this.render();
    },
    // events: {
    //   "click .reviewee-list-item": "onItemClicked"
    // },
    loadData: function(newCollection){
      console.log('reload data');
      if(newCollection) this.collection = newCollection;
      this.render();
    },
    render: function(){
      var that = this;
      this.$el.html('');
      this.collection.each(function(model){
        var div = $('<div/>').addClass("reviewee-list-item clickable");
        that.$el.append(div);
        var revieweeListItemView = new app.RevieweeListItemView({
          model: model,
          el:  div,
          onItemClicked: that.onItemClicked
        });
      });
    }
  });
})(jQuery);
