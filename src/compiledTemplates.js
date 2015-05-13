(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"header\">\n	<h1>Dalhousie SIM</h1>\n    <h5>AWS EC2 Instance Information</h5>\n</div>\n<div class=\"content-view\"></div>\n";
  },"useData":true});
templates['InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.imageId : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.keyName : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.duration : depth0), depth0))
    + " sec</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.email : depth0), depth0))
    + "</td>\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n<div id=\"EC2\">\n	<table class=\"tablesorter\" cellspacing=\"1\" bordered=\"1\">\n		<thead>\n			<tr class=\"tablesorter-headerRow\" role=\"row\">\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Instance ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\">\n					<div class=\"tablesorter-header-inner\">State</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"2\">\n					<div class=\"tablesorter-header-inner\">Image</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"3\">\n					<div class=\"tablesorter-header-inner\">Key Name</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"4\">\n					<div class=\"tablesorter-header-inner\">Type</div>\n				</th>\n				<!--Failing to sort-->\n				<th class=\"tablesorter-header\" data-column=\"5\">\n					<div class=\"tablesorter-header-inner\">Launched</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"6\">\n					<div class=\"tablesorter-header-inner\">Zone</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"7\">\n					<div class=\"tablesorter-header-inner\">Lifetime</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"8\">\n					<div class=\"tablesorter-header-inner\">E-Mail</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"instanceData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.instances : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tbody>	\n	</table>\n>>>>>>> pr/2\n</div>\n";
},"useData":true});
})();