import Vue from "vue";

import TableInfo from "./components/TableInfo";
import TableLayout from "./components/TableLayout";

new Vue({
	el: "#test",
	components: {TableInfo, TableLayout},

	data: function(){
		return {
			activetable: {
				width: 0,
				height: 0,
				scaleX: 1,
				scaleY: 1
			}
		};
	}
});