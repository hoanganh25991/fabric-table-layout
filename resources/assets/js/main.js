import Vue from "vue";

import LayoutInfo from "./components/LayoutInfo";
import LayoutTable from "./components/LayoutTable";
import TableInfo from "./components/TableInfo";
import $ from "jquery";


new Vue({
	el: "#tinker",
	components: {LayoutInfo, LayoutTable, TableInfo},

	props: ["layouts", "selectedLayout", "selectedTable", "exportLayoutsCount"],

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
				console.log(JSON.stringify(this.layouts));
			}
		}
	},

	ready(){
		//set default value
		// this.layouts = [];
		// this.layouts = [
		// 	{name: "default", canvasId: 1, canvas:{}},
		// 	{name: "default2", canvasId: 2, canvas:{}},
		// ];

		//
		// this.exportLayoutsCount = 0;

		this.layouts = [{"name":"hoanganh","canvasId":1469006639257,"canvas":"{\"objects\":[{\"type\":\"group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":77,\"top\":72,\"width\":104,\"height\":104,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"objects\":[{\"type\":\"rect\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":100,\"height\":100,\"fill\":\"#E5E5E5\",\"stroke\":\"#555E65\",\"strokeWidth\":4,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"rx\":0,\"ry\":0},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":15,\"height\":33.9,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"text\":\"1\",\"fontSize\":30,\"fontWeight\":\"normal\",\"fontFamily\":\"Times New Roman\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}"},{"name":"hoangminh","canvasId":1469006646832,"canvas":"{\"objects\":[{\"type\":\"group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":91,\"top\":126,\"width\":104,\"height\":104,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"objects\":[{\"type\":\"rect\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":100,\"height\":100,\"fill\":\"#E5E5E5\",\"stroke\":\"#555E65\",\"strokeWidth\":4,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"rx\":0,\"ry\":0},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":15,\"height\":33.9,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"text\":\"1\",\"fontSize\":30,\"fontWeight\":\"normal\",\"fontFamily\":\"Times New Roman\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}"}];
	}
});