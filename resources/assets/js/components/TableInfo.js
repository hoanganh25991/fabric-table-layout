import Vue from "vue";

export default Vue.extend({
	template: '<div><h1>table info</h1><p>{{ activetable.width * activetable.scaleX }}</p><p>{{ activetable.height * activetable.scaleY }}</p></div>',
	props: {
		activetable: {}
	}

});