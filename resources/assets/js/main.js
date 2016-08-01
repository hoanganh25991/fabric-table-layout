import Vue from "vue";

import LayoutInfo from "./components/LayoutInfo";
import LayoutTable from "./components/LayoutTable";
import TableInfo from "./components/TableInfo";
import $ from "jquery";

import VueResource from 'vue-resource';
import Hammer from 'hammerjs';
// import Keen from 'keen-ui';

Vue.use(VueResource);
// Vue.use(Keen);
Vue.transition('bounce', {
	enterClass: 'bounceInLeft',
	leaveClass: 'fadeOutRight'
});

Vue.directive('ti-gesture', {
	params: [
		'modify-table-info'
	],
	bind(){},
	update(){
		console.log(this);
		console.log(this.el);

		let intervalUpdateTable = {};

		let vd = this;

		let modifyTableInfo = JSON.parse(vd.params.modifyTableInfo);

		Hammer(this.el).on('press', function(e){
			intervalUpdateTable = setInterval(() => {
				console.log(vd.params);
				console.log(vd.vm.modifyTableInfo);
				vd.vm.modifyTableInfo = Object.assign({}, modifyTableInfo);
			}, 50);
		});



		$(document).mouseup(function(e){
			clearInterval(intervalUpdateTable);
		});

		// this.el.addEventListener('mouseup', function(e){
		// 	console.log(e);
		// 	clearInterval(updateTable);
		// });

		this.el.addEventListener('click', function(e){
			console.log(vd.params);
			console.log(modifyTableInfo);
			vd.vm.modifyTableInfo = Object.assign({}, modifyTableInfo);
		});

		// console.log(this.params);
		// console.log(vd.vm.modifyTableInfo);
	}
});

// var vm = new Vue({
let vm = new Vue({
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

	methods: {
		askLayoutName: function(){
			this.askLayoutNameDivShowed = true;
		},

		getLayoutName: function(){
			let inputLayoutName = $("input[name='newLayoutName']");
			let newLayoutName = inputLayoutName.val();
			console.log(newLayoutName)

			//compute canvasSize for layout-table
			// let canvasContainer = $('.canvas-container');
			// let width = Math.floor(canvasContainer.width());
			// let height = Math.floor(canvasContainer.height());
			//
			// width = width == 0 ? 500 : width;
			// height = height == 0 ? 500 : height;
			//
			// console.log(`canvas container width|height : ${width}|${height}`);
			
			let layout = {name: newLayoutName, canvasId: Date.now(), canvasSize: {}};

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



			//define custom toObject on ANY shape inherit from fabric.Object
			//(rect, text, group,...)
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

			for(let layout of layouts){
				//store canvas inform of string
				let canvasSize = {
					getWidth(){
						return layout.canvas.getWidth();
					},
					getHeight(){
						return layout.canvas.getHeight();
					}
				};
				let canvasObj = layout.canvas.toObject(this.relativePosition(canvasSize));
				console.log(`export relative canvasObj|layout : ${layout.name}`, canvasObj);
				layout.canvas = JSON.stringify(canvasObj);
			}

			let data = JSON.stringify(layouts);

			//store offline
			localStorage.setItem("dump-data", data);
			this.$broadcast(`store in localStorage : complete`);
			console.log(`layouts data`, data);

			this.$broadcast(`export-layouts-complete`);
			
			//push to server
			this.url = "http://128.199.237.219/fabric-table-layout/sql.php?share=true";
			this.$http.post(this.url, data)
			    .then(function(response){
				    let data = response.data;
				    console.log(data);
				    vm.$broadcast("push to server : complete");
			    })
				.catch(function(res){
					console.log(res);
				});

		},

		relativePosition(canvasSize){
			return function(){
				return {
					width: Number((this.width / canvasSize.getWidth()).toFixed(2)),
					height: Number((this.height / canvasSize.getHeight()).toFixed(2)),
					left: Number((this.left / canvasSize.getWidth()).toFixed(2)),
					top: Number((this.top / canvasSize.getHeight()).toFixed(2))
				}
			};
		},
		broadcastUpdateTableInfo(){
			this.$broadcast('update-table-info');
			console.log('fire update-table-info event');
		}
	},

	events: {
		
	},

	ready(){
		let vm = this;

		//set default value
		this.layouts = [];

		let layoutsData = localStorage.getItem("dump-data");
		// console.log(layoutsData);
		if(layoutsData){
			this.layouts = JSON.parse(layoutsData);
		}

		// console.log(vm.url);
		// this.$http.get(vm.url)
		//     .then(function(response){
		// 	    let data = response.data;
		// 	    console.log("data", data);
		// 	    vm.layouts = data;
		//     });
	}
});
//export to global
window.vm = vm;
// we can use var instead of let to push global
// let is better for scope
window.cc = $('.canvas-container');