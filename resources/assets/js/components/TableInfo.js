import Vue from "vue";
import $ from "jquery";

export default Vue.extend({
	template: "#table-info-template",

	props: ["selectedLayout", "selectedTable"],

	data(){
		return {
			askTableNameDivShowed: false,
		}
	},

	computed: {
		name: function(){
			if(this.selectedLayout){
				return this.selectedLayout.name;
			}
			return "";
		},

		width: function(){
			if(this.selectedTable){
				console.log(this.selectedTable);
				return Math.floor(this.selectedTable.width * this.selectedTable.scaleX);
			}
			return "-";
		},

		height: function(){
			if(this.selectedTable){
				return Math.floor(this.selectedTable.height * this.selectedTable.scaleY);
			}
			return "-";
		},

		top: function(){
			if(this.selectedTable){
				return Math.floor(this.selectedTable.top);
			}
			return "-";
		},

		left: function(){
			if(this.selectedTable){
				return Math.floor(this.selectedTable.left);
			}
			return "-";
		},

		rotation: function(){
			if(this.selectedTable){
				return Math.floor(this.selectedTable.scaleX);
			}
			return "-";
		},

	},

	methods: {
		askTableName: function(){
			this.askTableNameDivShowed = true;
		},

		createTable: function(){
			let inputNewTableName = $("input[name='newTableName']");
			let newTableName = inputNewTableName.val();
			console.log(`create table: ${newTableName}`);

			//fire a event
			this.$dispatch("new-table-name", newTableName);

			//hide
			this.askTableNameDivShowed = false;
			inputNewTableName.val("");
		}
	},

	events: {
		"table-on-scaling": function(){
			this.width = Math.floor(this.selectedTable.width * this.selectedTable.scaleX);
			this.height = Math.floor(this.selectedTable.height * this.selectedTable.scaleY);
		}
	}
});