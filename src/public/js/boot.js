$(function() {

    window.appModel = new AppModel();
	var appView = new AppView({ 
		el: $('body'),
		model: window.appModel
	});
    

});