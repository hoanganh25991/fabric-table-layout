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
		let relativePosition = {};
		if(typeof fCalculate == "function"){
			relativePosition = fCalculate.call(this);
			console.log(`fCalculate on : ${this.type}\nrelativePosition:  `, relativePosition);
		}
		return fabric.util.object.extend(fToObject.call(this, [
			"borderColor",
			"cornerColor",
			"cornerSize",
			"transparentCorners"
		]), relativePosition);
	};
})(fabric.Object.prototype.toObject);

//obj may be table or something?
//.on? work for?
//@@
_f.longPressOnTable = function(canvas, callback){
	// how many milliseconds is a long press?
	let longpress = 500;
	// holds the start time
	let start;

	//check object:moving <-> cancle long press
	let canceled;
	let mouseEvent;

	// canvas.on('selected', function(){console.log(`table listen to event, selected`);});

	canvas.on('mouse:down', function(e){
		mouseEvent = e;
		start = Date.now();
		canceled = false;
		console.log(`canvas listen to event, mouse:down`);
	});

	canvas.on('mouse:move', function(e){
		if(!mouseEvent){
			mouseEvent = e;
		}
		// console.log(`object:moving`);
		canceled = Math.pow(mouseEvent.e.x - e.e.x, 2) > 2500 ||
			Math.pow(mouseEvent.e.y - e.e.y, 2) > 2500;
		// console.log(`mouse move`);
	});

	canvas.on('mouse:up', function(e){
		//no canceled
		//enoguth longpress
		//target on object
		let isPressOnTable = e.target ? true : false;
		let longEnough = Date.now() >= (start + longpress)

		console.log(!canceled, longEnough, isPressOnTable);


		if(!canceled && longEnough && isPressOnTable){
			console.log(`long press on table!`);
			canvas.fire("object:longpress", e);
			return true;
		}

		if(!canceled && longEnough){
			console.log(`long press on NOTHING!`);
			return false;
		}

		console.log(`not a long press!`);
		// if(Date.now()>= (start + longpress)){
		// 	callback(e.target);
		// }else{
		// 	console.log('short press');
		// }
	});
};
