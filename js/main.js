import './UI/Basemaps/basemaps.js?v=0.03';
import { isMobileFormat } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.03';
import { initSideBar } from './UI/SideBar/sideBar.js?v=0.03';
import { initMobileHeader } from './UI/MobileMapHeader/mobileMapHeader.js?v=0.03';
import './UI/MobileMapHeader/mobileMapHeader.js?v=0.03';
import { initView, newMapCrossHair } from './map/View.js?v=0.03';
import {
	queryController,
	isHashedToposForQuery,
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

const initApp = async () => {
	try {
		const oauthResponse = await authorization();
		const view = await initView();
		const sliderValues = await getYearsAndScales(view);

		const searchWidget = view.ui.find('searchWidget');
		const initialMapQuery = () => {
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
				initLayerToggle(view);
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

				// reactiveUtils.when(
				// 	() => view?.updating === false,
				// 	() => {
				// 		// initialMapQuery();
				// 		animatingStatus();
				// 	},
				// 	{
				// 		once: true,
				// 	}
				// );

				// reactiveUtils.when(
				// 	() => view?.stationary === true,
				// 	async () => {
				// 		queryController.mapView = view;

				// 		updateHashParams(view.extent.center, view.zoom);
				// 	}
				// );
				//
				// });
				//
			});
	} catch (error) {
		//error handeling for any intialization issues
		console.error('problem initalizing app', error);
	}
};

if (isMobileFormat()) {
	initSideBar();
	initMobileHeader();
}
initApp();
