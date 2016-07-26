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
			console.log(JSON.stringify(this.layouts));
			localStorage.setItem("dump-data", JSON.stringify(this.layouts));
			this.$broadcast("export-layouts-complete");
			this.url = "http://128.199.237.219/fabric-table-layout/json.php";
			this.$http.post(this.url, JSON.stringify(this.layouts))
			    .then(function(response){
				    let data = response.data;
				    console.log(data);
			    });

		}
	},

	events: {
		"broadcast-object:scaling": function(table){
			//notify back to children
			this.$broadcast('table-object:scaling', table);
		}
	},

	ready(){
		//set default value
		this.layouts = [];

		// let layoutsData = localStorage.getItem("dump-data");
		// // console.log(layoutsData);
		// if(layoutsData){
		// 	this.layouts = JSON.parse(layoutsData);
		// }

		// let vm = this;
		// console.log(vm.url);
		// this.$http.get(vm.url)
		//     .then(function(response){
		// 	    let data = response.data;
		// 	    console.log("data", data);
		// 	    vm.layouts = data;
		//     });

		for(let eventName of this.tableEvent){
			this[`broadcast-${eventName}`] = function(table){
				console.log(`broadcast-${eventName}: dispatch success`);
				this.$broadcast(`table-${eventName}`, table);
			};
		}

		console.log(this);

		_f.isString("hoanganh");
	}
});