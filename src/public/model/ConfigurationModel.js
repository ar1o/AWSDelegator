var ConfigurationModel = Backbone.Model.extend({
	defaults: {
		openConfig: false
	},

	initialize: function() {
		this.change('openConfig');
	}

});

var ConfigurationViewModel = Backbone.Model.extend({
});

var ConfigurationViewCollection = Backbone.Collection.extend({
	model: ConfigurationViewModel,
	initialize: function() {
		this.on('add', function(model) {
			// console.log('someting got added');
		});
	}
});

var ConfigurationViewCollection = new ConfigurationViewCollection();
var page0 = new ConfigurationViewModel({title: 'Account Number' , page_id: 0});
var page1 = new ConfigurationViewModel({title: 'RDS Region', page_id: 1});
var page2 = new ConfigurationViewModel({title: 'S3 Region', page_id: 2});
var page3 = new ConfigurationViewModel({title: 'AWS Regions', page_id: 3});
var page4 = new ConfigurationViewModel({title: 'Credentials', page_id: 4});
var page5 = new ConfigurationViewModel({title: 'Database URL', page_id: 5});
var page6 = new ConfigurationViewModel({title: 'Credits', page_id: 6});
var pages = [page0, page1, page2, page3, page4, page5, page6];

ConfigurationViewCollection.add(pages);
