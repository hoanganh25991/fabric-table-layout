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

	props: ["layouts", "selectedLayout", "selectedTable", "exportLayoutsCount", "tableEvent"],

	data: {
		askLayoutNameDivShowed: false,
		url : "http://128.199.237.219/fabric-table-layout/sql.php",
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

		handleNewTableName: function(tableName){
			console.log(`parent handle [new table name]: ${tableName}`);
			console.log(`parent broadcast [create-table] to children,
			layout-table hanlde this event`);
			this.$broadcast("create-table", tableName);
		},

		broadcastTableSelected: function(table){
			console.log("parent broadcast [table-selected]");
			this.$broadcast("table-selected", table);
		},

		broadcastTableOnScaling: function(table){
			console.log("parent broadcast [table-on-scaling]");
			this.$broadcast("table-on-scaling", table);
		},

		broadcastTableOnRotating: function(table){
			console.log("parent broadcast [table-on-rotating]");
			this.$broadcast("table-on-rotating", table);
		},

		broadcastExportLayouts: function(){
			console.log("parent broadcast [export-layouts]");
			this.exportLayoutsCount = 0;
			this.$broadcast("export-layouts");
		},

		handleLayoutExportSuccess: function(){
			this.exportLayoutsCount++;
			if(this.exportLayoutsCount == this.layouts.length){
				this.$broadcast("export-layouts-complete");
				console.log(JSON.stringify(this.layouts));
				localStorage.setItem("dump-data", JSON.stringify(this.layouts));
				this.url = "http://128.199.237.219/fabric-table-layout/json.php";
				this.$http.post(this.url, JSON.stringify(this.layouts))
				    .then(function(response){
					    let data = response.data;
					    console.log(data);
					    // vm.layouts = data;
				    });
			}
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

		this.tableEvent = [
			"object:selected",
			"object:scaling",
			"object:moving",
			"object:rotating"
		];

		for(let eventName of this.tableEvent){
			this[`broadcast-${eventName}`] = function(table){
				console.log(`broadcast-${eventName}: dispatch success`);
				this.$broadcast(`table-${eventName}`, table);
			};
		}

		console.log(this);
	}
});