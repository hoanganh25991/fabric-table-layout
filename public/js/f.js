// export default {
// 	isString(){
// 		return typeof val == "string" || val instanceof String;
// 	},
//
// 	isArray(){
// 		return Array.isArray(val);
// 	},
//
// 	round(props, obj){
// 		if(this.isString(props)){
// 			obj[props] = Math.floor(obj[props]);
// 		}
//
// 		if(this.isArray(props)){
// 			for(let prop of props){
// 				this.round(prop, obj);
// 			}
// 		}
// 	}
// };
let _f = {};
_f.isString = function(val){
	return typeof val == "string" || val instanceof String;
};
_f.isArray = function(val){
	return Array.isArray(val);
};
_f.round = function(props, obj){
	if(_f.isString(props)){
		let prop = props;
		obj[prop] = Math.floor(obj[prop]);
	}

	if(_f.isArray(props)){
		for(let prop of props){
			_f.round(prop, obj);
		}
	}
};