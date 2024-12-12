import './UI/Basemaps/basemaps.js?v=0.03';
import { isMobileFormat } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.03';
import { initSideBar } from './UI/SideBar/sideBar.js?v=0.03';
import { initMobileHeader } from './UI/MobileMapHeader/mobileMapHeader.js?v=0.03';
import './UI/MobileMapHeader/mobileMapHeader.js?v=0.03';
import { initView, newMapCrossHair } from './map/View.js?v=0.03';
import {
	queryController,
	isHashedToposForQuery,
	dataServiceType,
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
		if (!dataServiceType.includes('ImageService')) {
			console.error(
				`This application built to interact with an esri image service. Not a '${dataServiceType}' type.`
			);
			return;
		}
		if (
			dataServiceType.includes('ImageService') &&
			dataServiceType !== 'esriImageServiceDataTypeRGB'
		) {
			console.warn(
				`While this application is built to be used with an image service, it was developed specifically for esriImageServiceDataTypeRGB, not a '${dataServiceType}'.`
			);
		}
		const oauthResponse = await authorization();
		const view = await initView();

		const sliderValues = appConfig.enableSliders
			? await getYearsAndScales(view, appConfig)
			: null;

		const searchWidget = view.ui.find('searchWidget');
		const initialMapQuery = () => {
			queryController.setSpatialRelation(view.setSpatialReference);
			queryController.setGeometry(view.extent.center);
			queryController.mapView = view;

			queryController.extentQueryCall();
			newMapCrossHair(view, view.center);
		};

		view
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
					newMapCrossHair(view, event.mapPoint);
					queryController.setGeometry(event.mapPoint);
					queryController.extentQueryCall();
					updateHashParams(event.mapPoint, zoomLevel);
				});

				searchWidget.on('select-result', (event) => {
					const searchResultPoint = event.result.extent.center;
					queryController.setGeometry(event.result.extent.center);
					queryController.extentQueryCall();
					newMapCrossHair(view, searchResultPoint);
				});
			});
	} catch (error) {
		console.error('problem initalizing app', error);
	}
};

if (isMobileFormat()) {
	initSideBar();
	initMobileHeader();
}
initApp();
