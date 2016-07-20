import Vue from "vue";
import $ from "jquery";

export default Vue.extend({
	template: "#table-info-template",

	props: ["selectedLayout"],

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
		}

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
			this.$dispatch("create-table", newTableName);

			//hide
			this.askTableNameDivShowed = false;
			inputNewTableName.val("");
		}
	}
});