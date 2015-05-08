(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"content-view\"></div>";
  },"useData":true});
templates['InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "	<tr><center>\n		<div class=\"instance\">\n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.imageId : depth0), depth0))
    + "</td>\n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.keyName : depth0), depth0))
    + "</td>\n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n		<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.duration : depth0), depth0))
    + " sec</td>\n	</center></tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"list_of_instances\">\n<center>\n<table>\n	<tr>\n		<th>Instance ID</td>\n		<th>State</td>\n		<th>Image</td>\n		<th>Key Name</td>\n		<th>Type</td>\n		<th>Launched</td>\n		<th>Zone</td>\n		<th>Lifetime</td>\n	</tr>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.instances : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</table>\n</center>\n</div>\n\n";
},"useData":true});
})();