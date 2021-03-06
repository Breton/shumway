/*
 * Copyright 2015 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

module Shumway.Player {
	import flash = Shumway.AVMX.AS.flash;
	import IBitmapDataSerializer = flash.display.IBitmapDataSerializer;
	import IAssetResolver = Timeline.IAssetResolver;
	import IFSCommandListener = flash.system.IFSCommandListener;
	import IVideoElementService = flash.net.IVideoElementService;
	import IRootElementService = flash.display.IRootElementService;
	import ICrossDomainSWFLoadingWhitelist = flash.system.ICrossDomainSWFLoadingWhitelist;

	export interface SWFPlayer extends IBitmapDataSerializer,
		IFSCommandListener,
		IVideoElementService,
		IAssetResolver,
		IRootElementService,
		ICrossDomainSWFLoadingWhitelist {
		syncDisplayObject(displayObject: flash.display.DisplayObject, async: boolean): any;

		requestRendering(): void;
	}
}
