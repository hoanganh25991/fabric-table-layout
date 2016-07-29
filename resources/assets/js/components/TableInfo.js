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

	computed: {

	},

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
			setTimeout(function(){
				vm.exportLayoutsDivShowed = false;
			}, 1500);
		},
		'update-table-info': function(){
			console.log('table-info update table info');
			this.updateTableInfo();
		}
	},

	ready(){
	}
});