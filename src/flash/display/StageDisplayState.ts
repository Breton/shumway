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
// Class: StageDisplayState
module Shumway.AVMX.AS.flash.display {
	import notImplemented = Shumway.Debug.notImplemented;
	import axCoerceString = Shumway.AVMX.axCoerceString;

	export class StageDisplayState extends ASObject {

		// Called whenever the class is initialized.
		static classInitializer: any = null;

		// List of static symbols to link.
		static classSymbols: string [] = null; // [];

		// List of instance symbols to link.
		static instanceSymbols: string [] = null; // [];

		constructor() {
			super();
		}

		// JS -> AS Bindings
		static FULL_SCREEN: string = "fullScreen";
		static FULL_SCREEN_INTERACTIVE: string = "fullScreenInteractive";
		static NORMAL: string = "normal";


		// AS -> JS Bindings

		static fromNumber(n: number): string {
			switch (n) {
				case 0:
					return StageDisplayState.FULL_SCREEN;
				case 1:
					return StageDisplayState.FULL_SCREEN_INTERACTIVE;
				case 2:
					return StageDisplayState.NORMAL;
				default:
					return null;
			}
		}

		static toNumber(value: string): number {
			switch (value) {
				case StageDisplayState.FULL_SCREEN:
					return 0;
				case StageDisplayState.FULL_SCREEN_INTERACTIVE:
					return 1;
				case StageDisplayState.NORMAL:
					return 2;
				default:
					return -1;
			}
		}
	}
}
