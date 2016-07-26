import Vue from "vue";
import $ from "jquery";

export default Vue.extend({
	template: "#table-info-template",

	props: ["layouts", "selectedLayout", "selectedTable", "exportLayoutsCount", "tableEvent"],

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
		layoutsCount: function(){
			if(this.layouts){
				return this.layouts.length;
			}
			return 0;
		},
	},

	watch: {
		'selectedTable': function(val){
			this.updateTableInfo(val);
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
			this.width = table.width * table.scaleX;
			this.height = table.height * table.scaleY;
			this.top = table.top;
			this.left =  table.left;
			this.rotation = table.angle;
		},
		
		round(props){
			
		},

		exportLayouts: function(){
			this.exportLayoutsDivShowed = true;
			// this.$dispatch("broadcast-export-layouts");
			console.log(JSON.stringify(this.layouts));
		}
	},

	events: {
		"export-layouts-complete": function(){
			console.log("export-layouts-complete");
			this.exportLayoutsDivShowed = false;

		},
	},
	
	ready(){
	}
});