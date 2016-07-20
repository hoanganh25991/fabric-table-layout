import Vue from "vue";
import $ from "jquery";

export default Vue.extend({
	template: "#table-info-template",

	props: ["selectedLayout", "selectedTable"],

	data(){
		return {
			askTableNameDivShowed: false,
			width: "-",
			height: "-",
			top: "-",
			left: "-",
			rotation: "-",
		}
	},

	computed: {
		name: function(){
			if(this.selectedLayout){
				return this.selectedLayout.name;
			}
			return "";
		},
	},

	methods: {
		askTableName: function(){
			this.askTableNameDivShowed = true;
		},

		createTable: function(){
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
		
	},
});