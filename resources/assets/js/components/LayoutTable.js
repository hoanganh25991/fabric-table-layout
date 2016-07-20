import Vue from "vue";

export default Vue.extend({
	template: "#layout-table-template",
	
	props: ["layout", "selectedLayout", "selectedTable"],

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
		//store ref
		let vm = this;
		let canvas = new fabric.Canvas(this.$els.canvas.id);
		console.log(this.id);
		canvas.setWidth(500);
		canvas.setHeight(500);

		//store canvas as a ref to object
		this.canvas = canvas;
		
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
	},
	
	events: {
		"create-table": function(tableName){
			console.log(`layout-table hanlde create-table ${tableName}`);
			if(this.layout.name == this.selectedLayout.name){
				console.log(`layout-table: ${this.layout.name} add new table`);

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

				this.canvas.add(table);
			}
		},
	}
});