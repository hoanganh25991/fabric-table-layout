import Vue from "vue";
import $ from "jquery";

export default Vue.extend({
	template: "#table-info-template",

	props: ["layouts", "selectedLayout", "selectedTable", "exportLayoutsCount"],

	data(){
		return {
			askTableNameDivShowed: false,
			width: "-",
			height: "-",
			top: "-",
			left: "-",
			rotation: "-",
			exportLayoutsDivShowed: false,
		}
	},

	computed: {
		name: function(){
			if(this.selectedLayout){
				return this.selectedLayout.name;
			}
			return "";
		},
		
		layoutsCount: function(){
			if(this.layouts){
				return this.layouts.length;
			}
			return 0;
		}
	},

	methods: {
		askTableName: function(){
			this.askTableNameDivShowed = true;
		},

		getTableName: function(){
			console.log(this.selectedTable);
			let inputNewTableName = $("input[name='newTableName']");
			let newTableName = inputNewTableName.val();
			console.log(`create table: ${newTableName}`);

			//fire a event
			this.$dispatch("new-table-name", newTableName);

			//hide
			this.askTableNameDivShowed = false;
			inputNewTableName.val("");
		},

		updateTableInfo: function(table){
			console.log(`log selecteTable: ${table}`);
			this.width = Math.floor(table.width * table.scaleX);
			this.height = Math.floor(table.height * table.scaleY);
			this.top = Math.floor(table.top);
			this.left =  Math.floor(table.left);
			this.rotation = Math.floor(table.angle);
		},

		exportLayouts: function(){
			this.exportLayoutsDivShowed = true;
			this.$dispatch("broadcast-export-layouts");
		}
	},

	events: {
		"table-selected": function(table){
			console.log("table-info handle [table-selected]");
			this.updateTableInfo(table);
		},
		
		"table-on-scaling": function(table){
			console.log("table-info handle [table-on-scaling]");
			this.updateTableInfo(table);
		},
		
		"table-on-rotating": function(table){
			console.log("table-info handle [table-on-scaling]");
			this.updateTableInfo(table);
		},

		"export-layouts-complete": function(){
			console.log("export-layouts-complete");
			this.exportLayoutsDivShowed = false;

		}
		
	},
});