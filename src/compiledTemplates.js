(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"content-view\"></div>";
},"useData":true});
templates['InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "	\n	<tr class=\"instance align=center\">\n		<td>"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n		<td>"
    + alias2(alias1((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n		<td>"
    + alias2(alias1((depth0 != null ? depth0.imageId : depth0), depth0))
    + "</td>\n		<td>"
    + alias2(alias1((depth0 != null ? depth0.keyName : depth0), depth0))
    + "</td>\n		<td>"
    + alias2(alias1((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n		<td>"
    + alias2(alias1((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \n		<td>"
    + alias2(alias1((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n		<!--//Need a conditional in the (.js?) to set duration to 0 when state==\"stopped\"-->\n		<td>"
    + alias2(alias1((depth0 != null ? depth0.duration : depth0), depth0))
    + " sec</td>\n	</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "  <body>\n\n    <div class=\"intro grey darken-2 z-depth-1\">\n        <h1 class=\"grey-text text-lighten-5\">Dalhousie SIM</h1>\n        <h5>EC2 Instance Information</h5>\n      </div>\n      </body>\n<div class=\"list_of_instances z-depth-1\">\n<table class=\"table bordered striped \">\n	<tr class=\"grey darken-1 align=center z-depth-2\">\n		<th>Instance ID</td>\n		<th>State</td>\n		<th>Image</td>\n		<th>Key Name</td>\n		<th>Type</td>\n		<th>Launched</td>\n		<th>Zone</td>\n		<th>Lifetime</td>\n	</tr>\n	<tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>\n</table>\n\n</div>\n</body>\n\n";
},"useData":true});
})();