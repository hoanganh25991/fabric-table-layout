import Vue from "vue";

export default Vue.extend({
	template: "#layout-table-template",
	
	props: ["layout", "selectedLayout"],

	computed: {
		name: function(){
			if(this.layout){
				return this.layout.name;
			}
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
	}
});