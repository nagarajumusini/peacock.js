app.views.menu = Backbone.PKView.extend({
	template: _.template($("#tpl-menu").html()),
    initialize: function() {
        this.render();
    },
    pkRender: function(){
        //this.$el.html(this.template({}));
        return this.template({})
    }
});