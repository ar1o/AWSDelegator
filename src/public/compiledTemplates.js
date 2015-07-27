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
    return "\n<!-- Modal -->\n<div class=\"modal fade\" id=\"base-modal\" role=\"dialog\">\n  <div class=\"modal-dialog\">\n\n    <!-- Modal content-->\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n        <h4 class=\"modal-title\"></h4>\n      </div>\n      <div class=\"modal-body\">\n     </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"action\">Delete</button>\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"cancel\">Cancel</button>\n      </div>\n    </div>\n\n  </div>\n</div>\n\n";
},"useData":true});
templates['BudgetView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "								<option value="
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n<!-- Modal -->\n<div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\n	<div class=\"modal-dialog\">\n\n		<!-- Modal content-->\n		<div class=\"modal-content\">\n			<div class=\"modal-header\">\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n				<h4 class=\"modal-title\">Create Cost Budget Profile</h4>\n			</div>\n			<div class=\"modal-body\">\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Name </label>\n						<input type=\"text\" id=\"budgetname\" placeholder=\"e.g., 'Monthly EC2 Budget'\">\n					</div>\n					<div class=\"warning\" id=\"budgetnamewarning\">Invalid budget Name.</div>\n					<div class=\"warning\" id=\"oldbudgetnamewarning\">Budget Name already in use.</div>\n					<div class=\"warning\" id=\"budgetnamerequest\">Please enter a budget name.</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Include costs related to </label>\n						<select class=\"costfilter\">\n							<option value=\"\" disabled selected>Select</option>\n							<option value=\"user\">User</option>\n							<option value=\"group\">Groups</option>\n						</select>\n					</div>\n				</div>\n\n				<div class=\"sub-insetting\"> \n					<div class=\"sub-incontainer\">\n						<div class=\"hidden\" id=\"filter-details\">\n							<select class=\"sub-costfilter\">\n								<option value=\"\" disabled selected>Select</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.col : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "							</select>\n						</div>\n					</div>\n					<div class=\"warning\" id=\"batchtyperequest\">Please select a Batch Type.</div>\n					<div class=\"warning\" id=\"batchnamerequest\">Please select a Batch Name.</div>\n				</div>\n\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Start date </label>\n						<input type=\"text\" id=\"startdate\" placeholder=\"mm/dd/yyyy\">\n						<div class=\"warning\" id=\"startdaterequest\">Please select a start date.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">End date </label>\n						<input type=\"text\" id=\"enddate\" placeholder=\"mm/dd/yyyy\">\n						<div class=\"warning\" id=\"enddatewarning\">Invalid dates selected.</div>\n						<div class=\"warning\" id=\"enddaterequest\">Please select an end.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Cost Amount </label>\n						<input type=\"text\" id=\"amount\" placeholder=\"USD\">\n						<div class=\"warning\" id=\"amountwarning\">Invalid amount.</div>\n						<div class=\"warning\" id=\"amountrequest\">Please enter an amount.</div>\n					</div>\n				</div>\n\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Stop resource(s) when quota reached </label>\n						<div class=\"onoffswitch\">\n							<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"myonoffswitch\" checked>\n							<label class=\"onoffswitch-label\" for=\"myonoffswitch\">\n								<span class=\"onoffswitch-inner\"></span>\n								<span class=\"onoffswitch-switch\"></span>\n							</label>\n						</div>\n					</div>\n				</div>\n			</div>\n			<div class=\"modal-footer\">\n				<button type=\"button\" class=\"btn btn-default\" id=\"savebtn\">Save</button>\n				<button type=\"button\" class=\"btn btn-default\" id=\"closebtn\">Close</button>\n			</div>\n		</div>\n\n	</div>\n</div>\n\n\n\n";
},"useData":true});
templates['ConfigurationView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">Account Number</label>\n						<div type=\"text\" class=\"account\" value=\"012345678910\"></div>\n						"
    + alias2(alias1((depth0 != null ? depth0.number : depth0), depth0))
    + "\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">S3 Bucket Region</label>\n						<div type=\"text\" class=\"account\" value=\"\">"
    + alias2(alias1((depth0 != null ? depth0.s3 : depth0), depth0))
    + "</div>\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">S3 Bucket Name</label>\n						<div type=\"text\" class=\"account\" value=\"\">"
    + alias2(alias1((depth0 != null ? depth0.bucketName : depth0), depth0))
    + "</div>\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"config-label\">DB URL</label>\n						<div type=\"text\" class=\"account\" value=\"\" disabled>"
    + alias2(alias1((depth0 != null ? depth0.URL : depth0), depth0))
    + "</div>\n					</div>\n				</div>\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\n							<input class=\"mdl-textfield__input\" type=\"text\" pattern=\"^(19|20)\\d\\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$\" id='expDate'/>\n							<label class=\"mdl-textfield__label\" for=\"expiration\">Credit Expiration (YYYY/MM/DD)</label>\n							<span class=\"mdl-textfield__error\">Input is not a date!</span>\n						</div>\n					</div>\n					<div class=\"incontainer\">\n						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\n							<input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"myCredits\" />\n						    <label class=\"mdl-textfield__label\" for=\"myCredits\">Credits</label>\n						    <span class=\"mdl-textfield__error\">Input is not a number!</span>\n						</div>\n					</div>\n				</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- Modal -->\n<div id=\"myModal2\" class=\"modal fade\" role=\"dialog\">\n	<div class=\"modal-dialog\">\n		<!-- Modal content-->\n		<div class=\"modal-content\">\n			<div class=\"modal-header\">\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n				<h4 class=\"modal-title\"> AWS Account Settings</h4>\n			</div>\n			<div class=\"modal-body\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "			</div>\n			<div class=\"modal-footer\">\n				<p>To modify account settings, go to \\AWSDelegator\\src\\server\\config.js</p>\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"saveConfig\">Save</button>\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n			</div>\n		</div>\n	</div>\n</div>\n";
},"useData":true});
templates['EC2BillingView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.resourceId : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.volumeId : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>					\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"billingcontainer\"></div>\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\n				</th>\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Date</div>\n				</th>\n			</tr>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.billing : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n</div> -->\n\n\n\n\n\n";
},"useData":true});
templates['EC2CostView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.productName : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>				\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"ec2CostContainer\"></div>\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.product : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n</div> -->";
},"useData":true});
templates['EC2InstancesView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.userName : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.groupName : depth0), depth0))
    + "</td>\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.lifetime : depth0), depth0))
    + " min</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"EC2InstanceTable\" class=\"hover\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>User Name</th>\n			<th>Group Name</th>\n			<th>Instance ID</th>\n			<th>Type</th>\n			<th>State</th>\n			<th>Zone</th>\n			<th>Lifetime</th>\n			<th>Launched</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>\n\n\n\n";
},"useData":true});
templates['EC2MetricsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.networkIn : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.networkOut : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cpuUtilization : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.time : depth0), depth0))
    + "</td>\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"networkContainer\"></div>\n<div id=\"cpuContainer\"></div>\n<div class=\"clear\"></div>\n\n<!-- <div id=\"Metrics\">\n	<table id=\"MetricsTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\">\n				<th class=\"tablesorter-header\" data-column=\"0\">\n					Instance ID\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\">\n					Network In\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"2\">\n					Network Out\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"3\">\n					Cpu Utilization\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"4\">\n					Time\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"metricsData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.metrics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n</div>\n -->\n\n";
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
templates['GRLSView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.dbIdentifier : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbClass : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbStatus : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbName : depth0), depth0))
    + "</td>\n		</tr>\n";
},"3":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.userName : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.groupName : depth0), depth0))
    + "</td>\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- <table id=\"RDSInstanceTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>Identifier</th>\n			<th>Class</th>\n			<th>Status</th>\n			<th>DBName</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rdsinstances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table> -->\n\n<table id=\"EC2InstanceTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>User Name</th>\n			<th>Group Name</th>\n			<th>Instance ID</th>\n			<th>Type</th>\n			<th>State</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.ec2instances : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>";
},"useData":true});
templates['HeaderView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "\n<div id=\"settings-tooltip\" data-toggle=\"tooltip\" title=\"Settings\"data-placement=\"bottom\"><div id=\"settings\" class=\"setting\" data-toggle=\"modal\" data-target=\"#myModal2\"><i class=\"fa fa-cog fa-1x\"></i></div></div>\n\n<div id=\"cost-tooltip\" data-toggle=\"tooltip\" title=\"Cost Budget\"data-placement=\"bottom\"><div id=\"budgets\" class=\"budget\" data-toggle=\"modal\" data-target=\"#myModal\"> </div></div>\n\n<div id=\"time-tooltip\" data-toggle=\"tooltip\" title=\"Time Budget\"data-placement=\"bottom\"><div id=\"timeBudgets\" class=\"timeBudgets\" data-toggle=\"modal\" data-target=\"#timeBudgetModal\"> </div></div>\n\n<!-- Number badge on icon -->\n<div class=\"mdl-badge\" data-badge=\"\"></div>\n<div ><div class=\"notify\"data-toggle=\"tooltip\" title=\"Notifications\" data-placement=\"bottom\"><i class=\"fa fa-bell fa-1x\"></i></div></div>\n\n<div class=\"menu\"><i class=\"fa fa-bars fa-1x\"></i></div>\n\n";
},"useData":true});
templates['IAMGroupsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.costBudgetNames : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeBudgetNames : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"GroupsTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>GroupName</th>\n			<th>CreateDate</th>\n			<th>CostBudgetName/s</th>\n			<th>TimeBudgetName/s</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>\n";
},"useData":true});
templates['IAMUsersView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.costBudgetNames : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeBudgetNames : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"UsersTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>UserName</th>\n			<th>CreateDate</th>\n			<th>CostBudgetName/s</th>\n			<th>TimeBudgetName/s</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>";
},"useData":true});
templates['IAMView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['MeterView'] = template({"1":function(depth0,helpers,partials,data) {
    return "		$"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "/Hour\n";
},"3":function(depth0,helpers,partials,data) {
    return "	 	<div id = \"div2\"></div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n<script type=\"text/javascript\">\n$(document).ready(function() {\n    $(\"body\").tooltip({ selector: '[data-toggle=tooltip]' });\n});\n</script>\n<div class=\"rate\"data-toggle=\"tooltip\" title=\"Rate of cost per hour\" data-placement=\"bottom\">Rate: \n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rate : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n\n<div class=\"usage\"data-toggle=\"tooltip\" title=\"Current usage from specified start/end date\" data-placement=\"bottom\">Usage:      $23\n</div>\n\n<div class=\"balance\" data-toggle=\"tooltip\" title=\"Current remaining balance\" data-placement=\"bottom\">Balance:     $977\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rate : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n\n\n\n\n<script type=\"text/javascript\">\n		var response = '';\n			$(document).ready(function(){\n				$.get('/getAccountBalance', function(data){\n						$(\"#div2\").append('$'+data);\n				});\n			});\n				\n</script>";
},"useData":true});
templates['NavView'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "<div class=\"page\" page-id=\""
    + alias2(alias1((depth0 != null ? depth0.page_id : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\n\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Amazon EC2 Service",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Amazon RDS Service",{"name":"ifCond","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Usage Monitor",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"0\"> EC2 Instances</div>\n";
},"4":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"1\"> RDS Instances</div>\n";
},"6":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"2\"> Cost Budgets</div>\n<div class=\"subpage\" subpage-id=\"3\"> Time Budgets</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"slider\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>";
},"useData":true});
templates['NonFreeBillingView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.resourceId : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.volumeId : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>					\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"nonfreebillingcontainer\"></div>\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\n				</th>\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Date</div>\n				</th>\n			</tr>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.billing : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n</div> -->\n\n\n\n";
},"useData":true});
templates['NotificationView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"notify-data\" id="
    + alias2(alias1((depth0 != null ? depth0.notification : depth0), depth0))
    + ">Budget: "
    + alias2(alias1((depth0 != null ? depth0.notification : depth0), depth0))
    + " <br> Reason: "
    + alias2(alias1((depth0 != null ? depth0.notificationType : depth0), depth0))
    + " <br> Time: "
    + alias2(alias1((depth0 != null ? depth0.time : depth0), depth0))
    + "\n</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"notification-content\"> \n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.notifications : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
templates['OperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"operationscontainer\"></div>\n";
},"useData":true});
templates['ProductCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"productcostcontainer\"></div>\n";
},"useData":true});
templates['RDSBillingView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.resourceId : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.volumeId : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>					\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- <div id=\"rdsbillingcontainer\"></div> -->\n\n<!-- <div>\n	<table id=\"BillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"1\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">VolumeId</div>\n				</th>\n						<th class=\"tablesorter-header\" data-column=\"3\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Date</div>\n				</th>\n			</tr>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.billing : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n</div> -->\n\n\n\n\n\n";
},"useData":true});
templates['RDSCostView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "			<tr class=\"tablesorter-body\">\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.productName : depth0), depth0))
    + "</td>\n				<td>"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>				\n			</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"RDSCostContainer\"></div>\n\n<!-- <div>\n	<table id=\"rdsBillingTable\" class=\"tablesorter-metro\" cellspacing=\"1\">\n		<thead>\n			<tr class=\"dark-row\" role=\"row\">\n				<th class=\"tablesorter-header\" data-column=\"2\" unselectable=\"on\">\n					<div class=\"tablesorter-header-inner\">Resource ID</div>\n				</th>\n				<th class=\"tablesorter-header\" data-column=\"0\" unselectable=\"on\">\n					<div id=\"time\" class=\"tablesorter-header-inner\">Cost</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody id=\"billingData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.product : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>	\n	</table>\n</div> -->\n";
},"useData":true});
templates['RDSInstancesView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.dbIdentifier : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbClass : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbEngine : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbStatus : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.masterUsername : depth0), depth0))
    + "</td> \n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbName : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.allocatedStorage : depth0), depth0))
    + " GB</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.type : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"RDSInstanceTable\" class=\"hover\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>Identifier</th>\n			<th>Class</th>\n			<th>Engine</th>\n			<th>Status</th>\n			<th>MasterUsername</th>\n			<th>DBName</th>\n			<th>AllocatedStorage</th>\n			<th>Launch Time</th>\n			<th>Zone</th>\n			<th>StorageType</th>\n		</tr>\n	</thead>\n	<tbody id=\"instanceData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>\n";
},"useData":true});
templates['RDSMetricsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"rdsCpuContainer\"></div>\n<div id=\"readWriteIopsContainer\"></div>\n<div id=\"queueDepthContainer\"></div>\n<div id=\"dbConnectionsContainer\"></div>\n<div class=\"clear\"></div>";
},"useData":true});
templates['TimeBudgetView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "								<option value="
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- Modal -->\n<div class=\"modal fade\" id=\"timeBudgetModal\" role=\"dialog\">\n	<div class=\"modal-dialog\">\n\n		<!-- Modal content-->\n		<div class=\"modal-content\">\n			<div class=\"modal-header\">\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n				<h4 class=\"modal-title\">Create Time Budget Profile</h4>\n			</div>\n			<div class=\"modal-body\">\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Name </label>\n						<input type=\"text\" id=\"time-budgetname\" placeholder=\"e.g., 'Monthly EC2 Budget'\">\n					</div>\n					<div class=\"warning\" id=\"time-budgetnamewarning\">Invalid budget Name.</div>\n					<div class=\"warning\" id=\"time-oldbudgetnamewarning\">Budget Name already in use.</div>\n					<div class=\"warning\" id=\"time-budgetnamerequest\">Please enter a budget name.</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Time budget related to </label>\n						<select class=\"time-costfilter\">\n							<option value=\"\" disabled selected>Select</option>\n							<option value=\"user\">User</option>\n							<option value=\"group\">Groups</option>\n						</select>\n					</div>\n				</div>\n\n				<div class=\"sub-insetting\"> \n					<div class=\"sub-incontainer\">\n						<div class=\"hidden\" id=\"time-filter-details\">\n							<select class=\"time-sub-costfilter\">\n								<option value=\"\" disabled selected>Select</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.col : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "							</select>\n						</div>\n					</div>\n					<div class=\"warning\" id=\"time-batchtyperequest\">Please select a Batch Type.</div>\n					<div class=\"warning\" id=\"time-batchnamerequest\">Please select a Batch Name.</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Start date </label>\n						<input type=\"text\" id=\"time-startdate\" placeholder=\"mm/dd/yyyy\">\n						<div class=\"warning\" id=\"time-startdaterequest\">Please select a start date.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">End date </label>\n						<input type=\"text\" id=\"time-enddate\" placeholder=\"mm/dd/yyyy\">\n						<div class=\"warning\" id=\"time-enddatewarning\">Invalid dates selected.</div>\n						<div class=\"warning\" id=\"time-enddaterequest\">Please select an end.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Time Amount </label>\n						<input type=\"text\" id=\"time-amount\" placeholder=\"Hours\">\n						<div class=\"warning\" id=\"time-amountwarning\">Invalid time amount.</div>\n						<div class=\"warning\" id=\"time-amountrequest\">Please enter a time amount.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Under-profile Decay Rate</label>\n						<input type=\"text\" id=\"time-udecay\" placeholder=\"e.g., 3\">\n						<div class=\"warning\" id=\"time-udecaywarning\">Invalid decay rate.</div>\n						<div class=\"warning\" id=\"time-udecayrequest\">Please enter a decay rate.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Over-profile Decay Rate</label>\n						<input type=\"text\" id=\"time-odecay\" placeholder=\"e.g., 2\">\n						<div class=\"warning\" id=\"time-odecaywarning\">Invalid decay rate.</div>\n						<div class=\"warning\" id=\"time-odecayrequest\">Please enter a decay rate.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Min Database Connections</label>\n						<input type=\"text\" id=\"time-mindbconnections\" placeholder=\"e.g., 5\">\n						<div class=\"warning\" id=\"time-mindbconnectionswarning\">Invalid number.</div>\n						<div class=\"warning\" id=\"time-mindbconnectionsrequest\">Please enter a number.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Max Database Connections</label>\n						<input type=\"text\" id=\"time-dbconnections\" placeholder=\"e.g., 50\">\n						<div class=\"warning\" id=\"time-maxdbconnectionswarning\">Invalid number.</div>\n						<div class=\"warning\" id=\"time-maxdbconnectionsrequest\">Please enter a number.</div>\n					</div>\n				</div>\n\n				<div class=\"insetting\"> \n					<div class=\"incontainer\">\n						<label class=\"budget-label\">Stop resource(s) when quota reached </label>\n						<div class=\"onoffswitch\">\n							<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"time-myonoffswitch\" checked>\n							<label class=\"onoffswitch-label\" for=\"myonoffswitch\">\n								<span class=\"onoffswitch-inner\"></span>\n								<span class=\"onoffswitch-switch\"></span>\n							</label>\n						</div>\n					</div>\n				</div>\n			</div>	\n			<div class=\"modal-footer\">\n				<button type=\"button\" class=\"btn btn-default\" id=\"time-savebtn\">Save</button>\n				<button type=\"button\" class=\"btn btn-default\" id=\"time-closebtn\">Close</button>\n			</div>\n		</div>\n\n	</div>\n</div>";
},"useData":true});
templates['UMCostBudgetsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.budgetName : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchType : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchName : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.startDate : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.endDate : depth0), depth0))
    + "</td> \n			<td>"
    + alias2(alias1((depth0 != null ? depth0.amount : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeout : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"BudgetTable\" class=\"hover\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>BudgetName</th>\n			<th>BatchType</th>\n			<th>BatchName</th>\n			<th>StartDate</th>\n			<th>EndDate</th>\n			<th>Amount</th>\n			<th>Stop Instances</th>\n		</tr>\n	</thead>\n	<tbody id=\"budgetData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.budgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>\n";
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
templates['UMTimeBudgetsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.timeBudgetName : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchType : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchName : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.startDate : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.endDate : depth0), depth0))
    + "</td> \n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeAmount : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.udecay : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.odecay : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbConnections : depth0), depth0))
    + "</td>\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeout : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"TimeBudgetTable\" class=\"hover\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>BudgetName</th>\n			<th>BatchType</th>\n			<th>BatchName</th>\n			<th>StartDate</th>\n			<th>EndDate</th>\n			<th>Time Amount</th>\n			<th>uDecay</th>\n			<th>oDecay</th>\n			<th>maxConnections</th>\n			<th>Stop Instances</th>\n		</tr>\n	</thead>\n	<tbody id=\"budgetData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.timebudgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>\n";
},"useData":true});
templates['UMUsageView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"budgetUsageContainer\"></div>\n";
},"useData":true});
templates['UsageMonitorView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\n			<td id="
    + alias2(alias1((depth0 != null ? depth0.budgetName : depth0), depth0))
    + " >"
    + alias2(alias1((depth0 != null ? depth0.budgetName : depth0), depth0))
    + "</td>\n			<td id="
    + alias2(alias1((depth0 != null ? depth0.batchType : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.batchType : depth0), depth0))
    + "</td>\n			<td id="
    + alias2(alias1((depth0 != null ? depth0.batchName : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.batchName : depth0), depth0))
    + "</td>\n			<td id="
    + alias2(alias1((depth0 != null ? depth0.startDate : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.startDate : depth0), depth0))
    + "</td>\n			<td id="
    + alias2(alias1((depth0 != null ? depth0.endDate : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.endDate : depth0), depth0))
    + "</td> \n			<td id="
    + alias2(alias1((depth0 != null ? depth0.amount : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.amount : depth0), depth0))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"BudgetTable\" class=\"display\">\n	<thead>\n		<tr class=\"dark-row\">\n			<th>BudgetName</th>\n			<th>BatchType</th>\n			<th>BatchName</th>\n			<th>StartDate</th>\n			<th>EndDate</th>\n			<th>Amount</th>\n		</tr>\n	</thead>\n	<tbody id=\"budgetData\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.budgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\n</table>\n\n\n<ul class='custom-menu'>\n  <li data-action=\"Edit\"data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\">Edit Instance</li>\n  <li data-action=\"Delete\" data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\" >Delete Instance</li>\n</ul>\n\n";
},"useData":true});
})();