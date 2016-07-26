import Vue from "vue";

import LayoutInfo from "./components/LayoutInfo";
import LayoutTable from "./components/LayoutTable";
import TableInfo from "./components/TableInfo";
import $ from "jquery";

import VueResource from 'vue-resource';

Vue.use(VueResource);


new Vue({
	el: "#tinker",
	components: {LayoutInfo, LayoutTable, TableInfo},

	props: {
		layouts: {
			default: function(){
				return [];
			}
		},
		selectedLayout: {
			default: function(){
				return {};
			}
		},
		selectedTable: {
			default: function(){
				return {};
			}
		},
		tableEvent: {
			default: function(){
				return [
					"object:selected",
					"object:scaling",
					"object:moving",
					"object:rotating"
				];
			}
		},
		newTableName: {
			default: ""
		}
	},

	data: {
		askLayoutNameDivShowed: false,
		url: "http://128.199.237.219/fabric-table-layout/sql.php",
	},

	convertToSlug(Text){
		return Text
			.toLowerCase()
			.replace(/[^\w ]+/g, '')
			.replace(/ +/g, '-')
			;
	},

	methods: {
		askLayoutName: function(){
			this.askLayoutNameDivShowed = true;
		},

		getLayoutName: function(){
			let inputLayoutName = $("input[name='newLayoutName']");
			let newLayoutName = inputLayoutName.val();
			console.log(newLayoutName);
			let layout = {name: newLayoutName, canvasId: Date.now()};

			this.layouts.push(layout);

			this.selectedLayout = layout;

			//hide 
			this.askLayoutNameDivShowed = false;
			//clear
			inputLayoutName.val("");

		},

		exportLayouts: function(){
			let vm = this;

			let layouts = [];
			
			for(let layout of this.layouts){
				let copyLayout = {};
				copyLayout.name = layout.name;
				copyLayout.canvasId = layout.canvasId;
				copyLayout.canvas = layout.canvas;
				layouts.push(copyLayout);
			}

			console.log(this.layouts);
			console.log(layouts);

			localStorage.setItem("dump-data", JSON.stringify(layouts));

			this.$broadcast("export-layouts-complete");

			this.url = "http://128.199.237.219/fabric-table-layout/json.php";

			for(let layout of layouts){
				//define custom toObject on ANY shape inherit from fabric.Object
				//(rect, text, group,...)
				fabric.Object.prototype.toObject = (function(fToObject){
					return function(fCalculate){
						let positions = {};
						if(typeof fCalculate == "function"){
							positions = fCalculate.call(this);
							console.log(positions);
						}
						return fabric.util.object.extend(fToObject.call(this), positions);
					};
				})(fabric.Object.prototype.toObject);

				//store canvas inform of string
				let canvasSize = {
					getWidth(){
						return layout.canvas.getWidth();
					},
					getHeight(){
						return layout.canvas.getHeight();
					}
				};
				let canvasObj = layout.canvas.toObject(this.relativePositionSerialize(canvasSize));
				console.log(canvasObj);
				layout.canvas = JSON.stringify(canvasObj);
				// let canvasObj = layout.canvas.toObject({vailocahu: "HOANG ANH ANHANAHNAH"});
				// let object = layout.canvas.item(0);
				// let props = [];
				// props["name"] = "FUCK";
				// console.log(props);
				// let a = object.toObject(props);
				// console.log(a);
				// fabric.util.object.extend(canvasObj, {name: "HOANG ANH"});

				// console.log(canvasObj);
			}

			let data = JSON.stringify(layouts);
			// console.log(data);
			this.$http.post(this.url, data)
			    .then(function(response){
				    let data = response.data;
				    console.log(data);
				    vm.$broadcast("push-to-server-complete");
			    })
				.catch(function(res){
					console.log(res);
				});

		},

		relativePositionSerialize(canvasSize){
			return function(){
				return {
					width: Number((this.width / canvasSize.getWidth()).toFixed(2)),
					height: Number((this.height / canvasSize.getHeight()).toFixed(2)),
					left: Number((this.left / canvasSize.getWidth()).toFixed(2)),
					top: Number((this.top / canvasSize.getHeight()).toFixed(2))
				}
			};
		},
	},

	events: {

	},

	ready(){
		let vm = this;

		//set default value
		this.layouts = [];

		// let layoutsData = localStorage.getItem("dump-data");
		// // console.log(layoutsData);
		// if(layoutsData){
		// 	this.layouts = JSON.parse(layoutsData);
		// }

		// console.log(vm.url);
		// this.$http.get(vm.url)
		//     .then(function(response){
		// 	    let data = response.data;
		// 	    console.log("data", data);
		// 	    vm.layouts = data;
		//     });
	}
});