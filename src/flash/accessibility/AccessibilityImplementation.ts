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
// Class: AccessibilityImplementation
module Shumway.AVMX.AS.flash.accessibility {
	export class AccessibilityImplementation extends ASObject {

		// Called whenever the class is initialized.
		static classInitializer: any = null;

		// List of static symbols to link.
		static classSymbols: string [] = null; // [];

		// List of instance symbols to link.
		static instanceSymbols: string [] = null; // ["stub", "errno", "get_accRole", "get_accName", "get_accValue", "get_accState", "get_accDefaultAction", "accDoDefaultAction", "isLabeledBy", "getChildIDArray", "accLocation", "get_accSelection", "get_accFocus", "accSelect", "get_selectionAnchorIndex", "get_selectionActiveIndex"];

		constructor() {
			super();
		}

		// JS -> AS Bindings

		stub: boolean;
		errno: number /*uint*/;
		get_accRole: (childID: number /*uint*/) => number /*uint*/;
		get_accName: (childID: number /*uint*/) => string;
		get_accValue: (childID: number /*uint*/) => string;
		get_accState: (childID: number /*uint*/) => number /*uint*/;
		get_accDefaultAction: (childID: number /*uint*/) => string;
		accDoDefaultAction: (childID: number /*uint*/) => void;
		isLabeledBy: (labelBounds: flash.geom.Rectangle) => boolean;
		getChildIDArray: () => any [];
		accLocation: (childID: number /*uint*/) => any;
		get_accSelection: () => any [];
		get_accFocus: () => number /*uint*/;
		accSelect: (operation: number /*uint*/, childID: number /*uint*/) => void;
		get_selectionAnchorIndex: () => any;
		get_selectionActiveIndex: () => any;

		// AS -> JS Bindings

	}
}
