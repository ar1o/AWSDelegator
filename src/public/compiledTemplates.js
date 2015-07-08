(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"content-view\"> </div>\r\n";
},"useData":true});
templates['AWSMonthlyCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"awsmonthlycostcontainer\"> testtesttest</div>\r\n\r\n";
},"useData":true});
templates['AWSOperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"awsoperationscontainer\"> </div>";
},"useData":true});
templates['AWSView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['BudgetView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "\r\n<!-- Modal -->\r\n<div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\r\n	<div class=\"modal-dialog\">\r\n\r\n		<!-- Modal content-->\r\n		<div class=\"modal-content\">\r\n			<div class=\"modal-header\">\r\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n				<h4 class=\"modal-title\">Create Budget Profile</h4>\r\n			</div>\r\n			<div class=\"modal-body\">\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Name </label>\r\n						<input type=\"text\" id=\"\" value=\"e.g., 'Monthly EC2 Budget'\">\r\n					</div>\r\n				</div>\r\n\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Include costs related to </label>\r\n						<select>\r\n							<option value=\"\" disabled selected>Select</option>\r\n							<option value=\"1\">Option 1</option>\r\n							<option value=\"2\">Option 2</option>\r\n							<option value=\"3\">Option 3</option>\r\n						</select>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Start date </label>\r\n						<input type=\"text\" id=\"\" value=\"2015-10-31\">\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">End date </label>\r\n						<input type=\"text\" id=\"\" value=\"2015-10-31\">\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Monthly Amount </label>\r\n						<input type=\"text\" id=\"\" value=\"USD\">\r\n					</div>\r\n				</div>\r\n\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Stop resource(s) when quota reached </label>\r\n						<div class=\"onoffswitch\">\r\n							<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"myonoffswitch\" checked>\r\n							<label class=\"onoffswitch-label\" for=\"myonoffswitch\">\r\n								<span class=\"onoffswitch-inner\"></span>\r\n								<span class=\"onoffswitch-switch\"></span>\r\n							</label>\r\n						</div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n			<div class=\"modal-footer\">\r\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Save</button>\r\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\r\n			</div>\r\n		</div>\r\n\r\n	</div>\r\n</div>\r\n\r\n\r\n\r\n";
},"useData":true});
templates['ConfigurationView'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Account Number",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),"==","RDS Region",{"name":"ifCond","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),"==","S3 Region",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),"==","AWS Regions",{"name":"ifCond","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Credits",{"name":"ifCond","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "					<div type=\"text\" id=\"account\" value=\"\"></div>\r\n						<h5>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + ":</h5>\r\n						<b><div id = \"div1\"></div></b>\r\n						\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "						<h5>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</h5>\r\n						<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rdsWest1\">\r\n						  <input type=\"radio\" id=\"rdsWest1\" class=\"mdl-radio__button\" name=\"S3_Region\" value=\"us-west-1\" />\r\n						  <span class=\"mdl-radio__label\">us-west-1</span>\r\n						</label>\r\n						<br>\r\n						<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rdsWest2\">\r\n						  <input type=\"radio\" id=\"rdsWest2\" class=\"mdl-radio__button\" name=\"S3_Region\" value=\"us-west-2\" />\r\n						  <span class=\"mdl-radio__label\">us-west-2</span>\r\n						</label>\r\n						<br>\r\n						<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rdsEast1\">\r\n						  <input type=\"radio\" id=\"rdsEast1\" class=\"mdl-radio__button\" name=\"S3_Region\" value=\"us-east-1\" />\r\n						  <span class=\"mdl-radio__label\">us-east-1</span>\r\n						</label>\r\n						<script type = \"text/javascript\">\r\n							$(document).ready(function(){\r\n									$.get('/getRDSRegion', function(data){\r\n										if(\"us-west-1\" == data|| \"rdsWest1\"==data){\r\n											document.getElementById(\"rdsWest1\").checked = true;\r\n										}\r\n										else if(\"us-west-2\" == data|| \"rdsWest2\"==data){\r\n											document.getElementById(\"rdsWest2\").checked = true;\r\n										}\r\n										else if(\"us-east-1\" == data|| \"rdsEast1\"==data){\r\n											document.getElementById(\"rdsEast1\").checked = true;\r\n										}\r\n									});\r\n								});\r\n						</script>\r\n						<br>\r\n						\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "						<h5>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</h5>\r\n						<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"s3West1\">\r\n						  <input type=\"radio\" id=\"s3West1\" class=\"mdl-radio__button\" name=\"RDS_Region\" value=\"us-west-1\" />\r\n						  <span class=\"mdl-radio__label\">us-west-1</span>\r\n						</label>\r\n						<br>\r\n						<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"s3West2\">\r\n						  <input type=\"radio\" id=\"s3West2\" class=\"mdl-radio__button\" name=\"RDS_Region\" value=\"us-west-2\" />\r\n						  <span class=\"mdl-radio__label\">us-west-2</span>\r\n						</label>\r\n						<br>\r\n						<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"s3East1\">\r\n						  <input type=\"radio\" id=\"s3East1\" class=\"mdl-radio__button\" name=\"RDS_Region\" value=\"us-east-1\" />\r\n						  <span class=\"mdl-radio__label\">us-east-1</span>\r\n						</label>\r\n						<script type = \"text/javascript\">\r\n							$(document).ready(function(){\r\n									$.get('/getS3Region', function(data){\r\n										if(\"us-west-1\" == data|| \"s3West1\" == data){\r\n											document.getElementById(\"s3West1\").checked = true;\r\n										}\r\n										else if(\"us-west-2\" == data || \"s3West2\" == data){\r\n											document.getElementById(\"s3West2\").checked = true;\r\n										}\r\n										else if(\"us-east-1\" == data || \"s3East1\" == data){\r\n											document.getElementById(\"s3East1\").checked = true;\r\n										}\r\n									});\r\n								});\r\n						</script>\r\n						<br>\r\n						\r\n";
},"8":function(depth0,helpers,partials,data) {
    return "						<h5>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</h5>\r\n						<div id= \"aws_Regions\">\r\n						<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"awsWest1\">\r\n						  <input type=\"checkbox\" id = \"awsWest1\" name='AWS_Regions' value=\"us-west-1\" class=\"mdl-checkbox__input\"/>\r\n						  <span class=\"mdl-checkbox__label\">us-west-1</span>\r\n						</label>\r\n						<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"awsWest2\">\r\n						  <input type=\"checkbox\" id = \"awsWest2\" name='AWS_Regions' value=\"us-west-2\" class=\"mdl-checkbox__input\"/>\r\n						  <span class=\"mdl-checkbox__label\">us-west-2</span>\r\n						</label>\r\n						<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"awsEast1\">\r\n						  <input type=\"checkbox\" id = \"awsEast1\" name='AWS_Regions' value=\"us-east-1\" class=\"mdl-checkbox__input\"/>\r\n						  <span class=\"mdl-checkbox__label\">us-east-1</span>\r\n						</label>\r\n						</div>\r\n						<script type = \"text/javascript\">\r\n							$(document).ready(function(){\r\n									$.get('/getAWSRegion', function(data){\r\n										if(data.indexOf('us-west-1')!=-1){\r\n											document.getElementById('awsWest1').checked = true;\r\n										}\r\n										if(data.indexOf('us-west-2')!=-1){\r\n											document.getElementById('awsWest2').checked = true;\r\n										}\r\n										if(data.indexOf('us-east-1')!=-1){\r\n											document.getElementById('awsEast1').checked = true;\r\n										}\r\n									});\r\n								});\r\n						</script>\r\n						<br>\r\n						<br>\r\n						\r\n";
},"10":function(depth0,helpers,partials,data) {
    return "						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\r\n						    <input class=\"mdl-textfield__input\" type=\"text\" name =\"Credits\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"myCredits\" />\r\n						    <label class=\"mdl-textfield__label\" for=\"myCredits\">Credits...</label>\r\n						    <span class=\"mdl-textfield__error\">Input is not a number!</span>\r\n						</div>\r\n						<br>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n\r\n<html>\r\n	<head>\r\n		<title>Credential Input</title>\r\n		<script type=\"text/javascript\">\r\n			$(document).ready(function(){\r\n				$.get('/getAccount', function(data){\r\n					$(\"#div1\").append(data);\r\n				});\r\n			});\r\n			// $(document).ready(function(){\r\n			// 	$.get('/getAccount', function(data){\r\n		// var rds= /getRDSRegion\r\n		// var s3 = getS3Region\r\n		// var regions= getAWSRegion\r\n		</script>\r\n	\r\n	</head>\r\n	<body>\r\n		<div class=\"slider\">\r\n			<form id=\"credentials\" action=\"/setCredentials\" method=\"post\">\r\n				<div>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "				<br>\r\n				\r\n				<button input type=\"submit\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect\">\r\n  				Save\r\n				</button>\r\n			</form>\r\n		</div>\r\n\r\n	</body>\r\n</html>\r\n\r\n";
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
templates['EC2View'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['FooterView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['HeaderView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"setting\"><i class=\"fa fa-cogs fa-1x\"></i></div>\r\n\r\n<div class=\"budget\" data-toggle=\"modal\" data-target=\"#myModal\"> </div>\r\n<div class=\"menu\"><i class=\"fa fa-bars fa-1x\"></i></div>\r\n";
},"useData":true});
templates['IAMGroupsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.groupName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.arn : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"GroupsTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>GroupName</th>\r\n			<th>GroupId</th>\r\n			<th>Arn</th>\r\n			<th>CreateDate</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n";
},"useData":true});
templates['IAMUsersView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.userName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.userId : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.arn : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"UsersTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>UserName</th>\r\n			<th>UserId</th>\r\n			<th>Arn</th>\r\n			<th>CreateDate</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n";
},"useData":true});
templates['MeterView'] = template({"1":function(depth0,helpers,partials,data) {
    return "		$"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "/Hour\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "	 	<div id = \"div2\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/javascript\">\r\n		var response = '';\r\n			$(document).ready(function(){\r\n				$.get('/getAccountBalance', function(data){\r\n						$(\"#div2\").append('$'+data);\r\n				});\r\n			});\r\n				\r\n		</script>\r\n\r\n<div class=\"rate\">Rate: \r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rate : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n\r\n\r\n<div class=\"usage\">Usage:      N/A\r\n</div>\r\n\r\n<div class=\"balance\">Balance:\r\n\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rate : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n</div>\r\n";
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
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Amazon RDS Service",{"name":"ifCond","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Usage Monitor",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"0\"> EC2 Instances</div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"1\"> RDS Instances</div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"2\"> IAM Groups</div>\r\n<div class=\"subpage\" subpage-id=\"3\"> IAM Users</div>\r\n";
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
templates['UsageMonitorView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.budgetName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchType : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.startDate : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.endDate : depth0), depth0))
    + "</td> \r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.amount : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"BudgetTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>BudgetName</th>\r\n			<th>BatchType</th>\r\n			<th>BatchName</th>\r\n			<th>StartDate</th>\r\n			<th>EndDate</th>\r\n			<th>Amount</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"budgetData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.budgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n";
},"useData":true});
})();