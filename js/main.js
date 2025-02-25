/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
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

import './UI/Basemaps/basemaps.js?v=0.03';
import { isMobileFormat } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.03';
import {
	initSideBar,
	renderErrorMessage,
} from './UI/SideBar/sideBar.js?v=0.03';
import { initMobileHeader } from './UI/MobileMapHeader/mobileMapHeader.js?v=0.03';
import './UI/MobileMapHeader/mobileMapHeader.js?v=0.03';
import { initView, newMapCrossHair, isWebMapValid } from './map/View.js?v=0.03';
import {
	queryController,
	isHashedToposForQuery,
	serviceFetch,
	isServiceAnImageService,
	areOutfieldsFoundInServiceAttributes,
} from './support/queryController.js?v=0.03';

import { updateHashParams } from './support/HashParams.js?v=0.03';
import { getYearsAndScales } from './support/YearsAndScalesProcessing.js?v=0.03';

import { authorization } from './support/OAuth.js?v=0.03';
import { addAccountImage } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.03';
import {
	setBaseMapInfo,
	setViewInfo,
} from './UI/ExportMaps/ExportMapsPrompt.js?v=0.03';
import { initLayerToggle } from './UI/Basemaps/basemaps.js?v=0.03';
import { setAccountData } from './support/AddItemRequest.js?v=0.03';
import { animatingStatus } from './support/HashParams.js?v=0.03';
import { resetMobileHeaderInfo } from './UI/MobileMapHeader/mobileMapHeader.js?v=0.03';
import { appConfig } from '../app-config.js?v=0.03';

const initApp = async () => {
	try {
		await isWebMapValid();
		const view = await initView();
		const service = await serviceFetch;
		await isServiceAnImageService(service);
		await areOutfieldsFoundInServiceAttributes(service);

		const oauthResponse = await authorization();

		const sliderValues = appConfig.enableSliders
			? await getYearsAndScales(view, appConfig)
			: null;

		const initialMapQuery = () => {
			queryController.setSpatialRelation(view.spatialReference.wkid);
			queryController.setGeometry(view.extent.center);
			queryController.mapView = view;

			queryController.extentQueryCall();
			newMapCrossHair(view, view.center);
		};

		await view
			.when(() => {
				require(['esri/core/reactiveUtils'], (reactiveUtils) => {
					if (oauthResponse) {
						addAccountImage(oauthResponse);
						setAccountData(oauthResponse);
					}
					sliderValues;
					initLayerToggle(view);

					reactiveUtils.when(
						() => view?.updating === false,
						() => {
							animatingStatus();
						},
						{
							once: true,
						}
					);

					reactiveUtils.when(
						() => view.fatalError,
						() => view.tryFatalErrorRecovery()
					);

					reactiveUtils.when(
						() => view?.stationary === true,
						async () => {
							queryController.mapView = view;

							updateHashParams(view.extent.center, view.zoom);
						}
					);
				});
			})
			.then(() => {
				setBaseMapInfo(view);
				setViewInfo(view);
			})
			.then(() => {
				initialMapQuery();
				isHashedToposForQuery(view);

				view.on('click', (event) => {
					if (isMobileFormat()) {
						resetMobileHeaderInfo();
					}
					const zoomLevel = view.zoom;
					const normalizePoint = event.mapPoint.clone().normalize();
					newMapCrossHair(view, normalizePoint);
					queryController.setGeometry(normalizePoint);
					queryController.extentQueryCall();
					updateHashParams(normalizePoint, zoomLevel);
				});

				const searchWidget = view.ui.find('searchWidget');
				searchWidget.on('select-result', (event) => {
					const searchResultPoint = event.result.extent.center;
					queryController.setGeometry(event.result.extent.center);
					queryController.extentQueryCall();
					newMapCrossHair(view, searchResultPoint);
				});
			});
	} catch (error) {
		console.error('problem initializing app', error);
		renderErrorMessage(error);
	}
};

if (isMobileFormat()) {
	initSideBar();
	initMobileHeader();
}
initApp();
