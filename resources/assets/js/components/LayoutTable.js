import Vue from "vue";

export default Vue.extend({
	template: "#layout-table-template",

	props: ["layouts", "layout", "selectedLayout", "selectedTable", "exportLayoutsCount"],

	data(){
		return {
			canvas: {}
		}
	},

	computed: {
		name: function(){
			if(this.layout){
				return this.layout.name;
			}

			return "";
		},

		id: function(){
			if(this.layout){
				return this.layout.canvasId;
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
		//load customize on fabric
		fabric.Object.prototype.toObject = (function(toObject){
			return function(){
				let position = vm.relativePositionSerialize(this, canvas);
				return fabric.util.object.extend(toObject.call(this), position);
			};
		})(fabric.Object.prototype.toObject);

		//store ref
		let vm = this;

		let canvas = new fabric.Canvas(this.$els.canvas.id);

		canvas.setWidth(500);
		canvas.setHeight(500);

		if(this.layout.canvas){
			let canvasObj = vm.relativePositionDeserialize(this.layout.canvas, canvas);
			canvas.loadFromJSON(canvasObj, function(){
				canvas.renderAll();
			});
		}

		//store canvas as a ref to object
		this.canvas = canvas;
		this.selectedLayout = this.layout;

		this.canvas.on("object:selected", function(options){
			if(options.target){
				console.log("set selectedTable");
				vm.selectedTable = options.target;
				let table = options.target;

				console.log("layout-table [broadcast-table-selected]");
				vm.$dispatch("broadcast-table-selected", table);
			}
		});

		this.canvas.on("object:scaling", function(options){
			if(options.target){
				console.log("set selectedTable");
				vm.selectedTable = options.target;
				let table = options.target;

				console.log("layout-table [broadcast-table-on-scaling]");
				vm.$dispatch("broadcast-table-on-scaling", table);
			}
		});

		this.canvas.on("object:rotating", function(options){
			if(options.target){
				console.log("set selectedTable");
				vm.selectedTable = options.target;
				let table = options.target;

				console.log("layout-table [broadcast-table-on-rotating]");
				vm.$dispatch("broadcast-table-on-rotating", table);
			}
		});
	},

	methods: {
		relativePositionSerialize(table, canvas){
			return {
				width: Number((table.width / canvas.getWidth()).toFixed(2)),
				height: Number((table.height / canvas.getHeight()).toFixed(2)),
				left: Number((table.left / canvas.getWidth()).toFixed(2)),
				top: Number((table.top / canvas.getHeight()).toFixed(2))
			}
		},
		relativePositionDeserialize(json, canvas){
			let canvasObj = JSON.parse(json);

			let tables = canvasObj.objects;

			for(let table of tables){
				table.width = table.width * canvas.getWidth();
				table.height = table.height * canvas.getHeight();
				table.left = table.left * canvas.getWidth();
				table.top = table.top * canvas.getHeight();
				table.borderColor = 'gray';
				table.cornerColor = 'black';
				table.cornerSize = 8;
				table.transparentCorners = true;
				table.vailochua = "vailoroi";

				let items = table.objects;

				for(let item of items){
					item.width = item.width * canvas.getWidth();
					item.height = item.height * canvas.getHeight();
					item.left = item.left * canvas.getWidth();
					item.top = item.top * canvas.getHeight();
					console.log(item);
				}
			}

			console.log(canvasObj);

			return canvasObj;
		}
	},

	events: {
		"create-table": function(tableName){
			console.log(`layout-table hanlde create-table ${tableName}`);

			//when parent broadcase, ONLY LayouTable has
			// selecteLayout.name === layout.name (layout of LayoutTable)
			//handle create table in this layout
			if(this.layout.name == this.selectedLayout.name){

				console.log(`layout-table: ${this.layout.name} add new table`);

				//hold canvas as ref to this.canvase
				//this is ambiguous
				let canvas = this.canvas;

				let text = new fabric.Text(`${tableName}`, {
					fontSize: 30,
					originX: "center",
					originY: "center"
				});

				let rect = new fabric.Rect({
					fill: "#E5E5E5",
					stroke: "#555E65",
					strokeWidth: 4,
					width: 100,
					height: 100,
					originX: "center",
					originY: "center"
				});

				let table = new fabric.Group([rect, text], {
					borderColor: 'gray',
					cornerColor: 'black',
					cornerSize: 8,
					transparentCorners: true,
					top: 0,
					left: 0
				});

				//define how to serialize for 'Group' as table here

				//hold ref to vm
				let vm = this;



				table.toObject = (function(toObject){
					return function(){
						//compute width, height, top, left as relative
						let position = {};
						position.borderColor = 'gray';
						position.cornerColor = 'black';
						position.cornerSize = 8;
						position.transparentCorners = true;
						position.vailochua = "vailoroi";
						return fabric.util.object.extend(toObject.call(this), position);
					};
				})(table.toObject);

				this.canvas.add(table);

				console.log(this.canvas.toObject());
			}
		},
		"export-layouts": function(){
			console.log("layout-table handle [export-layouts]");

			console.log(JSON.stringify(this.canvas.toObject()));
			this.layout.canvas = JSON.stringify(this.canvas.toObject());
			this.$dispatch("layout-export-success");
			// let vm = this;
			// setTimeout(function(){
			// 	vm.$dispatch("layout-export-success");
			// }, 1000);

		}
	}
});