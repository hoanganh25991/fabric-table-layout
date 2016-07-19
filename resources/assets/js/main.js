import Vue from "vue";

import TableInfo from "./components/TableInfo";
import TableLayout from "./components/TableLayout";
import $ from "jquery";


new Vue({
	el: "#test",
	components: {TableInfo, TableLayout},

	data: function(){
		return {
			layout: {
				name: ""
			}
		};
	},

	methods: {
		createLayout: function(){
			console.log(this.layout.name);
			let layoutName = this.layout.name;

			//slug layout-name for id, html tag
			this.layout.name = convertToSlug(this.layout.name);
			console.log(`after slug: ${this.layout.name}`);

			//append <li> to tab-list
			let li = $(`
				<li role="presentation">
					<a href="#${this.layout.name}"
						aria-controls="${this.layout.name}"
						role="tab" data-toggle="tab"
						>${layoutName}
					</a>
				</li>
			`);
			$("#layoutList").append(li);

			//append <table-layout> to tab-content
			let div = $(`
				<div role="tabpanel" class="tab-pane" id="${this.layout.name}">
					<table-layout :name="${layoutName}"></table-layout>
				</div>
			`);
			$("#layoutContainer").append(div);



		}
	}
});
function convertToSlug(Text)
{
	return Text
		.toLowerCase()
		.replace(/[^\w ]+/g,'')
		.replace(/ +/g,'-')
		;
}
console.log("hello");
