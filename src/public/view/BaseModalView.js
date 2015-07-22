var BaseModalView = Backbone.View.extend({
    className: 'BaseModalView',

    // id: 'base-modal',
    // className: 'modal fade hide',
    // template: 'modals/BaseModal',

    // events: {
    //   'hidden': 'teardown'
    // },

    initialize: function() {
      // _(this).bindAll();
      console.log('initialize BaseModalView ')
      this.render();
    },

    show: function() {
      console.log("showww");
      this.$el.modal({
        show: true,
        backdrop: 'static',
        keyboard: false
      });
    },

    teardown: function() {
      console.log("teardown called");
      this.$el.data('modal', null);
      this.remove();
    },

    render: function() {

        var html = Handlebars.templates.BaseModalView({

        });
        this.$el.html(html);
        this.$el.modal({show:false});

      // this.getTemplate(this.template, this.renderView);
      // return this;
    }
 });