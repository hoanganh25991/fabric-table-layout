import Vue from "vue";
import DirectiveLongPress from './DirectiveLongPress';
import $ from 'jquery';
import Hammer from 'hammerjs';

export default Vue.extend({
	template: "#layout-info-template",
	
	props: ["layouts", "layout", "selectedLayout"],
	
	data(){
		return {
			active: false,
			layoutInfoActionDiv: false,
			inputRenameLayoutDiv: false,
			layoutNewName: "",

		}
	},

	computed: {
		active: function(){
			if(!this.layout){
				return false;
			}

			if(!this.selectedLayout){
				return false;
			}

			return (this.layout.name == this.selectedLayout.name);
		}
	},

	ready(){
		// this.selected = true;
		let vm = this;
		console.log(vm.$els.vailo);
		Hammer(vm.$els.vailo).on('press', function(e){
			console.log(e);
			vm.layoutInfoActionDiv = true;
		})
	},
	
	methods: {
		setSelectedLayout(){
			this.selectedLayout = this.layout;
		},
		longPressDetect(){
			console.log(`what do you mean?`);
			console.log($('layout-info'));
		},
		deleteLayout(){
			let vm = this;
			let index = this.layouts.indexOf(vm.layout);

			if (index > -1) {
				this.layouts.splice(index, 1);
				let closestLayout = index;
				if(index > 0){
					closestLayout = index - 1;
				}
				console.log(closestLayout);
				this.selectedLayout = this.layouts[closestLayout];
			}
			this.layoutInfoActionDiv = false;
			console.log(`delete layout`);
		},
		renameLayout(){
			this.layout.name = this.layoutNewName;
			this.inputRenameLayoutDiv= false;
			this.layoutInfoActionDiv = false;
			this.layoutNewName = "";
			console.log(`rename layout`);

		}
	}
});