/**
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Class: ExternalInterface
module Shumway.AVMX.AS.flash.external {
	import notImplemented = Shumway.Debug.notImplemented;
	import axCoerceString = Shumway.AVMX.axCoerceString;
	import Telemetry = Shumway.Telemetry;
	import ExternalInterfaceService = Shumway.ExternalInterfaceService;

	export class ExternalInterface extends ASObject {

		static classInitializer: any = null;

		constructor() {
			super();
		}

		static $BgmarshallExceptions: boolean;

		private static initialized: boolean = false;
		private static registeredCallbacks: Shumway.MapObject<Function> = Object.create(null);

		static ensureInitialized(): void {
			if (!this.available) {
				this.sec.throwError('Error', Errors.ExternalInterfaceNotAvailableError);
			}
			if (this.initialized) {
				return;
			}
			Telemetry.instance.reportTelemetry({
				topic: 'feature',
				feature: Telemetry.Feature.EXTERNAL_INTERFACE_FEATURE
			});
			this.initialized = true;
			ExternalInterfaceService.instance.initJS(this._callIn);
		}

		static call(functionName: string) {
			this.ensureInitialized();
			let argsExpr: String = '';
			if (arguments.length > 1) {
				let args = [];
				for (let i = 1; i < arguments.length; i++) {
					args.push(this.convertToJSString(arguments[i]));
				}
				argsExpr = args.join(',');
			}
			let catchExpr = this.$BgmarshallExceptions ?
				'"<exception>" + e + "</exception>";' :
				'"<undefined/>";';
			let evalExpr = 'try {' + '__flash__toXML(' + functionName + '(' + argsExpr + '));' +
				'} catch (e) {' + catchExpr + '}';
			let result = this._evalJS(evalExpr);
			if (result == null) {
				return null;
			}
			return this.convertFromXML(this.convertToXML(result));
		}

		static addCallback(functionName: string, closure: AXFunction): void {
			this.ensureInitialized();
			if (!closure) {
				this._removeCallback(functionName);
				return;
			}

			let self = this;

			this._addCallback(functionName, function (request: string, args: any[]) {
				let returnAsJS: Boolean = true;
				if (args) {
					let wrappedArgs = [];
					for (let i = 0; i < args.length; i++) {
						let arg = args[i];
						// Objects have to be converted into proper AS objects in the current security domain.
						if (typeof arg === 'object' && arg) {
							wrappedArgs.push(self.sec.createObjectFromJS(arg, true));
						} else {
							wrappedArgs.push(arg);
						}
					}
					args = wrappedArgs;
				} else {
					let xml = this.convertToXML(request);
					let returnTypeAttr = xml.attribute('returntype');
					returnAsJS = returnTypeAttr && returnTypeAttr._value == 'javascript';
					args = [];
					for (let i = 0; i < xml._children.length; i++) {
						let x = xml._children[i];
						args.push(this.convertFromXML(x));
					}
				}

				let result;
				try {
					result = closure.axApply(null, args);
				} catch (e) {
					if (this.$BgmarshallExceptions) {
						result = e;
					} else {
						throw e;
					}
				}
				return returnAsJS ? self.convertToJSString(result) : self.convertToXMLString(result);
			});
		}

		static get available(): boolean {
			return ExternalInterfaceService.instance.enabled;
		}

		static get objectID(): string {
			return ExternalInterfaceService.instance.getId();
		}

		static _addCallback(functionName: string, closure: Function): void {
			ExternalInterfaceService.instance.registerCallback(functionName);
			ExternalInterface.registeredCallbacks[functionName] = closure;
		}

		static _removeCallback(functionName: string): void {
			ExternalInterfaceService.instance.unregisterCallback(functionName);
			delete ExternalInterface.registeredCallbacks[functionName];
		}

		static _evalJS(expression: string): string {
			expression = axCoerceString(expression);
			return ExternalInterfaceService.instance.eval(expression);
		}

		private static _callIn(functionName: string, args: any[]) {
			let callback = ExternalInterface.registeredCallbacks[functionName];
			if (!callback) {
				return;
			}
			return callback(functionName, args);
		}

		static _callOut(request: string): string {
			request = axCoerceString(request);
			return ExternalInterfaceService.instance.call(request);
		}

		static convertToXML(s: String): ASXML {
			let xmlClass = <AXXMLClass>this.sec.system.getClass(Multiname.FromSimpleName('XML'));
			let savedIgnoreWhitespace = xmlClass.ignoreWhitespace;
			xmlClass.ignoreWhitespace = false;
			let xml: ASXML = xmlClass.Create(s);
			xmlClass.ignoreWhitespace = savedIgnoreWhitespace;
			return xml;
		}

		static convertToXMLString(obj: any): String {
			switch (typeof obj) {
				case 'boolean':
					return obj ? '<true/>' : '<false/>';
				case 'number':
					return '<number>' + obj + '</number>';
				case 'string':
					return '<string>' + obj.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;') + '</string>';
				case 'object':
					if (obj === null) {
						return '<null/>';
					}
					if (this.sec.AXDate.axIsInstanceOf(obj)) {
						return '<date>' + obj.time + '</date>';
					}
					if (this.sec.AXError.axIsInstanceOf(obj)) {
						if (this.$BgmarshallExceptions) {
							return '<exception>' + obj + '</exception>';
						} else {
							return '<null/>'; // not sure?
						}
					}
					let result: string[] = [];
					// Looks like length is used to detect array. (obj is Array) is better?
					if (obj.hasOwnProperty('$Bglength')) {
						let len = obj.$Bglength;
						for (let i = 0; i < len; i++) {
							let entry = this.convertToXMLString(obj.axGetNumericProperty(i));
							result.push('<property id="' + i + '">' + entry + '</property>');
						}
						return '<array>' + result.join('') + '</array>';
					}
					let keys = obj.axGetEnumerableKeys();
					for (let i = 0; i < keys.length; i++) {
						let key = keys[i];
						let entry = this.convertToXMLString(obj.axGetPublicProperty(key));
						result.push('<property id="' + key + '">' + entry + '</property>');
					}
					return '<object>' + result.join('') + '</object>';
				default:
					return '<undefined/>';
			}
		}

		static convertFromXML(xml: any /* ASXML | ASXMLList */): any {
			switch (xml._name.name) {
				case 'true':
					return true;
				case 'false':
					return false;
				case 'number':
					return Number(String(xml.children()));
				case 'string':
					return String(xml.children());
				case 'null':
					return null;
				case 'date':
					return this.sec.AXDate.axConstruct([Number(String(xml.children()))]);
				case 'exception':
					if (this.$BgmarshallExceptions) {
						throw this.sec.AXError.axConstruct([String(xml.children())]);
					}
					return undefined;
				case 'array':
				case 'object':
					let obj: AXObject = xml._name.name === 'object' ?
						this.sec.createObject() :
						this.sec.createArrayUnsafe([]);
					for (let i = 0; i < xml._children.length; i++) {
						let x = xml._children[i];
						obj.axSetPublicProperty(extractId(x), this.convertFromXML(x._children[0]));
					}
					return obj;
				case 'class':
					let className = Multiname.FromFQNString(String(xml.children()), NamespaceType.Public);
					return this.sec.application.getClass(className);
				default:
					return undefined;
			}
		}

		static convertToJSString(obj: any): string {
			if (typeof obj == 'string') {
				return '"' + obj.split('\r').join('\\r').split('\n').join('\\n').split('"').join('\\"') + '"';
			}
			if (this.sec.AXArray.axIsInstanceOf(obj)) {
				let parts: string[] = [];
				let arr = obj.value;
				for (let i = 0; i < arr.length; i++) {
					parts.push(this.convertToJSString(arr[i]));
				}
				return '[' + parts.join(',') + ']';
			}
			if (this.sec.AXDate.axIsInstanceOf(obj)) {
				return 'new Date(' + obj.value + ')';
			}
			if (this.$BgmarshallExceptions && (this.sec.AXError.axIsInstanceOf(obj))) {
				return 'throw "' + obj + '"';
			}
			if (typeof obj === 'object' && obj !== null) {
				let parts: string[] = [];
				let keys = obj.axGetEnumerableKeys();
				for (let i = 0; i < keys.length; i++) {
					let key = keys[i];
					parts.push(key + ':' + this.convertToJSString(obj.axGetPublicProperty(key)));
				}
				return '({' + parts.join(',') + '})';
			}
			return String(obj);
		}
	}

	function extractId(node: ASXML) {
		for (let i = 0; i < node._attributes.length; i++) {
			let attribute = node._attributes[i];
			if (attribute._name.name === 'id') {
				return attribute._value;
			}
		}
		// TODO: throw if no `id` attribute was found.
	}
}
