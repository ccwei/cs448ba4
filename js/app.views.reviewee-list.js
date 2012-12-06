// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_, processWord, indNotableFeedbackWords, indConstructiveFeedbackWords, indQuestionsFeedbackWords, indIdeasFeedbackWords, render_tagCloud */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};
  var DO_NOTHING = function() { /*do nothing*/ };

  var total = 0;

  //View for the reviewee
  app.RevieweeList = Backbone.View.extend({
    item_template: _.template($("#revieweeListItemTemplate").html()),
    // el: $("#ind-right-side"), //TODO(kanitw): use this when we use template!
    initialize: function () {
      var options = this.options;
      this.onItemSelected = options.onItemSelected || DO_NOTHING;
      this.onItemDeselected = options.onItemDeselected || DO_NOTHING;

      this.loadData();
    },
    // events: {
    //   "click .reviewee-list-item": "onItemClicked"
    // },
    loadData: function(newCollection){
      if(newCollection) this.collection = newCollection;
      var that = this;
      this.collection.each(function(model){
        var $item = $(that.item_template(model.attributes))
          .attr('cid',model.cid)
          .on('click',function(event){
            var cid = $(this).attr('cid');
            var reviewee = that.collection.getByCid(cid);
            that.onItemSelected(reviewee);
          });

        that.$el.append($item);
      });
    }
  });

  // app.RevieweeListItem = Backbone.View.extend({
  //   template: _.template($("#revieweeListItemTemplate").html()),
  //   render: function(){

  //   }
  // });

})(jQuery);
