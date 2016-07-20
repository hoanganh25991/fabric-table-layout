import Vue from "vue";

import LayoutInfo from "./components/LayoutInfo";
import LayoutTable from "./components/LayoutTable";
import TableInfo from "./components/TableInfo";
import $ from "jquery";


new Vue({
	el: "#tinker",
	components: {LayoutInfo, LayoutTable, TableInfo},

	data: {
		layouts: []
	},


	convertToSlug(Text){
		return Text
			.toLowerCase()
			.replace(/[^\w ]+/g, '')
			.replace(/ +/g, '-')
			;
	}
});
console.log("hello");
