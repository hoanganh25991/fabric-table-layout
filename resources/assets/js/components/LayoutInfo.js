import Vue from "vue";

export default Vue.extend({
	template: "<span>{{ name }}</span>",
	
	props: ["layout"],

	computed: {
		name: function(){
			if(this.layout){
				return this.layout.name;
			}
			return "";
		}
	}
});