import Vue from "vue";
import $ from "jquery";

export default Vue.extend({
	template: "#layout-table-template",

	props: ["layouts", "layout", "selectedLayout", "selectedTable", "tableEvent", "newTableName"],

	data(){
		return {
			tableSizeDefault: {
				max_pax: "4",
				shape: "0",
				rotation: "0.00",
				top: "0.00",
				left: "0.00",
				height: "0.20",
				width: "0.20"
			}
		}
	},

	computed: {
		
	},

	watch: {
		"newTableName": function(val){
			if(val){
				this.createTable(val);
			}
		},
	},

	ready(){
		//store ref
		let vm = this;

		let canvas = new fabric.Canvas(this.$els.canvas.id);

		//set width height of canvas
		// let width = Math.floor($(".canvas-container").width());
		let width = Math.floor($(".canvas-container").width());
		console.log(width);

		//default value when width is 0
		if(width == 0){
			width = 500;
		}

		canvas.setWidth(width);
		canvas.setHeight(width);

		if(this.layout.canvas){
			let canvasObj = vm.relativePositionDeserialize(this.layout.canvas, canvas);
			canvas.loadFromJSON(canvasObj, function(){
				canvas.renderAll();
			});
		}

		//store canvas as a ref to object
		this.layout.canvas = canvas;
		this.selectedLayout = this.layout;

		//bind table event, update selectedTable
		//table-info update based on selectedTable
		this.notifyTableEvent(this.tableEvent);
	},

	methods: {
		relativePositionDeserialize(json, canvas){
			//define custom toObject on ANY shape inherit from fabric.Object
			// //(rect, text, group,...)
			// fabric.Object.prototype.toObject = (function(fToObject){
			// 	return function(fCalculate){
			// 		let positions = {};
			// 		let objType = this.get('type');
			// 		if(typeof fCalculate == "function" && objType != 'text'){
			// 			positions = fCalculate.call(this);
			// 			console.log(positions);
			// 		}
			// 		return fabric.util.object.extend(fToObject.call(this), positions);
			// 	};
			// })(fabric.Object.prototype.toObject);

			let vm = this;

			let canvasObj = {};

			if(_f.isString(json)){
				let canvasTemp = new fabric.Canvas();

				let canvasSize = {
					getWidth(){
						return canvas.getWidth();
					},
					getHeight(){
						return canvas.getHeight();
					}
				};
				fabric.Object.prototype.toObject = (function(fToObject){
					return function(fCalculate){
						let positions = {};
						let objType = this.get('type');
						if(typeof fCalculate == "function" && objType != 'text'){
						// if(typeof fCalculate == "function"){
							positions = fCalculate.call(this);
							console.log(positions);
						}

						if(typeof fCalculate == "function" && objType == 'text'){
							positions = fCalculate.call(this);
							delete positions["width"];
							delete positions["height"];
							console.log("text computed positions", positions);
						}
						return fabric.util.object.extend(fToObject.call(this), positions);
					};
				})(fabric.Object.prototype.toObject);

				canvasTemp.loadFromJSON(json, function(){
					canvasObj = canvasTemp.toObject(function(){
						let position = {
							width: this.width * canvasSize.getWidth(),
							left: this.left * canvasSize.getWidth(),
							height: this.height * canvasSize.getHeight(),
							top: this.top * canvasSize.getHeight()
						};
						_f.round(["width", "left", "height", "top"], position);
						return position;
					});
					console.log(canvasObj);
				});




				// fabric.util.extend(a, );
				// console.log(fabric.Text.prototype.includeDefaultValues);
				// fabric.Text.prototype.includeDefaultValues = false;


				for(let table of canvasObj.objects){
				// 	table.width = table.width * canvas.getWidth();
				// 	table.height = table.height * canvas.getHeight();
				// 	table.left = table.left * canvas.getWidth();
				// 	table.top = table.top * canvas.getHeight();
					table.borderColor = 'gray';
					table.cornerColor = 'black';
					table.cornerSize = 8;
					table.transparentCorners = true;
					table.vailochua = "vailoroi";
				//
				// 	let items = table.objects;
				//
				// 	for(let item of items){
				// 		item.width = item.width * canvas.getWidth();
				// 		item.height = item.height * canvas.getHeight();
				// 		item.left = item.left * canvas.getWidth();
				// 		item.top = item.top * canvas.getHeight();
				// 		console.log(item);
				// 	}
				}

				console.log("canvasObj", canvasObj);
			}

			//json, array case
			// [
			// 		{
			// 			name: "1",
			// 			max_pax: "4",
			// 			shape: "0",
			// 			rotation: "-4.93",
			// 			top: "0.47",
			// 			left: "0.08",
			// 			height: "0.27",
			// 			width: "0.19"
			// 		},
			// ]
			if(Array.isArray(json)){
				console.log("json", json);

				let canvasTemp = new fabric.Canvas();

				for(let tableInfo of json){

					let table = this.createTable2(tableInfo);

					canvasTemp.add(table);
				}

				canvasObj = canvasTemp.toObject();

			}

			console.log("canvasObj", JSON.stringify(canvasObj));

			return canvasObj;
		},

		relativePosition(canvasSize){
			return function(canvasSize){
				let position = {
					width: this.width * canvasSize.getWidth(),
					left: this.width * canvasSize.getWidth(),
					height: this.height * canvasSize.getHeight(),
					top: this.top * canvasSize.getHeight()
				};
				_f.round(["width", "left", "height", "top"], position);
				return position;
			}
		},

		notifyTableEvent(eventName){
			let vm = this;

			if(_f.isString(eventName)){
				//eventName = "object:moving"
				this.layout.canvas.on(eventName, function(options){
					vm.selectedTable = Object.create(options.target);
					console.log(`${eventName}`);
				});
			}

			if(_f.isArray(eventName)){
				for(let singleEventName of eventName){
					vm.notifyTableEvent(singleEventName);
				}
			}

		},

		createTable(tableName){
			console.log(`layout-table hanlde create-table ${tableName}`);
			//when parent broadcase, ONLY LayouTable has
			// selecteLayout.name === layout.name (layout of LayoutTable)
			//handle create table in this layout
			if(this.layout.name == this.selectedLayout.name){
				console.log(`layout-table: ${this.layout.name} add new table`);

				this.tableSizeDefault.name = tableName;

				let table = this.createTable2(this.tableSizeDefault);

				this.layout.canvas.add(table);
			}
		},

		//tableInfo
		// {
		// 		name: "1",
		// 			max_pax: "4",
		// 		shape: "0",
		// 		rotation: "0.00",
		// 		top: "0.77",
		// 		left: "0.41",
		// 		height: "0.20",
		// 		width: "0.20"
		// },
		createTable2(tableInfo){
			// fabric.Text.prototype.setFontSize(30);
			//text
			let text = new fabric.Text(`${tableInfo.name}`, {
				fontSize: 30,
				originX: "center",
				originY: "center"
			});

			//rect
			let rect = new fabric.Rect({
				fill: "#E5E5E5",
				stroke: "#555E65",
				strokeWidth: 4,
				width: Math.floor(tableInfo.width * 500),
				height: Math.floor(tableInfo.height * 500),
				originX: "center",
				originY: "center"
			});

			//table
			let table = new fabric.Group([rect, text], {
				rotation: tableInfo.rotation,
				borderColor: 'gray',
				cornerColor: 'black',
				cornerSize: 8,
				transparentCorners: true,
				top: Math.floor(tableInfo.top * 500),
				left: Math.floor(tableInfo.left * 500)
			});

			table.rotate(tableInfo.rotation);

			return table;
		}
	},

	events: {
	}
});