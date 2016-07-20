import Vue from "vue";

export default Vue.extend({
	template: "#layout-info-template",
	
	props: ["layouts", "layout", "selectedLayout"],
	
	data(){
		return {
			active: false
		}
	},

	computed: {
		name: function(){
			if(this.layout){
				return this.layout.name;
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
		// this.selected = true;
	},
	
	methods: {
		setSelectedLayout: function(){
			this.selectedLayout = this.layout;
		}
	}
});