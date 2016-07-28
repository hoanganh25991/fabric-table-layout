import Vue from "vue";
import $ from "jquery";

export default Vue.extend({
	template: "#table-info-template",

	props: ["layouts", "selectedLayout", "selectedTable", "tableEvent", "newTableName"],

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

		}
	},

	computed: {

	},

	watch: {
		'selectedTable': function(val){
			this.updateTableInfo(val);
		}
	},

	methods: {
		setNewTableName: function(){
			this.askTableNameDivShowed = false;
			this.newTableName = this.inputNewTableName;
			this.inputNewTableName = "";
		},

		updateTableInfo: function(table){
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
			console.log("export-layouts-complete, remove info");
			this.exportLayoutsDivShowed = false;

		},
	},

	ready(){
	}
});