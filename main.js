// import TableLayout from "TableLayout";
var TableLayout = Vue.extend({
	template: `
	<div class="row">
		<div class="col-md-4">
			<div class="row">
				<p>width: {{ name }}</p>
				<p>height: {{ coder.age }}</p>
				<p>top: {{ tableName }}</p>
				<p>right: {{ vailo }}</p>
				<p>bottom: {{ width }}</p>
				<p>left: {{ width }}</p>
				<hr>
				<p>rotate: {{ rotate }}</p>
			</div>
			<div class="row">
				<p>type: {{ type }}</p>
				<p>scale: {{ scale }}</p>
			</div>
		</div>	
		<div class="col-md-8" style="border: 1px solid black">
			<input v-model="tableName" placeholder="type table number">
			<button class="btn btn-default" v-on:click="askTableName">+</button>
			<canvas id="c" style="box-shadow: rgba(0,0,0,0.5) 0 0 5px;">canvas here</canvas>
			<p>canvas here</p>
		</div>
	</div>`,
	props:{

	},
	data: {
		name: "name",
		tableName: "hoanganh",
		width: "",
		height: ""
	},
	ready: function(){
		let tableLayout = this;
		let canvas = new fabric.Canvas("c");
		canvas.setWidth(500);
		canvas.setHeight(500);

		canvas.on("object:selected", function(options){
			//update info in left-panel
			if(options.target){
				console.log('an object was clicked! ', options.target.type);
				console.log(options.target);

				let group = options.target;
				tableLayout.width = group.width * group.scaleY;
				console.log(tableLayout.width);
				tableLayout.group = options.target;
			}
			console.log(options);

		});

		this.canvas = canvas;
		this.name = "vai lo the";
	},
	methods: {
		askTableName: function(){
			var canvas = this.canvas;
			console.log("ask table name");
			console.log(this.tableName);
			let rect = new fabric.Rect({
				width: 100,
				height: 100,
				fill: '#eef',
				originX: 'center',
				originY: 'center'
			});
			let text = new fabric.Text(this.tableName,{
				fontSize: 30,
				originX: 'center',
				originY: 'center'
			});
			var group = new fabric.Group([rect, text], {
				top: 0,
				left: 0
			});
			canvas.add(group);
		},
		updateTableInfo: function(group){
			this.width = group.width;
			this.height = group.height;
		}
	}
});
new Vue({
	el: "#layout1",
	components: {TableLayout}
});