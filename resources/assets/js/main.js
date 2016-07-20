import Vue from "vue";

import LayoutInfo from "./components/LayoutInfo";
import LayoutTable from "./components/LayoutTable";
import TableInfo from "./components/TableInfo";
import $ from "jquery";


new Vue({
	el: "#tinker",
	components: {LayoutInfo, LayoutTable, TableInfo},

	props: ["selectedLayout"],

	data: {
		layouts: [],
		askLayoutNameDivShowed: false,
	},

	convertToSlug(Text){
		return Text
			.toLowerCase()
			.replace(/[^\w ]+/g, '')
			.replace(/ +/g, '-')
			;
	},

	methods: {
		askLayoutName: function(){
			this.askLayoutNameDivShowed = true;
		},
		
		createLayout: function(){
			let inputLayutName =  $("input[name='newLayoutName']");
			let newLayoutName = inputLayutName.val();
			console.log(newLayoutName);
			let layout = {name: newLayoutName, canvasId: Date.now()};
			
			this.layouts.push(layout);

			this.selectedLayout = layout;
			
			//hide 
			this.askLayoutNameDivShowed = false;
			//clear
			inputLayutName.val("");

		}
	}
});
console.log("hello");
