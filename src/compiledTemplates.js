(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"header\">\n	<h1>Dalhousie SIM</h1>\n    <h5>AWS EC2 Instance Information</h5>\n</div>\n<div class=\"content-view\"></div>\n";
},"useData":true});
templates['BillingView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.UsageStartDate : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.Cost : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.ResourceId : depth0), depth0))
    + "</td>\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n<div id=\"Billing\">\n	<table class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Usage start Time</div>\n				</th>\n\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"BillingData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.billingMetrics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n\n</div> \n";
},"useData":true});
templates['CPUActivityView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cpu : depth0), depth0))
    + "</td>\n\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n<div class=\"CPU\">\n	<table class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n				<th class=\"tablesorter-header\" data-column=\"0\">\n					<div class=\"tablesorter-header-inner\">Instance ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\">\n					<div class=\"tablesorter-header-inner\">CPU Usage</div>\n				</th>\n\n			</tr>\n		</thead>\n		<tbody id=\"cpuData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.cpuMetrics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n\n</div>";
},"useData":true});
templates['InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.imageId : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.keyName : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \n				<td>"
    + alias2(alias1((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.duration : depth0), depth0))
    + " sec</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.email : depth0), depth0))
    + "</td>\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n<div id=\"EC2\">\n	<table class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Instance ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\">\n					<div class=\"tablesorter-header-inner\">State</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"2\">\n					<div class=\"tablesorter-header-inner\">Image</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"3\">\n					<div class=\"tablesorter-header-inner\">Key Name</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"4\">\n					<div class=\"tablesorter-header-inner\">Type</div>\n				</th>\n				<!--Failing to sort-->\n				<th class=\"tablesorter-header\" data-column=\"5\">\n					<div class=\"tablesorter-header-inner\">Launched</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"6\">\n					<div class=\"tablesorter-header-inner\">Zone</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"7\">\n					<div class=\"tablesorter-header-inner\">Lifetime</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"8\">\n					<div class=\"tablesorter-header-inner\">E-Mail</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"instanceData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n\n</div>\n";
},"useData":true});
templates['NetworkInActivityView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.networkIn : depth0), depth0))
    + "</td>\n\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n<div id=\"NetIn\">\n	<table class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n				<th class=\"tablesorter-header\">\n					<div class=\"tablesorter-header-inner\">Instance ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\">\n					<div class=\"tablesorter-header-inner\">Net In Usage</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"NetInData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.networkInMetrics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n\n</div> \n";
},"useData":true});
templates['NetworkOutActivityView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.networkOut : depth0), depth0))
    + "</td>\n\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n<div id=\"NetOut\">\n	<table class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Instance ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\">\n					<div class=\"tablesorter-header-inner\">Net Out</div>\n				</th>\n\n			</tr>\n		</thead>\n		<tbody id=\"NetOutData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.networkOutMetrics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n\n</div> \n";
},"useData":true});
})();