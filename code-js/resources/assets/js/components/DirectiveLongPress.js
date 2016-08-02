import Vue from 'vue';
export default Vue.directive('longpress', {
	bind: function(){},
	update: function(val, oldVal){
		console.log(`longpress`, val, oldVal);
	}
});