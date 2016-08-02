import Vue from "vue";
import $ from "jquery";
import Hammer from "hammerjs";



export default Vue.extend({
	template: "#table-info-template",

	props: ["layouts", "selectedLayout", "tableEvent", "newTableName"],
	
	data(){
		return {
			askTableNameDivShowed: false,
			inputNewTableName: "",
			width: "-",
			height: "-",
			top: "-",
			left: "-",
			rotation: "-",
			exportLayoutsDivShowed: false,
			modifyTableInfo: {}
		}
	},

	computed: {},

	watch: {
		modifyTableInfo(val, oldVal){
			let vm = this;
			//only update when use press
			//default on start run no thing
			if(_f.isEmptyObj(val)){
				return false;
			}

			//if no table selected
			//return
			let table = this.selectedLayout.canvas.getActiveObject();
			if(_f.isEmptyObj(table)){
				return false;
			}

			let tableProp = val.prop;

			if(tableProp == 'shape'){
				let tableObj = table.toObject();
				console.log(tableObj);
				let shape = table.item(0);
				let txt = table.item(1);
				// let newShape = new fabric[val.action]({

				let isSwap = true;
				if(shape.type == val.action.toLowerCase()){
					isSwap = false;
					return isSwap;
				}

				let newShape = {};
				if(val.action == 'ellipse'){
					let options = {
						rx: shape.width * table.scaleX / 2,
						ry: shape.height * table.scaleY / 2,
						fill: "#E5E5E5",
						stroke: "#555E65",
						strokeWidth: 4,
						originX: "center",
						originY: "center"
					};
					_f.round(['rx', 'ry'], options);
					console.log(`options`, options);
					newShape = new fabric.Ellipse(options);
				}

				if(val.action == 'rect'){
					newShape = new fabric.Rect({
						width: shape.width * table.scaleX,
						height: shape.height * table.scaleY,
						fill: "#E5E5E5",
						stroke: "#555E65",
						strokeWidth: 4,
						originX: "center",
						originY: "center"
					});
				}

				let newTable = new fabric.Group([newShape, txt], {
					borderColor: 'gray',
					cornerColor: 'black',
					cornerSize: 8,
					transparentCorners: true,
					top: table.top,
					left: table.left
				});
				// swap them
				// table = newTable;
				//vai lo chua, cai ban moi roi moi ghe
				newTable.id = table.id;
				this.selectedLayout.canvas.remove(table);
				this.selectedLayout.canvas.add(newTable);
				this.selectedLayout.canvas.setActiveObject(newTable);
				this.selectedLayout.canvas.renderAll();
				return true;
			}

			if(tableProp == 'selectable'){
				let mapProp = {
					'enable': true,
					'disable': false
				};

				table.selectable = mapProp[val.action];
				this.selectedLayout.canvas.renderAll();
				return true;
			}

			if(tableProp == 'status'){
				let mapProp = {
					'enable': '#E5E5E5',
					'disable': '#f2f2f2'
				};

				table.item(0).fill = mapProp[val.action];
				this.selectedLayout.canvas.renderAll();
				return true;
			}

			let mapActionVal = {
				'plus': 1,
				'minus': -1
			};

			this[tableProp] = this[tableProp] + Number(mapActionVal[val.action]);

			let mapTableProp = {
				width: {
					scaleX: this[tableProp] / table.width
				},
				height: {
					scaleY: this[tableProp] / table.height
				},
				top: {
					top: this[tableProp]
				},
				left: {
					left: this[tableProp]
				},
				rotation: {
					angle: this[tableProp]
				}
			};
			//manually rotate table
			//rotate WHOLE GROUP together
			//at the center a table
			//angle use TOP-LEFT corner to rotate
			if(tableProp == 'rotation'){
				table.rotate(vm[tableProp]);
			}

			//scale or rotate table as what happen
			// let newVal = {};
			// newVal[tableProp] = this[tableProp];
			let newVal = mapTableProp[tableProp];
			console.log(newVal);
			//update value
			fabric.util.object.extend(table, newVal);


			//refreash canvas
			this.selectedLayout.canvas.renderAll();
		},
	},

	methods: {
		setNewTableName: function(){
			this.askTableNameDivShowed = false;
			this.newTableName = this.inputNewTableName;
			this.inputNewTableName = "";
		},

		updateTableInfo: function(){
			let table = this.selectedLayout.canvas.getActiveObject();
			// let group =  this.selectedLayout.canvas.getActiveGroup();
			if(!table){
				return false;
			}
			console.log(table);
			this.width = table.width * table.scaleX;
			this.height = table.height * table.scaleY;
			this.top = table.top;
			this.left = table.left;
			this.rotation = table.angle;
			_f.round(["width", "height", "top", "left", "rotation"], this);
		},

		dispatchExportLayouts: function(){
			this.exportLayoutsDivShowed = true;
			this.$dispatch("export-layouts");
		}
	},

	events: {
		"export-layouts-complete": function(){
			let vm = this;
			console.log("export-layouts-complete, remove info");
			// setTimeout(function(){
			// 	vm.exportLayoutsDivShowed = false;
			// }, 1500);
			vm.exportLayoutsDivShowed = false;
		},
		'update-table-info': function(){
			console.log('table-info update table info');
			this.updateTableInfo();
		}
	},

	ready(){
	}
});