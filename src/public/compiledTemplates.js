(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['AppView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"content-view\"> </div>\r\n";
},"useData":true});
templates['AWSMonthlyCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"awsmonthlycostcontainer\"></div>\r\n\r\n";
},"useData":true});
templates['AWSOperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"awsoperationscontainer\"> </div>";
},"useData":true});
templates['AWSView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['BaseModalView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "\r\n<!-- Modal -->\r\n<div class=\"modal fade\" id=\"base-modal\" role=\"dialog\">\r\n  <div class=\"modal-dialog\">\r\n\r\n    <!-- Modal content-->\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n        <h4 class=\"modal-title\"></h4>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n     </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"action\">Delete</button>\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"cancel\">Cancel</button>\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n</div>\r\n\r\n";
},"useData":true});
templates['BudgetView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "								<option value="
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n<!-- Modal -->\r\n<div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\r\n	<div class=\"modal-dialog\">\r\n\r\n		<!-- Modal content-->\r\n		<div class=\"modal-content\">\r\n			<div class=\"modal-header\">\r\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n				<h4 class=\"modal-title\">Create Cost Budget Profile <i class=\"fa fa-question-circle\" id =\"CreateCBudget\" data-toggle=\"tooltip\" title=\"Info here about Cost Budgets\"></i></h4>\r\n			</div>\r\n			<div class=\"modal-body\">\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Name <i class=\"fa fa-question-circle\" id =\"BudgetName\" data-toggle=\"tooltip\" title=\"Unique name assigned to this Cost Budget\"></i></label>\r\n						<input type=\"text\" id=\"budgetname\" placeholder=\"e.g., 'Monthly EC2 Budget'\">\r\n					</div>\r\n					<div class=\"warning\" id=\"budgetnamewarning\">Invalid budget Name.</div>\r\n					<div class=\"warning\" id=\"oldbudgetnamewarning\">Budget Name already in use.</div>\r\n					<div class=\"warning\" id=\"budgetnamerequest\">Please enter a budget name.</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Track costs associated to <i class=\"fa fa-question-circle\" id =\"AssociatedTo\" data-toggle=\"tooltip\" title=\"User or group this budget applies to\"></i></label>\r\n						<select class=\"costfilter\">\r\n							<option value=\"\" disabled selected>Select</option>\r\n							<option value=\"user\">User</option>\r\n							<option value=\"group\">Groups</option>\r\n						</select>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"sub-insetting\"> \r\n					<div class=\"sub-incontainer\">\r\n						<div class=\"hidden\" id=\"filter-details\">\r\n							<select class=\"sub-costfilter\">\r\n								<option value=\"\" disabled selected>Select</option>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.col : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "							</select>\r\n						</div>\r\n					</div>\r\n					<div class=\"warning\" id=\"batchtyperequest\">Please select a Batch Type.</div>\r\n					<div class=\"warning\" id=\"batchnamerequest\">Please select a Batch Name.</div>\r\n				</div>\r\n\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Start date <i class=\"fa fa-question-circle\" id =\"StartDate\" data-toggle=\"tooltip\" title=\"Date when budget begins\"></i></label>\r\n						<input type=\"text\" id=\"startdate\" placeholder=\"mm/dd/yyyy\">\r\n						<div class=\"warning\" id=\"startdaterequest\">Please select a start date.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">End date <i class=\"fa fa-question-circle\" id =\"EndDate\" data-toggle=\"tooltip\" title=\"Date of termination for budget\"></i></label>\r\n						<input type=\"text\" id=\"enddate\" placeholder=\"mm/dd/yyyy\">\r\n						<div class=\"warning\" id=\"enddatewarning\">Invalid dates selected.</div>\r\n						<div class=\"warning\" id=\"enddaterequest\">Please select an end.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Cost Amount <i class=\"fa fa-question-circle\" id =\"CostAmount\" data-toggle=\"tooltip\" title=\"Dollar amount the associated user/group is allocated between start and end dates\"></i></label>\r\n						<input type=\"text\" id=\"amount\" placeholder=\"USD\">\r\n						<div class=\"warning\" id=\"amountwarning\">Invalid amount.</div>\r\n						<div class=\"warning\" id=\"amountrequest\">Please enter an amount.</div>\r\n					</div>\r\n				</div>\r\n\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Stop resource(s) when quota reached <i class=\"fa fa-question-circle\" id =\"Stop\" data-toggle=\"tooltip\" title=\"Stop instance when budget is exceeded?\"></i></label>\r\n						<div class=\"onoffswitch\">\r\n							<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"myonoffswitch\" checked>\r\n							<label class=\"onoffswitch-label\" for=\"myonoffswitch\">\r\n								<span class=\"onoffswitch-inner\"></span>\r\n								<span class=\"onoffswitch-switch\"></span>\r\n							</label>\r\n						</div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n			<div class=\"modal-footer\">\r\n				<button type=\"button\" class=\"btn btn-default\" id=\"savebtn\">Save</button>\r\n				<button type=\"button\" class=\"btn btn-default\" id=\"closebtn\">Close</button>\r\n			</div>\r\n		</div>\r\n\r\n	</div>\r\n</div>\r\n\r\n\r\n\r\n";
},"useData":true});
templates['ConfigurationView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"config-label\">Account Number <i class=\"fa fa-question-circle\" id =\"AccountNumTooltip\" data-toggle=\"tooltip\" title=\"This is your account number set in config\"></i></label>\r\n						<div type=\"text\" class=\"account\" value=\"012345678910\"></div>\r\n						"
    + alias2(alias1((depth0 != null ? depth0.number : depth0), depth0))
    + "\r\n					</div>\r\n				</div>\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"config-label\">S3 Bucket Region <i class=\"fa fa-question-circle\" id =\"S3BucketRegion\" data-toggle=\"tooltip\" title=\"The region where your S3 bucket is located\"></i></label>\r\n						<div type=\"text\" class=\"account\" value=\"\">"
    + alias2(alias1((depth0 != null ? depth0.s3 : depth0), depth0))
    + "</div>\r\n					</div>\r\n				</div>\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"config-label\">S3 Bucket Name <i class=\"fa fa-question-circle\" id =\"S3BucketName\" data-toggle=\"tooltip\" title=\"The name of the S3 bucket where invoices are saved\"></i></label>\r\n						<div type=\"text\" class=\"account\" value=\"\">"
    + alias2(alias1((depth0 != null ? depth0.bucketName : depth0), depth0))
    + "</div>\r\n					</div>\r\n				</div>\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"config-label\">DB URL <i class=\"fa fa-question-circle\" id =\"DBURL\" data-toggle=\"tooltip\" title=\"Location of your database\"></i></label>\r\n						<div type=\"text\" class=\"account\" value=\"\" disabled>"
    + alias2(alias1((depth0 != null ? depth0.URL : depth0), depth0))
    + "</div>\r\n					</div>\r\n				</div>\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\"><i class=\"fa fa-question-circle\" id =\"Expiration\" data-toggle=\"tooltip\" title=\"Expiration date of AWS credits. Value can be found by following the link at the top\"></i>\r\n						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\r\n							<input class=\"mdl-textfield__input\" type=\"text\" pattern=\"^(19|20)\\d\\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$\" id='expDate'/>\r\n							<label class=\"mdl-textfield__label\" for=\"expiration\">Credit Expiration (YYYY/MM/DD)</label>\r\n							<span class=\"mdl-textfield__error\">Input is not a date!</span>\r\n						</div>\r\n					</div>\r\n					<div class=\"incontainer\"><i class=\"fa fa-question-circle\" id =\"CreditsRemaining\" data-toggle=\"tooltip\" title=\"Number of remaining AWS credits. Value can be found by following the link at the top\"></i>\r\n						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\r\n							<input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"myCredits\" />\r\n						    <label class=\"mdl-textfield__label\" for=\"myCredits\">Credits</label>\r\n						    <span class=\"mdl-textfield__error\">Input is not a number!</span>\r\n						</div>\r\n					</div>\r\n					<div class=\"incontainer\"><i class=\"fa fa-question-circle\" id =\"CreditsUsed\" data-toggle=\"tooltip\" title=\"Number of used AWS credits. Value can be found by following the link at the top\"></i>\r\n						<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo\">\r\n							<input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"creditsUsed\" />\r\n						    <label class=\"mdl-textfield__label\" for=\"creditsUsed\">Credits Used</label>\r\n						    <span class=\"mdl-textfield__error\">Input is not a number!</span>\r\n						</div>\r\n					</div>\r\n				</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- Modal -->\r\n<div id=\"myModal2\" class=\"modal fade\" role=\"dialog\">\r\n	<div class=\"modal-dialog\">\r\n		<!-- Modal content-->\r\n		<div class=\"modal-content\">\r\n			<div class=\"modal-header\">\r\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n				<h4 class=\"modal-title\"> AWS Account Settings <i class=\"fa fa-question-circle\" id =\"AccountSettings\" data-toggle=\"tooltip\" title=\"General Info regarding account settings\"></i></h4>\r\n				<p>For best accuracy, please input credits and credits used information information soon after Amazon updates the invoice for your account. This is usually at the end of the first week of the month. Info found at <b>https://console.aws.amazon.com/billing/home</b> by clicking the \"Credits\" link on the left side of the page<p> \r\n			</div>\r\n			<div class=\"modal-body\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "			</div>\r\n			<div class=\"modal-footer\">\r\n				<p>To modify account settings, go to \\AWSDelegator\\src\\server\\config.js</p>\r\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"saveConfig\">Save</button>\r\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
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

  return "		<tr>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.userName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.groupName : depth0), depth0))
    + "</td>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.zone : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.lifetime : depth0), depth0))
    + " min</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.launchTime : depth0), depth0))
    + "</td> \r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"EC2InstanceTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>User Name</th>\r\n			<th>Group Name</th>\r\n			<th>Instance ID</th>\r\n			<th>Type</th>\r\n			<th>State</th>\r\n			<th>Zone</th>\r\n			<th>Lifetime</th>\r\n			<th>Launched</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n\r\n\r\n\r\n";
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

  return "		<tr>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.dbIdentifier : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbClass : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbStatus : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.dbName : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.userName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.groupName : depth0), depth0))
    + "</td>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.instance : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.instanceType : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.state : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- <table id=\"RDSInstanceTable\" class=\"display\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>Identifier</th>\r\n			<th>Class</th>\r\n			<th>Status</th>\r\n			<th>DBName</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rdsinstances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table> -->\r\n\r\n<table id=\"EC2InstanceTable\" class=\"display\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>User Name</th>\r\n			<th>Group Name</th>\r\n			<th>Instance ID</th>\r\n			<th>Type</th>\r\n			<th>State</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.ec2instances : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>";
},"useData":true});
templates['HeaderView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "\r\n<div id=\"settings-tooltip\" data-toggle=\"tooltip\" title=\"Settings\"data-placement=\"bottom\"><div id=\"settings\" class=\"setting\" data-toggle=\"modal\" data-target=\"#myModal2\"><i class=\"fa fa-cog fa-1x\"></i></div></div>\r\n\r\n<div id=\"cost-tooltip\" data-toggle=\"tooltip\" title=\"Cost Budget\"data-placement=\"bottom\"><div id=\"budgets\" class=\"budget\" data-toggle=\"modal\" data-target=\"#myModal\"> </div></div>\r\n\r\n<div id=\"time-tooltip\" data-toggle=\"tooltip\" title=\"Time Budget\"data-placement=\"bottom\"><div id=\"timeBudgets\" class=\"timeBudgets\" data-toggle=\"modal\" data-target=\"#timeBudgetModal\"> </div></div>\r\n\r\n<!-- Number badge on icon -->\r\n<div class=\"mdl-badge\" data-badge=\"\"></div>\r\n<div ><div class=\"notify\"data-toggle=\"tooltip\" title=\"Notifications\" data-placement=\"bottom\"><i class=\"fa fa-bell fa-1x\"></i></div></div>\r\n\r\n<div class=\"menu\"><i class=\"fa fa-bars fa-1x\"></i></div>\r\n\r\n";
},"useData":true});
templates['IAMGroupsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.costBudgetNames : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeBudgetNames : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"GroupsTable\" class=\"display\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>GroupName</th>\r\n			<th>CreateDate</th>\r\n			<th>CostBudgetName/s</th>\r\n			<th>TimeBudgetName/s</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n";
},"useData":true});
templates['IAMUsersView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.createDate : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.costBudgetNames : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeBudgetNames : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"UsersTable\" class=\"display\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>UserName</th>\r\n			<th>CreateDate</th>\r\n			<th>CostBudgetName/s</th>\r\n			<th>TimeBudgetName/s</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"instanceData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.instances : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>";
},"useData":true});
templates['IAMView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['MeterView'] = template({"1":function(depth0,helpers,partials,data) {
    return "		$"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "/Hour\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "		$"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "	 	$"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n<script type=\"text/javascript\">\r\n$(document).ready(function() {\r\n    $(\"body\").tooltip({ selector: '[data-toggle=tooltip]' });\r\n});\r\n</script>\r\n\r\n<div class=\"rate\"data-toggle=\"tooltip\" title=\"Rate of cost per hour\" data-placement=\"bottom\">Rate: \r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rate : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n\r\n\r\n<div class=\"usage\"data-toggle=\"tooltip\" title=\"Current usage from specified start/end date\" data-placement=\"bottom\">Credits Used:\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.usage : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n\r\n<div class=\"balance\" data-toggle=\"tooltip\" title=\"Current remaining balance\" data-placement=\"bottom\">Balance:\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.balance : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n\r\n";
},"useData":true});
templates['NavView'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "<div class=\"page\" page-id=\""
    + alias2(alias1((depth0 != null ? depth0.page_id : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\r\n\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Amazon EC2 Service",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Amazon RDS Service",{"name":"ifCond","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.title : depth0),"==","Usage Monitor",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"0\"> EC2 Instances</div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"1\"> RDS Instances</div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "<div class=\"subpage\" subpage-id=\"2\"> Cost Budgets</div>\r\n<div class=\"subpage\" subpage-id=\"3\"> Time Budgets</div>\r\n";
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
    + "\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"notification-content\"> \r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.notifications : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
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
    return "<div id=\"rdsCpuContainer\"></div>\r\n<div id=\"readWriteIopsContainer\"></div>\r\n<div id=\"queueDepthContainer\"></div>\r\n<div id=\"dbConnectionsContainer\"></div>\r\n<div class=\"clear\"></div>";
},"useData":true});
templates['TimeBudgetView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "								<option value="
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- Modal -->\r\n<div class=\"modal fade\" id=\"timeBudgetModal\" role=\"dialog\">\r\n	<div class=\"modal-dialog\">\r\n\r\n		<!-- Modal content-->\r\n		<div class=\"modal-content\">\r\n			<div class=\"modal-header\">\r\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n				<h4 class=\"modal-title\">Create Time Budget Profile <i class=\"fa fa-question-circle\" id =\"CreateTimeBudget\" data-toggle=\"tooltip\" title=\"Info here about Time Budgets\"></i></h4>\r\n			</div>\r\n			<div class=\"modal-body\">\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Name <i class=\"fa fa-question-circle\" id =\"TimeBudgetName\" data-toggle=\"tooltip\" title=\"Unique name assigned to this Time Budget\"></i></label>\r\n						<input type=\"text\" id=\"time-budgetname\" placeholder=\"e.g., 'Monthly EC2 Budget'\">\r\n					</div>\r\n					<div class=\"warning\" id=\"time-budgetnamewarning\">Invalid budget Name.</div>\r\n					<div class=\"warning\" id=\"time-oldbudgetnamewarning\">Budget Name already in use.</div>\r\n					<div class=\"warning\" id=\"time-budgetnamerequest\">Please enter a budget name.</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Time budget related to <i class=\"fa fa-question-circle\" id =\"TimeBudgetAssociatedTo\" data-toggle=\"tooltip\" title=\"User or group this budget applies to\"></i></label>\r\n						<select class=\"time-costfilter\">\r\n							<option value=\"\" disabled selected>Select</option>\r\n							<option value=\"user\">User</option>\r\n							<option value=\"group\">Groups</option>\r\n						</select>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"sub-insetting\"> \r\n					<div class=\"sub-incontainer\">\r\n						<div class=\"hidden\" id=\"time-filter-details\">\r\n							<select class=\"time-sub-costfilter\">\r\n								<option value=\"\" disabled selected>Select</option>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.col : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "							</select>\r\n						</div>\r\n					</div>\r\n					<div class=\"warning\" id=\"time-batchtyperequest\">Please select a Batch Type.</div>\r\n					<div class=\"warning\" id=\"time-batchnamerequest\">Please select a Batch Name.</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Start date <i class=\"fa fa-question-circle\" id =\"StartDate\" data-toggle=\"tooltip\" title=\"Date when budget begins\"></i></label>\r\n						<input type=\"text\" id=\"time-startdate\" placeholder=\"mm/dd/yyyy\">\r\n						<div class=\"warning\" id=\"time-startdaterequest\">Please select a start date.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">End date <i class=\"fa fa-question-circle\" id =\"EndDate\" data-toggle=\"tooltip\" title=\"Date of termination for budget\"></i></label>\r\n						<input type=\"text\" id=\"time-enddate\" placeholder=\"mm/dd/yyyy\">\r\n						<div class=\"warning\" id=\"time-enddatewarning\">Invalid dates selected.</div>\r\n						<div class=\"warning\" id=\"time-enddaterequest\">Please select an end.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Time Amount <i class=\"fa fa-question-circle\" id =\"TimeAmount\" data-toggle=\"tooltip\" title=\"Number of hours of time in use for instance during budget duration\"></i></label>\r\n						<input type=\"text\" id=\"time-amount\" placeholder=\"Hours\">\r\n						<div class=\"warning\" id=\"time-amountwarning\">Invalid time amount.</div>\r\n						<div class=\"warning\" id=\"time-amountrequest\">Please enter a time amount.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Under-profile Decay Rate <i class=\"fa fa-question-circle\" id =\"UnderProfile\" data-toggle=\"tooltip\" title=\"Rate at which hours of usage are consumed when the instance is being used less than what is optimal\"></i></label>\r\n						<input type=\"text\" id=\"time-udecay\" placeholder=\"e.g., 3\">\r\n						<div class=\"warning\" id=\"time-udecaywarning\">Invalid decay rate.</div>\r\n						<div class=\"warning\" id=\"time-udecayrequest\">Please enter a decay rate.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Over-profile Decay Rate <i class=\"fa fa-question-circle\" id =\"OverProfile\" data-toggle=\"tooltip\" title=\"Rate at which hours of usage are consumed when the instance is being used more than what is optimal\"></i></label>\r\n						<input type=\"text\" id=\"time-odecay\" placeholder=\"e.g., 2\">\r\n						<div class=\"warning\" id=\"time-odecaywarning\">Invalid decay rate.</div>\r\n						<div class=\"warning\" id=\"time-odecayrequest\">Please enter a decay rate.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Min Database Connections <i class=\"fa fa-question-circle\" id =\"minDatabase\" data-toggle=\"tooltip\" title=\"Minimum number of acceptable database connections at a given time\"></i></label>\r\n						<input type=\"text\" id=\"time-minDB\" placeholder=\"e.g., 5\">\r\n						<div class=\"warning\" id=\"time-minDBwarning\">Invalid number.</div>\r\n						<div class=\"warning\" id=\"time-minDBrequest\">Please enter a number.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Max Database Connections <i class=\"fa fa-question-circle\" id =\"maxDatabase\" data-toggle=\"tooltip\" title=\"Maximum number of acceptable database connections at a given time\"></i></label>\r\n						<input type=\"text\" id=\"time-maxDB\" placeholder=\"e.g., 50\">\r\n						<div class=\"warning\" id=\"time-maxDBwarning\">Invalid number.</div>\r\n						<div class=\"warning\" id=\"time-maxDBrequest\">Please enter a number.</div>\r\n					</div>\r\n				</div>\r\n\r\n				<div class=\"insetting\"> \r\n					<div class=\"incontainer\">\r\n						<label class=\"budget-label\">Stop resource(s) when quota reached <i class=\"fa fa-question-circle\" id =\"TimeBudgetStop\" data-toggle=\"tooltip\" title=\"Stop instance when provided time is exceeded?\"></i></label>\r\n						<div class=\"onoffswitch\">\r\n							<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"time-myonoffswitch\" checked>\r\n							<label class=\"onoffswitch-label\" for=\"time-myonoffswitch\">\r\n								<span class=\"onoffswitch-inner\"></span>\r\n								<span class=\"onoffswitch-switch\"></span>\r\n							</label>\r\n						</div>\r\n					</div>\r\n				</div>\r\n			</div>	\r\n			<div class=\"modal-footer\">\r\n				<button type=\"button\" class=\"btn btn-default\" id=\"time-savebtn\">Save</button>\r\n				<button type=\"button\" class=\"btn btn-default\" id=\"time-closebtn\">Close</button>\r\n			</div>\r\n		</div>\r\n\r\n	</div>\r\n</div>";
},"useData":true});
templates['UMCostBudgetsView'] = template({"1":function(depth0,helpers,partials,data) {
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
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeout : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"BudgetTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>BudgetName</th>\r\n			<th>BatchType</th>\r\n			<th>BatchName</th>\r\n			<th>StartDate</th>\r\n			<th>EndDate</th>\r\n			<th>Amount</th>\r\n			<th>Stop</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"budgetData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.budgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n";
},"useData":true});
templates['UMCostView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"budgetCostContainer\"></div>\r\n";
},"useData":true});
templates['UMGroupUserServiceView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"groupUserServiceContainer\"></div>\r\n";
},"useData":true});
templates['UMOperationsView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"serviceContainer\"></div>\r\n";
},"useData":true});
templates['UMTimeBudgetsView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.timeBudgetName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchType : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.batchName : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.startDate : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.endDate : depth0), depth0))
    + "</td> \r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeAmount : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.udecay : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.odecay : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.minDB : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.maxDB : depth0), depth0))
    + "</td>\r\n			<td>"
    + alias2(alias1((depth0 != null ? depth0.timeout : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n<table id=\"TimeBudgetTable\" class=\"hover\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>BudgetName</th>\r\n			<th>BatchType</th>\r\n			<th>BatchName</th>\r\n			<th>StartDate</th>\r\n			<th>EndDate</th>\r\n			<th>Time Amount</th>\r\n			<th>uDecay</th>\r\n			<th>oDecay</th>\r\n			<th>minDB</th>\r\n			<th>maxDB</th>\r\n			<th>TimeOut</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"timeBudgetData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.timebudgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n\r\n<ul class='custom-menu'>\r\n  <li data-action=\"Edit\"data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\">Edit Instance</li>\r\n  <li data-action=\"Delete\" data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\" >Delete Instance</li>\r\n</ul>\r\n\r\n";
},"useData":true});
templates['UMUsageView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"budgetUsageContainer\"></div>\r\n";
},"useData":true});
templates['UsageMonitorView'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<tr>\r\n			<td id="
    + alias2(alias1((depth0 != null ? depth0.budgetName : depth0), depth0))
    + " >"
    + alias2(alias1((depth0 != null ? depth0.budgetName : depth0), depth0))
    + "</td>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.batchType : depth0), depth0))
    + "</td>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.batchName : depth0), depth0))
    + "</td>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.startDate : depth0), depth0))
    + "</td>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.endDate : depth0), depth0))
    + "</td> \r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.amount : depth0), depth0))
    + "</td>\r\n			<td >"
    + alias2(alias1((depth0 != null ? depth0.timeout : depth0), depth0))
    + "</td>\r\n		</tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<table id=\"BudgetTable\" class=\"display\">\r\n	<thead>\r\n		<tr class=\"dark-row\">\r\n			<th>BudgetName</th>\r\n			<th>BatchType</th>\r\n			<th>BatchName</th>\r\n			<th>StartDate</th>\r\n			<th>EndDate</th>\r\n			<th>Amount</th>\r\n			<th>Stop</th>\r\n		</tr>\r\n	</thead>\r\n	<tbody id=\"budgetData\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.budgets : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>	\r\n</table>\r\n\r\n\r\n<ul class='custom-menu'>\r\n  <li data-action=\"Edit\"data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\">Edit Instance</li>\r\n  <li data-action=\"Delete\" data-toggle=\"modal\" data-target=\"#base-modal\" data-backdrop=\"static\" data-keyboard=\"false\" >Delete Instance</li>\r\n</ul>\r\n\r\n";
},"useData":true});
})();