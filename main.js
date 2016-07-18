// import TableLayout from "TableLayout";
var TableLayout = Vue.extend({
	template: '<div class="row">' +
		'<div class="col-md-4"><p>hello</p></div>' +
	'<div class="col-md-8"><p>hello</p></div>' +
	'</div>',
	props:{

	}
});
new Vue({
	el: "#layout1",
	components: {TableLayout}
});