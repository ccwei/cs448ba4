// namespace = app

// config for jslint
/*jslint browser:true, devel:true */
/*global Backbone, d3, app,_ */


(function ($) {
  "use strict"; // use strict mode for sublime linter according to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

  window.app = window.app || {};

  //View for the reviewee
  app.RevieweeDetailView = Backbone.View.extend(
    (function(){
      return {
        el: "#reviewee", //TODO(kanitw): make sure we need this line.
        tagName: "reviewee",
        className: "reviewee-container",
        template: $("#revieweeDetailTemplate").html(),
        initialize: function (review) {
            this.model = new app.Reviewee({name: review.teamid});

            this.render();
        },
        render: function () {
            var tmpl = _.template(this.template);
            console.log(this);
            $(this.el).html(tmpl(this.model.toJSON()));
            return this;
        }
      };
    })()
  );
})(jQuery);