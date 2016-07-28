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
			},
			canvasSize: {
				width: 0,
				height: 0,
			}
		}
	},

	// computed: {
	// 	canvasSize: function(){
	// 		return this.layout.canvasSize;
	// 	}
	// },

	watch: {
		"newTableName": function(val, oldVal){
			if(val){
				this.createTable(val);
			}
		},
		// "canvasSize": function(val, oldVal){
		// 	console.log(`canvasSize changed`, val, oldVal);
		// 	this.layout.canvas.setWidth(val.width);
		// 	this.layout.canvas.setHeight(val.height);
		// }
	},

	ready(){
		//store ref
		let vm = this;

		let canvas = new fabric.Canvas(this.$els.canvas.id);

		//set width height of canvas
		// let width = Math.floor($(".canvas-container").width());
		let canvasContainer = $('.canvas-container');
		let width = Math.floor(canvasContainer.width());
		let height = Math.floor(canvasContainer.height());
		
		width = width == 0 ? 500 : width;
		height = height == 0 ? 500 : height;

		console.log(`canvas container width|height : ${width}|${height}`);

		this.layout.canvasSize = {
			width: width,
			height: height
		};

		canvas.setWidth(this.layout.canvasSize.width);
		canvas.setHeight(this.layout.canvasSize.height);


		//load table in canvas
		//if exist
		if(this.layout.canvas){
			let canvasObj = vm.getCanvasObj(this.layout.canvas);

			canvas.loadFromJSON(canvasObj, function(){
				//re-render when load finished
				canvas.renderAll();
			});
		}

		//store canvas as a ref to object
		this.layout.canvas = canvas;
		this.selectedLayout = this.layout;

		//bind table event, update selectedTable
		//table-info update based on selectedTable
		this.notifyTableEvent(this.tableEvent);
		_f.longPressOnTable(this.layout.canvas, function(e){
			console.log(`long press on table`);
			if(e){
				console.log(e.toObject());
			}
			console.log(e);
		});
	},

	methods: {
		getCanvasObj(json){
			let vm = this;

			let canvasObj = {};

			if(_f.isString(json)){
				//load json by a canvas
				//canvasTemp
				let canvasTemp = new fabric.Canvas();

				//relativePosition, reverse width, height in percent 0.02, 0.04
				//into real pixel 200px, 400px
				canvasTemp.loadFromJSON(json, function(){
					//store back into canvasObj
					canvasObj = canvasTemp.toObject(vm.relativePosition());
				});

				console.log("canvasObj from json", canvasObj);
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
				let canvasTemp = new fabric.Canvas();

				for(let tableInfo of json){

					let table = this.createFabricTable(tableInfo);

					canvasTemp.add(table);
				}

				canvasObj = canvasTemp.toObject();

				console.log("canvasObj from array", canvasObj);
			}

			return canvasObj;
		},

		relativePosition(){
			let canvasSize = this.layout.canvasSize;

			return function(){
				let position = {
					width: this.width * canvasSize.width,
					left: this.left * canvasSize.width,

					height: this.height * canvasSize.height,
					top: this.top * canvasSize.height
				};

				//if fabric is `text`, remove width|height
				if(this.type && this.type == "text"){
					delete this.width;
					delete this.height;
				}

				_f.round(["width", "left", "height", "top"], position);

				return position;
			}
		},

		notifyTableEvent(eventName){
			let vm = this;

			if(_f.isString(eventName)){
				//eventName = "object:moving"
				this.layout.canvas.on(eventName, function(options){
					vm.selectedTable = Object.assign({}, options.target);
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

				let table = this.createFabricTable(this.tableSizeDefault);

				this.layout.canvas.add(table);
			}
		},

		//tableInfo
		// {
		// 		name: "1",
		// 		max_pax: "4",
		// 		shape: "0",
		// 		rotation: "0.00",
		// 		top: "0.77",
		// 		left: "0.41",
		// 		height: "0.20",
		// 		width: "0.20"
		// },
		createFabricTable(tableInfo){
			//store ref
			let vm = this;
			let canvasSize = vm.layout.canvasSize;
			//text
			let text = new fabric.Text(`${tableInfo.name}`, {
				fontSize: 30,
				originX: "center",
				originY: "center"
			});

			//rect
			let rectOptions = {
				fill: "#E5E5E5",
				stroke: "#555E65",
				strokeWidth: 4,
				width: tableInfo.width * canvasSize.width,
				height: tableInfo.height * canvasSize.height,
				originX: "center",
				originY: "center"
			};
			_f.round(["width", "height"], rectOptions);

			let rect = new fabric.Rect(rectOptions);

			// rect.on('selected', function(){console.log(`table listen to event, selected`);});

			let tableOptions = {
				borderColor: 'gray',
				cornerColor: 'black',
				cornerSize: 8,
				transparentCorners: true,
				top: tableInfo.top * canvasSize.height,
				left: tableInfo.left * canvasSize.width
			};
			_f.round(["top", "left"], tableOptions);

			//table
			let table = new fabric.Group([rect, text], tableOptions);

			table.rotate(tableInfo.rotation);

			// _f.longPressOnTable(table, function(){console.log(`long press on table`);});
			

			return table;
		}
	},

	events: {}
});