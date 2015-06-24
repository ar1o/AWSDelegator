(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"content-view\"> </div>\r\n";
},"useData":true});
templates['AWSView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['EC2BillingView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.resourceId : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.volumeId : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>					\r\n			</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"billingcontainer\"></div>\r\n\r\n<!-- <div>\r\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\r\n		<thead>\r\n			<tr class=\"dark-row\" role=\"row\">\r\n\r\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\r\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\r\n				</th>\r\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Date</div>\r\n				</th>\r\n			</tr>\r\n			</tr>\r\n		</thead>\r\n		<tbody id=\"billingData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.billing : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\r\n	</table>\r\n</div> -->\r\n\r\n\r\n\r\n\r\n\r\n";
},"useData":true});
templates['EC2CostView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.productName : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>				\r\n			</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"ec2CostContainer\"></div>\r\n\r\n<!-- <div>\r\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\r\n		<thead>\r\n			<tr class=\"dark-row\" role=\"row\">\r\n\r\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\r\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\r\n				</th>\r\n			</tr>\r\n		</thead>\r\n		<tbody id=\"billingData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.product : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\r\n	</table>\r\n</div> -->";
},"useData":true});
templates['EC2InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.keyName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.duration : depth0), depth0))
    + " min</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.email : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.volumeid : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.lastActiveTime : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"InstanceTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>Instance ID</th>\r\n			<th>State</th>\r\n			<th>Key Name</th>\r\n			<th>Type</th>\r\n			<th>Launched</th>\r\n			<th>Zone</th>\r\n			<th>Lifetime</th>\r\n			<th>E-Mail</th>\r\n			<th>Volume ID</th>\r\n			<th>LastActiveTime</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n";
},"useData":true});
templates['EC2MetricsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.networkIn : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.networkOut : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cpuUtilization : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.time : depth0), depth0))
    + "</td>\r\n			</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"networkContainer\"></div>\r\n<div id=\"cpuContainer\"></div>\r\n<div class=\"clear\"></div>\r\n\r\n<!-- <div id=\"Metrics\">\r\n	<table id=\"MetricsTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\r\n		<thead>\r\n			<tr class=\"dark-row\">\r\n				<th class=\"tablesorter-header\" data-column=\"0\">\r\n					Instance ID\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"1\">\r\n					Network In\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"2\">\r\n					Network Out\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"3\">\r\n					Cpu Utilization\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"4\">\r\n					Time\r\n				</th>\r\n			</tr>\r\n		</thead>\r\n		<tbody id=\"metricsData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.metrics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\r\n	</table>\r\n</div>\r\n -->\r\n\r\n";
},"useData":true});
templates['FooterView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['HeaderView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"setting\"> </div>\r\n\r\n <div class=\"menu\"><i class=\"fa fa-bars fa-1x\"></i> Menu</div>\r\n";
},"useData":true});
templates['NavView'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "<div class=\"page\" page-id=\""
    + alias2(alias1((depth0 != null ? depth0.page_id : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\r\n\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Amazon Elastic Compute Cloud",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Amazon RDS Service",{"name":"ifCond","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"0\"> >> EC2 Instances</div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"1\"> >> RDS Instances</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"slider\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n</div>";
},"useData":true});
templates['NonFreeBillingView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.resourceId : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.volumeId : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>					\r\n			</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"nonfreebillingcontainer\"></div>\r\n\r\n<!-- <div>\r\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\r\n		<thead>\r\n			<tr class=\"dark-row\" role=\"row\">\r\n\r\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\r\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\r\n				</th>\r\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Date</div>\r\n				</th>\r\n			</tr>\r\n			</tr>\r\n		</thead>\r\n		<tbody id=\"billingData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.billing : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\r\n	</table>\r\n</div> -->\r\n\r\n\r\n\r\n";
},"useData":true});
templates['OperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"operationscontainer\"></div>\r\n";
},"useData":true});
templates['ProductCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"productcostcontainer\"></div>\r\n";
},"useData":true});
templates['RDSBillingView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.resourceId : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.volumeId : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>					\r\n			</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- <div id=\"rdsbillingcontainer\"></div> -->\r\n\r\n<!-- <div>\r\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\r\n		<thead>\r\n			<tr class=\"dark-row\" role=\"row\">\r\n\r\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\r\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\r\n				</th>\r\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Date</div>\r\n				</th>\r\n			</tr>\r\n			</tr>\r\n		</thead>\r\n		<tbody id=\"billingData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.billing : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\r\n	</table>\r\n</div> -->\r\n\r\n\r\n\r\n\r\n\r\n";
},"useData":true});
templates['RDSCostView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.productName : depth0), depth0))
    + "</td>\r\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>				\r\n			</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"RDSCostContainer\"></div>\r\n\r\n<!-- <div>\r\n	<table id=\"rdsBillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\r\n		<thead>\r\n			<tr class=\"dark-row\" role=\"row\">\r\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\r\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\r\n				</th>\r\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\r\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\r\n				</th>\r\n			</tr>\r\n		</thead>\r\n		<tbody id=\"billingData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.product : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\r\n	</table>\r\n</div> -->\r\n";
},"useData":true});
templates['RDSInstancesView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.dbIdentifier : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbClass : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbEngine : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbStatus : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.masterUsername : depth0), depth0))
    + "</td> \r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.allocatedStorage : depth0), depth0))
    + " GB</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.type : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"RDSInstanceTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>Identifier</th>\r\n			<th>Class</th>\r\n			<th>Engine</th>\r\n			<th>Status</th>\r\n			<th>MasterUsername</th>\r\n			<th>DBName</th>\r\n			<th>AllocatedStorage</th>\r\n			<th>Launch Time</th>\r\n			<th>Zone</th>\r\n			<th>StorageType</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n";
},"useData":true});
templates['RDSMetricsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"rdsCpuContainer\"></div>\r\n<div id=\"readWriteIopsContainer\"></div>\r\n<div id=\"queueDepthContainer\"></div>\r\n<div class=\"clear\"></div>";
},"useData":true});
})();