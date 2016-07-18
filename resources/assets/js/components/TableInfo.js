import Vue from "vue";

export default Vue.extend({
	template: '<div><h1>table info</h1><p>{{ width }}</p><p>{{ height }}</p></div>',
	data: function(){
		return {
			width: 0,
			height: 0,
			scaleX: 1,
			scaleY: 1
		}
	}
});