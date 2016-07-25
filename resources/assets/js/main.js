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

	props: ["layouts", "selectedLayout", "selectedTable", "exportLayoutsCount", "url"],

	data: {
		askLayoutNameDivShowed: false,
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
				localStorage.setItem("dump-data", JSON.stringify(this.layouts));
			}
		}
	},

	ready(){
		//set default value
		this.layouts = [];
		// this.layouts = [
		// 	{name: "default", canvasId: 1, canvas:{}},
		// 	{name: "default2", canvasId: 2, canvas:{}},
		// ];

		//
		// this.exportLayoutsCount = 0;

		// this.layouts = ;
		let layoutsData = localStorage.getItem("dump-data");
		// console.log(layoutsData);
		if(layoutsData){
			this.layouts = JSON.parse(layoutsData);
		}
		
		let vm = this;
		console.log(vm.url);
		this.$http.get(vm.url)
		    .then(function(response){
			    const data = response.data;

			    new Chart(ctx, {
				    type: graph.type,
				    data: {
					    labels: Object.keys(data),
					    datasets: [
						    {
							    label: '#Spends',
							    data: Object.keys(data).map(key => data[key])
						    }
					    ]
				    }
			    });
		    });
	}
});