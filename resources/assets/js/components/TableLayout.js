import Vue from "vue";

export default Vue.extend({
	template: '<div><h1>table layout</h1><input v-model="table.name" type="number"><button @click="createTable">+</button><div id="canvasContainer" style="box-shadow: rgba(0,0,0,0.5) 0 0 5px"><canvas id="canvas"></canvas></div></div>',

	props: {
		activetable: {}
	},

	data: function(){
		return {
			layout: "",
			table: {
				name: "",
				width: 100,
				height: 100,
				rotate: 0
			},
		}
	},

	ready: function(){
		let canvas = new fabric.Canvas("canvas");
		let canvasWidth = document.querySelector("#canvasContainer").offsetWidth;
		canvas.setWidth(canvasWidth);
		canvas.setHeight(500);
		console.log(canvas);

		this.layout = canvas;

		var vue = this;

		this.layout.on("object:selected", function(options){
			vue.updateActiveTable(options);
		});

		this.layout.on("object:scaling", function(options){
			vue.updateActiveTable(options);
		});

		console.log(this.activetable);
	},

	methods: {
		createTable: function(){
			console.log(this.table.name);
			console.log(this.activetable);

			let text = new fabric.Text(this.table.name, {
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

			this.layout.add(table);
		},

		updateActiveTable: function(options){
			if(options.target){
				let activeTable = options.target;
				console.log(activeTable.type);
				console.log(activeTable.scaleX);
				this.activetable = activeTable;
			}
		}
	}
});