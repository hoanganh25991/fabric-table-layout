import Vue from "vue";

export default Vue.extend({
	template: "#layout-table-template",
	
	props: ["layout", "selectedLayout"],

	computed: {
		name: function(){
			if(this.layout){
				return this.layout.name;
			}

			return "";
		},

		id: function(){
			if(this.layout){
				return this.layout.canvasId;
			}

			return "";
		},

		active: function(){
			if(!this.layout){
				return false;
			}
			
			if(!this.selectedLayout){
				return false;
			}

			return (this.layout.name == this.selectedLayout.name);
		}
	},

	ready(){
		let canvas = new fabric.Canvas(this.$els.canvas.id);
		console.log(this.id);
		canvas.setWidth(500);
		canvas.setHeight(500);
	},

	methods: {
		handleCreateTable: function(tableName){
			console.log(`layout-table handle create table: ${tableName}`);
		}
	}
});