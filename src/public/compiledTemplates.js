(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AWSMonthlyCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"awsmonthlycostcontainer\"></div>\n\n";
  },"useData":true});
templates['AWSOperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"awsoperationscontainer\"> </div>";
  },"useData":true});
templates['AWSView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "";
},"useData":true});
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"content-view\"> </div>\n";
  },"useData":true});
templates['BaseModalView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "\n<!-- Modal -->\n<div class=\"modal fade\" id=\"base-modal\" role=\"dialog\">\n  <div class=\"modal-dialog modal-sm\">\n\n    <!-- Modal content-->\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n        <h4 class=\"modal-title\"></h4>\n      </div>\n      <div class=\"modal-body\">\n     </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"action\">Delete</button>\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"cancel\">Cancel</button>\n      </div>\n    </div>\n\n  </div>\n</div>\n\n";
  },"useData":true});
templates['BudgetView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "								<option value="
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + ">"
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n<!-- Modal -->\n<div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\n	<div class=\"modal-dialog\">\n\n		<!-- Modal content-->\n		<div class=\"modal-content\">\n			<div class=\"modal-header\">\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n				<h4 class=\"modal-title\">Create Budget Profile</h4>\n			</div>\n			<div class=\"modal-body\">\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Name </label>\n						<input type=\"text\" id=\"budgetname\" placeholder=\"e.g., 'Monthly EC2 Budget'\">\n					</div>\n					<div class=\"warning\" id=\"budgetnamewarning\">Invalid budget Name.</div>\n					<div class=\"warning\" id=\"oldbudgetnamewarning\">Budget Name already in use.</div>\n					<div class=\"warning\" id=\"budgetnamerequest\">Please enter a budget name.</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Include costs related to </label>\n						<select class=\"costfilter\">\n							<option value=\"\" disabled selected>Select</option>\n							<option value=\"user\">User</option>\n							<option value=\"group\">Groups</option>\n						</select>\n					</div>\n				</div>\n\n				<div class=\"sub-insetting\"> \n					<div class=\"sub-incontainer\">\n						<div class=\"hidden\" id=\"filter-details\">\n							<select class=\"sub-costfilter\">\n								<option value=\"\" disabled selected>Select</option>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.col : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "							</select>\n						</div>\n					</div>\n					<div class=\"warning\" id=\"batchtyperequest\">Please select a Batch Type.</div>\n					<div class=\"warning\" id=\"batchnamerequest\">Please select a Batch Name.</div>\n				</div>\n\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Start date </label>\n						<input type=\"text\" id=\"startdate\" placeholder=\"mm/dd/yyyy\">\n						<div class=\"warning\" id=\"startdaterequest\">Please select a start date.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">End date </label>\n						<input type=\"text\" id=\"enddate\" placeholder=\"mm/dd/yyyy\">\n						<div class=\"warning\" id=\"enddatewarning\">Invalid dates selected.</div>\n						<div class=\"warning\" id=\"enddaterequest\">Please select an end.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Monthly Amount </label>\n						<input type=\"text\" id=\"amount\" placeholder=\"USD\">\n						<div class=\"warning\" id=\"amountwarning\">Invalid amount.</div>\n						<div class=\"warning\" id=\"amountrequest\">Please enter an amount.</div>\n					</div>\n				</div>\n\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Stop resource(s) when quota reached </label>\n						<div class=\"onoffswitch\">\n							<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"myonoffswitch\" checked>\n							<label class=\"onoffswitch-label\" for=\"myonoffswitch\">\n								<span class=\"onoffswitch-inner\"></span>\n								<span class=\"onoffswitch-switch\"></span>\n							</label>\n						</div>\n					</div>\n				</div>\n			</div>\n			<div class=\"modal-footer\">\n				<button type=\"button\" class=\"btn btn-default\" id=\"savebtn\">Save</button>\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n			</div>\n		</div>\n\n	</div>\n</div>\n\n\n\n";
},"useData":true});
templates['ConfigurationView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">Account Number</label>\n						<div type=\"text\" class=\"account\" value=\"012345678910\"></div>\n						"
    + escapeExpression(lambda((depth0 != null ? depth0.number : depth0), depth0))
    + "\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">S3 Bucket Region</label>\n						<div type=\"text\" class=\"account\" value=\"\">"
    + escapeExpression(lambda((depth0 != null ? depth0.s3 : depth0), depth0))
    + "</div>\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">S3 Bucket Name</label>\n						<div type=\"text\" class=\"account\" value=\"\">"
    + escapeExpression(lambda((depth0 != null ? depth0.bucketName : depth0), depth0))
    + "</div>\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">DB URL</label>\n						<div type=\"text\" class=\"account\" value=\"\" disabled>"
    + escapeExpression(lambda((depth0 != null ? depth0.URL : depth0), depth0))
    + "</div>\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\n							<input class=\"mdl-textfield__input\" type=\"text\" pattern=\"^(19|20)\\d\\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$\" id='expDate'/>\n							<label class=\"mdl-textfield__label\" for=\"expiration\">Credit Expiration (YYYY/MM/DD)</label>\n							<span class=\"mdl-textfield__error\">Input is not a date!</span>\n						</div>\n					</div>\n					<div class=\"incontainer\">\n						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\n							<input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"myCredits\" />\n						    <label class=\"mdl-textfield__label\" for=\"myCredits\">Credits</label>\n						    <span class=\"mdl-textfield__error\">Input is not a number!</span>\n						</div>\n					</div>\n				</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<!-- Modal -->\n<div id=\"myModal2\" class=\"modal fade\" role=\"dialog\">\n	<div class=\"modal-dialog\">\n		<!-- Modal content-->\n		<div class=\"modal-content\">\n			<div class=\"modal-header\">\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n				<h4 class=\"modal-title\"> AWS Account Settings</h4>\n			</div>\n			<div class=\"modal-body\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.pages : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</div>\n			<div class=\"modal-footer\">\n				<p>To modify account settings, go to \\AWSDelegator\\src\\server\\config.js</p>\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"saveConfig\">Save</button>\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n			</div>\n		</div>\n	</div>\n</div>\n";
},"useData":true});
templates['EC2BillingView'] = template({"1":function(depth0,helpers,partials,data) {
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
templates['EC2InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<tr>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.userName : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.groupName : depth0), depth0))
    + "</td>\n			<td >"
    + escapeExpression(lambda((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.lifetime : depth0), depth0))
    + " min</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table id=\"InstanceTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>User Name</th>\n			<th>Group Name</th>\n			<th>Instance ID</th>\n			<th>Type</th>\n			<th>State</th>\n			<th>Zone</th>\n			<th>Lifetime</th>\n			<th>Launched</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.instances : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</tbody>	\n</table>\n\n\n\n";
},"useData":true});
templates['EC2MetricsView'] = template({"1":function(depth0,helpers,partials,data) {
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
templates['EC2OperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"ec2operationscontainer\"></div>";
  },"useData":true});
templates['EC2View'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "";
},"useData":true});
templates['FooterView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "";
},"useData":true});
templates['HeaderView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "\n<div id=\"settings\" class=\"setting\" data-toggle=\"modal\" data-target=\"#myModal2\"><i class=\"fa fa-cog fa-1x\"></i></div>\n\n<div id=\"budgets\" class=\"budget\" data-toggle=\"modal\" data-target=\"#myModal\"> </div>\n\n<!-- Number badge on icon -->\n<div class=\"mdl-badge\" data-badge=\"\"></div>\n<div class=\"notify\"><i class=\"fa fa-bell fa-1x\"></i></div>\n\n<div class=\"menu\"><i class=\"fa fa-bars fa-1x\"></i></div>\n";
  },"useData":true});
templates['IAMGroupsView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<tr>\n			<td >"
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.arn : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.budgetNames : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table id=\"GroupsTable\" class=\"hover\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>GroupName</th>\n			<th>Arn</th>\n			<th>CreateDate</th>\n			<th>BudgetName/s</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.instances : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</tbody>	\n</table>\n";
},"useData":true});
templates['IAMUsersView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<tr>\n			<td >"
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.arn : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.budgetNames : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table id=\"UsersTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>UserName</th>\n			<th>Arn</th>\n			<th>CreateDate</th>\n			<th>BudgetName/s</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.instances : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</tbody>	\n</table>";
},"useData":true});
templates['MeterView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		$"
    + escapeExpression(lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "/Hour\n";
},"3":function(depth0,helpers,partials,data) {
  return "	 	<div id = \"div2\"></div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<script type=\"text/javascript\">\n		var response = '';\n			$(document).ready(function(){\n				$.get('/getAccountBalance', function(data){\n						$(\"#div2\").append('$'+data);\n				});\n			});\n				\n		</script>\n\n<div class=\"rate\">Rate: \n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rate : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</div>\n\n\n<div class=\"usage\">Usage:      N/A\n</div>\n\n<div class=\"balance\">Balance:\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rate : depth0), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n</div>\n";
},"useData":true});
templates['NavView'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<div class=\"page\" page-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.page_id : depth0), depth0))
    + "\">"
    + escapeExpression(lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\n\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, (depth0 != null ? depth0.title : depth0), "==", "Amazon Elastic Compute Cloud", {"name":"ifCond","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, (depth0 != null ? depth0.title : depth0), "==", "Amazon RDS Service", {"name":"ifCond","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, (depth0 != null ? depth0.title : depth0), "==", "Usage Monitor", {"name":"ifCond","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  return "<div class=\"subpage\" subpage-id=\"0\"> EC2 Instances</div>\n";
  },"4":function(depth0,helpers,partials,data) {
  return "<div class=\"subpage\" subpage-id=\"1\"> RDS Instances</div>\n";
  },"6":function(depth0,helpers,partials,data) {
  return "<div class=\"subpage\" subpage-id=\"2\"> IAM Groups</div>\n<div class=\"subpage\" subpage-id=\"3\"> IAM Users</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"slider\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.pages : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n</div>";
},"useData":true});
templates['NonFreeBillingView'] = template({"1":function(depth0,helpers,partials,data) {
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
  var stack1, buffer = "<div id=\"nonfreebillingcontainer\"></div>\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\n				</th>\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Date</div>\n				</th>\n			</tr>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.billing : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tbody>	\n	</table>\n</div> -->\n\n\n\n";
},"useData":true});
templates['NotificationView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"notify-data\" id="
    + escapeExpression(lambda((depth0 != null ? depth0.notification : depth0), depth0))
    + ">Budget: "
    + escapeExpression(lambda((depth0 != null ? depth0.notification : depth0), depth0))
    + " <br> Reason: "
    + escapeExpression(lambda((depth0 != null ? depth0.notificationType : depth0), depth0))
    + " <br> Time: "
    + escapeExpression(lambda((depth0 != null ? depth0.time : depth0), depth0))
    + "\n</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"notification-content\"> \n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.notifications : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});
templates['OperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"operationscontainer\"></div>\n";
  },"useData":true});
templates['ProductCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"productcostcontainer\"></div>\n";
  },"useData":true});
templates['RDSBillingView'] = template({"1":function(depth0,helpers,partials,data) {
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
  var stack1, buffer = "<!-- <div id=\"rdsbillingcontainer\"></div> -->\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\n				</th>\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Date</div>\n				</th>\n			</tr>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.billing : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tbody>	\n	</table>\n</div> -->\n\n\n\n\n\n";
},"useData":true});
templates['RDSCostView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.productName : depth0), depth0))
    + "</td>\n				<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>				\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div id=\"RDSCostContainer\"></div>\n\n<!-- <div>\n	<table id=\"rdsBillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.product : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tbody>	\n	</table>\n</div> -->\n";
},"useData":true});
templates['RDSInstancesView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<tr>\n			<td >"
    + escapeExpression(lambda((depth0 != null ? depth0.dbIdentifier : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.dbClass : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.dbEngine : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.dbStatus : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.masterUsername : depth0), depth0))
    + "</td> \n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.dbName : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.allocatedStorage : depth0), depth0))
    + " GB</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.type : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table id=\"RDSInstanceTable\" class=\"hover\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>Identifier</th>\n			<th>Class</th>\n			<th>Engine</th>\n			<th>Status</th>\n			<th>MasterUsername</th>\n			<th>DBName</th>\n			<th>AllocatedStorage</th>\n			<th>Launch Time</th>\n			<th>Zone</th>\n			<th>StorageType</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.instances : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</tbody>	\n</table>\n";
},"useData":true});
templates['RDSMetricsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"rdsCpuContainer\"></div>\n<div id=\"readWriteIopsContainer\"></div>\n<div id=\"queueDepthContainer\"></div>\n<div id=\"dbConnectionsContainer\"></div>\n<div class=\"clear\"></div>";
  },"useData":true});
templates['UMCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"budgetCostContainer\"></div>\n";
  },"useData":true});
templates['UMGroupUserServiceView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"groupUserServiceContainer\"></div>\n";
  },"useData":true});
templates['UMOperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"serviceContainer\"></div>\n";
  },"useData":true});
templates['UMUsageView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"budgetUsageContainer\"></div>\n";
  },"useData":true});
templates['UsageMonitorView'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<tr>\n			<td id="
    + escapeExpression(lambda((depth0 != null ? depth0.budgetName : depth0), depth0))
    + " >"
    + escapeExpression(lambda((depth0 != null ? depth0.budgetName : depth0), depth0))
    + "</td>\n			<td id="
    + escapeExpression(lambda((depth0 != null ? depth0.batchType : depth0), depth0))
    + ">"
    + escapeExpression(lambda((depth0 != null ? depth0.batchType : depth0), depth0))
    + "</td>\n			<td id="
    + escapeExpression(lambda((depth0 != null ? depth0.batchName : depth0), depth0))
    + ">"
    + escapeExpression(lambda((depth0 != null ? depth0.batchName : depth0), depth0))
    + "</td>\n			<td id="
    + escapeExpression(lambda((depth0 != null ? depth0.startDate : depth0), depth0))
    + ">"
    + escapeExpression(lambda((depth0 != null ? depth0.startDate : depth0), depth0))
    + "</td>\n			<td id="
    + escapeExpression(lambda((depth0 != null ? depth0.endDate : depth0), depth0))
    + ">"
    + escapeExpression(lambda((depth0 != null ? depth0.endDate : depth0), depth0))
    + "</td> \n			<td id="
    + escapeExpression(lambda((depth0 != null ? depth0.amount : depth0), depth0))
    + ">"
    + escapeExpression(lambda((depth0 != null ? depth0.amount : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table id=\"BudgetTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>BudgetName</th>\n			<th>BatchType</th>\n			<th>BatchName</th>\n			<th>StartDate</th>\n			<th>EndDate</th>\n			<th>Amount</th>\n		</tr>\n	</thead>\n	<tbody id=\"budgetData\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.budgets : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</tbody>	\n</table>\n\n\n<ul class='custom-menu'>\n  <li data-action=\"Edit\"data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\">Edit Instance</li>\n  <li data-action=\"Delete\" data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\" >Delete Instance</li>\n</ul>\n";
},"useData":true});
})();