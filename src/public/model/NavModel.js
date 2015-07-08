var NavModel = Backbone.Model.extend({
	defaults: {
		isOpen: false
	},

	initialize: function() {
		this.change('isOpen');
	}

});

var NavViewModel = Backbone.Model.extend({
});

var NavViewCollection = Backbone.Collection.extend({
	model: NavViewModel,
	initialize: function() {
		this.on('add', function(model) {
			// console.log('someting got added');
		});
	}
});

var NavViewCollection = new NavViewCollection();
var page0 = new NavViewModel({title: 'Amazon Web Services' , page_id: 0});
var page1 = new NavViewModel({title: 'Amazon Elastic Compute Cloud', page_id: 1});
var page2 = new NavViewModel({title: 'Amazon RDS Service', page_id: 2});
var page3 = new NavViewModel({title: 'Usage Monitor', page_id: 3});
var page4 = new NavViewModel({title: 'Budget', page_id: 4});
var pages = [page0, page1, page2, page3, page4];

NavViewCollection.add(pages);
