import Vue from "vue";

import LayoutInfo from "./components/LayoutInfo";
import LayoutTable from "./components/LayoutTable";
import TableInfo from "./components/TableInfo";
import $ from "jquery";


new Vue({
	el: "#tinker",
	components: {LayoutInfo, LayoutTable, TableInfo},

	props: ["selectedLayout", "selectedTable"],

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
			let inputLayoutName =  $("input[name='newLayoutName']");
			let newLayoutName = inputLayoutName.val();
			console.log(newLayoutName);
			let layout = {name: newLayoutName, canvasId: Date.now()};
			
			this.layouts.push(layout);

			this.selectedLayout = layout;
			
			//hide 
			this.askLayoutNameDivShowed = false;
			//clear
			inputLayoutName.val("");

		},

		handleNewTableName: function(tableName){
			console.log(`parent handle [new table name]: ${tableName}`);
			console.log(`parent broadcast [create-table] to children,
			layout-table hanlde this event`);
			this.$broadcast("create-table", tableName);
		},

		broadcastTableOnScaling: function(table){
			console.log("parent broadcast [table-on-scaling]");
			this.$broadcast("table-on-scaling", table);
		},
		
		broadcastTableSelected: function(table){
			console.log("parent broadcast [table-selected]");
			this.$broadcast("table-selected", table);
		},
		
		broadcastTableOnRotating: function(table){
			console.log("parent broadcast [table-on-rotating]");
			this.$broadcast("table-on-rotating", table);
		},
	},
});