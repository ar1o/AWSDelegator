(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"content-view\">\n\n</div>\n";
},"useData":true});
templates['BillingView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.resourceId : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.volumeId : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>					\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div id=\"billingcontainer\"></div>\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\n				</th>\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Date</div>\n				</th>\n			</tr>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.billing : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tbody>	\n	</table>\n</div> -->\n\n\n\n\n\n";
},"useData":true});
templates['EC2CostView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.productName : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>				\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div id=\"ec2CostContainer\"></div>\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.product : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tbody>	\n	</table>\n</div> -->";
},"useData":true});
templates['FooterView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "";
},"useData":true});
templates['HeaderView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"setting\"> </div>\n\n\n <div class=\"menu\"><i class=\"fa fa-bars fa-1x\"></i> Menu</div>\n";
},"useData":true});
templates['HomeView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "";
},"useData":true});
templates['InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<tr>\n			<td >"
    + escapeExpression(lambda((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.keyName : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.duration : depth0), depth0))
    + " min</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.email : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.volumeid : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.lastActiveTime : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table id=\"InstanceTable\" class=\"hover\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>Instance ID</th>\n			<th>State</th>\n			<th>Key Name</th>\n			<th>Type</th>\n			<th>Launched</th>\n			<th>Zone</th>\n			<th>Lifetime</th>\n			<th>E-Mail</th>\n			<th>Volume ID</th>\n			<th>LastActiveTime</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.instances : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</tbody>	\n</table>\n";
},"useData":true});
templates['MetricsView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.networkIn : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.networkOut : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.cpuUtilization : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.time : depth0), depth0))
    + "</td>\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div id=\"networkContainer\"></div>\n<div id=\"cpuContainer\"></div>\n<div class=\"clear\"></div>\n\n<!-- <div id=\"Metrics\">\n	<table id=\"MetricsTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\">\n				<th class=\"tablesorter-header\" data-column=\"0\">\n					Instance ID\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\">\n					Network In\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"2\">\n					Network Out\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"3\">\n					Cpu Utilization\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"4\">\n					Time\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"metricsData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.metrics : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tbody>	\n	</table>\n</div>\n -->\n\n";
},"useData":true});
templates['NavView'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<div class=\"page\" page-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.page_id : depth0), depth0))
    + "\">"
    + escapeExpression(lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, (depth0 != null ? depth0.title : depth0), "==", "Amazon Elastic Compute Cloud", {"name":"ifCond","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, (depth0 != null ? depth0.title : depth0), "==", "Amazon RDS Service", {"name":"ifCond","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  return "<div class=\"subpage\" subpage-id=\"0\"> >> EC2 Instances</div>\n";
  },"4":function(depth0,helpers,partials,data) {
  return "<div class=\"subpage\" subpage-id=\"0\"> >> RDS Instances</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"slider\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.pages : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n</div>";
},"useData":true});
templates['ProductCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"productcostcontainer\"></div>\n";
  },"useData":true});
})();