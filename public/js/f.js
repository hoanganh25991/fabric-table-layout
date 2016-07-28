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
		if(obj[prop]){
			obj[prop] = Math.floor(obj[prop]);
		}
	}

	if(_f.isArray(props)){
		for(let prop of props){
			_f.round(prop, obj);
		}
	}
};
_f.convertToSlug = function(Text){
	return Text
		.toLowerCase()
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-')
		;
};

//define custom toObject on ANY shape inherit from fabric.Object
//(rect, text, group,...)
//(rect, text, group,...)
fabric.Object.prototype.toObject = (function(fToObject){
	return function(fCalculate){
		let relativePosition = fCalculate.call(this);
		console.log(`fCalculate ${this.type}, positions:  ${relativePosition}`);
		return fabric.util.object.extend(fToObject.call(this), relativePosition);
	};
})(fabric.Object.prototype.toObject);


//for the sake of simple
//iterate through output object from canvas
//rather than modify toObject
// let can
_f.serialize = function(canvasObj, canvasSize){
	let obj = canvasObj;
	//change width, height on itself
	if(obj.width){
		// console.log(obj.width);
		// console.log(canvasSize.width);
		obj.width = obj.width * canvasSize.width;
		// console.dir(canvasObj);
	}
	
	if(obj.height){
		obj.height = obj.height * canvasSize.height;
	}
	
	if(obj.left){
		obj.left = obj.left * canvasSize.width;
	}

	if(obj.top){
		obj.top = obj.top * canvasSize.height;
	}
	
	_f.round(["width", "height", "top", "left"], obj);
	
	if(obj.objects){
		for(let aObj of obj.objects){
			_f.serialize(aObj, canvasSize);
		}
	}

};
