'use strict';
/**
 * @ngdoc function
 * @name formAdminApp.service:formService
 * @description
 * # fromService
 * Service of the formAdminApp
 */
angular.module('formAdminApp')
  .service('formService',['$compile', function($compile) {

	var retval = {

		fieldId: 0,
    	formId: 1,
    	formJson: {},
    	resultJson: {},
		allEvents: [{event:'click'},{event:'change'}],
		allActions: [{action:'showNextForm',label:'Show Next Form'},{action:'sendEmail',label:'Send Email'}],

		/**
		* set default field properties
		* @params elemType
		*/
		setDefaultProperties: function(elemType) {
			var defaultProps = {
				formId: this.formId,
				fieldId: this.fieldId,
				fieldName: 'New field '+this.fieldId,
				fieldType: elemType,
				defaultValue: '',
				isRequired: false,
				events: [],
				options: []
			};
			if(elemType === 'image') {
				defaultProps['defaultValue'] = 'http://meetonsnap.com/assets/background.jpeg';
				defaultProps['useImageAs'] = 'background';
			}
			return defaultProps;
		},

		/**
		* add new component to the form
		* @params addMe component
		*/
        addNewComponent: function($scope,addMe) {
            var formDiv = document.getElementById('form-'+this.formId),
                pelem = document.createElement('my-element');
            pelem.setAttribute('element-type',addMe);
            pelem = angular.element(pelem);
            formDiv.append($compile(pelem)($scope)[0]);
            this.fieldId++;
        },

		/**
		* remove component
		* @params elemType
		*/        
		removeComponent: function($scope,element) {
			delete this.formJson["field-"+$scope.field.fieldId];
			$scope.field = {};
			element.remove();
			this.modifyJsonView();
		},

		/**
		* add new form
		* @params
		*/
		addNewForm: function($scope) {
            if(this.formId > 1) {
                $scope.previousBtn = true;
                document.getElementById('form-'+(this.formId-1)).style.display = 'none';
            } else $scope.previousBtn = false;

            if(document.getElementById('form-'+this.formId) != undefined) {
                document.getElementById('form-'+this.formId).style.display = 'block';
                this.formJson = this.resultJson['form-'+this.formId] || {};
                this.fieldId = Object.keys(this.formJson).length;
            } else {
                var settDiv = document.getElementById('settingArea'),
                    formDiv = this.createElem('div',{id: 'form-'+this.formId}),
					headDiv = this.createElem('div',{innerHTML: 'Form: '+this.formId, className: 'formHeader'});
				formDiv.append(headDiv);
                settDiv.append(formDiv);
                this.formJson = {};
                this.fieldId = 0;
            }
			this.modifyJsonView();
			this.previewForm();	
        },

		/**
		* show previous form
		* @params
		*/
		showPreviousForm: function($scope) {
            if(Object.keys(this.formJson).length > 0) this.resultJson['form-'+this.formId] = this.formJson;
            document.getElementById('form-'+this.formId).style.display = 'none';
            this.formId--;
            document.getElementById('form-'+this.formId).style.display = 'block';
            if(this.formId <= 1) $scope.previousBtn = false;
            this.formJson = this.resultJson['form-'+this.formId];
            this.fieldId = Object.keys(this.formJson).length;
			this.modifyJsonView();
			this.previewForm();	
        },

		/**
		* save current form
		* @params
		*/
		saveForm: function($scope) {
            if(Object.keys(this.formJson).length <= 0) return;
            this.resultJson['form-'+this.formId] = this.formJson;
            this.formId++;
            $scope.addNewForm();
        },

		/**
		* finish or submit form
		* @params
		*/
        submitForm: function($scope) {
            if(Object.keys(this.formJson).length <= 0) return;
            $scope.previousBtn = false;
            this.resultJson['form-'+this.formId] = this.formJson;
            console.log(this.resultJson);
            document.getElementById('settingArea').innerHTML = '';
            this.resultJson = {};
            this.formJson = {};
            this.fieldId = 0;
			this.modifyJsonView();
			this.previewForm();	
        },

		/**
		* reset current form
		* @params
		*/
        resetForm: function() {
            document.getElementById('form-'+this.formId).innerHTML = '<div class="formHeader">Form: '+this.formId+'</div>';
            this.formJson = {};
            this.fieldId = 0;
			this.modifyJsonView();
			this.previewForm();	
        },

		/**
		* modify JSON
		* @params
		*/
		modifyFormJson: function(newVal) {
			this.formJson["field-"+newVal.fieldId] = {
				"field_title": newVal.fieldName,
				"field_type": newVal.fieldType,
				"field_value": newVal.defaultValue,
				"field_required": newVal.isRequired,
				"field_options": newVal.options || [],
				"field_events": newVal.events || []
			}
			if(newVal.fieldType === 'image') this.formJson["field-"+newVal.fieldId]['field_use_image_as'] = newVal.useImageAs;
			this.modifyJsonView();
			this.previewForm();	
		},

		/**
		* modify JSON view
		* @params
		*/
		modifyJsonView: function() {
			document.getElementById("jsonArea").innerHTML = '<pre style="height:100%;border:none;">'+JSON.stringify(this.formJson,undefined,2)+'</pre>';
		},

		/**
		* add new radio options
		* @params
		*/
		addRadioOptions: function($scope) {
			var id = $scope.field.formId+'-'+$scope.field.fieldId;
            var optValue = document.getElementById('options-'+id).value;
            if(optValue === 0 || optValue === '') return;

            if($scope.field.options.indexOf(optValue) != -1) return;
            $scope.field.options.push(optValue);
			this.addSelectedOptions($scope,document.getElementById('addedOptions-'+id),'options',optValue);
		},

		/**
		* add events
		* @params
		*/
		addEvents: function($scope) {
			var id = $scope.field.formId+'-'+$scope.field.fieldId;
			var eventType = document.getElementById('eventType-'+id).value;
			var eventValue = document.getElementById('eventAction-'+id).value;
			if(eventType === '0' || eventValue === '0') return;

			if($scope.field.events.indexOf(eventType+'-'+eventValue) != -1) return;
			$scope.field.events.push(eventType+'-'+eventValue);
			this.addSelectedOptions($scope,document.getElementById('event-'+id),'events',eventType+'-'+eventValue)

		},

		/**
		* add selected options/events
		* @params
		*/
		addSelectedOptions: function($scope,elem,elemType,elemValue) {
			var box = this.createElem('div', {className: 'optionsAdded'}),
				span = this.createElem('div',{className: 'eventAdded', innerHTML: elemValue}),
				close = this.createElem('label',{className: 'lbl', innerHTML: '&nbsp;X'});
			close.addEventListener('click', function() {
				elem.removeChild(box);
				if(elemType === 'events') $scope.field.events.splice($scope.field.events.indexOf(elemValue),1);
				else if(elemType === 'options') $scope.field.options.splice($scope.field.options.indexOf(elemValue),1);
				$scope.$apply();
			});
			box.append(span);
			box.append(close);
			elem.append(box);
		},

		/**
		* create form elements
		* @params
		*/
		createElem: function(etype,attrs) {
			var elem = document.createElement(etype);
			var keys = Object.keys(attrs);
        	for(var i=0; i< keys.length; i++) {
            	var key = keys[i]
            	elem[key] = attrs[key];
        	}
        	return elem;
		},

		/**
		* preview form
		* @params
		*/
		previewForm: function() {
			var pElem = document.getElementById('previewArea');
			pElem.innerHTML = "";

			var fContainer = this.createElem('div',{className:'formContainer'})
			pElem.append(fContainer);

			var formJson = this.formJson;
			var keys = Object.keys(formJson);
			for(var i=0; i < keys.length; i++) {
				var data = formJson[keys[i]];

				var box = this.createElem('div',{className: 'formBox'});
				fContainer.append(box);	
				var required = data['field_required'];

				var reqSpan = document.createElement('span');
				if(required) {
					reqSpan.setAttribute('class', 'formRequired');
					reqSpan.innerHTML = '  *';
				}

				if(data['field_type'] === 'image') {
					box.setAttribute('class', 'formBannerBox');
					var elem = this.createElem('img',{src: data['field_value'], className: data['field_use_image_as']+'Image'});
					box.append(elem);

				} else if(data['field_type'] === 'select') {
					var lbl = this.createElem('label',{className: 'formLabel', innerHTML: data['field_title']});
					box.append(lbl);
					lbl.append(reqSpan);
					var options = data['field_options'];
					var optStr = "<option value=''>"+data['field_value']+"</option>";
					for(var j=0; j < options.length; j++) optStr += "<option value='+options[j]+'>"+options[j]+"</option>";
					var elem = this.createElem('select', {className:  'formSelect', innerHTML: optStr});
					box.append(elem);

				} else if(data['field_type'] === 'text') {
					var lbl = this.createElem('label',{className: 'formLabel', innerHTML: data['field_title']});
					box.append(lbl);
					lbl.append(reqSpan);
					var elem = this.createElem('input', {value: data['field_value'], className: 'formInputBox'});
					box.append(elem);

				}  else if(data['field_type'] === 'email') {
					var lbl = this.createElem('label',{className: 'formLabel', innerHTML: data['field_title']});
					box.append(lbl);
					lbl.append(reqSpan);
					var elem = this.createElem('input', {value: data['field_value'], className: 'formInputBox', type: 'email'});
					box.append(elem);

				} else if(data['field_type'] === 'radio') {
					var lbl = this.createElem('label', {className: 'formLabel', innerHTML: data['field_title']});
                    box.append(lbl);
                    lbl.append(reqSpan);
                    var options = data['field_options'];
                    for(var j=0; j < options.length; j++) {
						var rLabel = this.createElem('label',{className: 'formRadio'});
						var radio = this.createElem('input', {type: 'radio'});
						rLabel.append(radio);
						var span = this.createElem('span', {innerHTML: "&nbsp;"+options[j]});
						rLabel.append(span);
                    	box.append(rLabel);
					}

                } else if(data['field_type'] === 'checkbox') {
					var rLabel = this.createElem('label',{className: 'formRadio'});
					var elem = this.createElem('input',{type: 'checkbox'});
					rLabel.append(elem);
					var span = this.createElem('span',{innerHTML: "&nbsp;"+data['field_title']});
					rLabel.append(span);
					rLabel.append(reqSpan);
					box.append(rLabel);

                } else if(data['field_type'] === 'label') {
					var lbl = this.createElem('label',{className: 'formLabel', innerHTML: data['field_title']});
                    box.append(lbl);
                    lbl.append(reqSpan);

                } else if(data['field_type'] === 'button') {
					var elem = this.createElem('button',{className: 'formButton', value: data['field_title'], innerHTML: data['field_title']});
                    box.append(elem);

				}

				for(var j=0; j < data['field_events'].length; j++) {
					var arr = data['field_events'][j].split("-");
					elem.addEventListener(arr[0], function() {
						console.log(arr[1]+' function called!');
					});
				}
			}
		}

	};
	return retval;
}]);


