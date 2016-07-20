import Vue from "vue";

export default Vue.extend({
	template: "#table-info-template",

	props: ["selectedLayout"],

	data(){
		return {
		}
	},

	computed: {
		name: function(){
			if(this.selectedLayout){
				return this.selectedLayout.name;
			}
			return "";
		}

	}
});