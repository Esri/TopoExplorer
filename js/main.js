import './UI/Basemaps/basemaps.js?v=0.01';
import { isMobileFormat } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import { initSideBar } from './UI/SideBar/sideBar.js?v=0.01';
import { initMobileHeader } from './UI/MobileMapHeader/mobileMapHeader.js?v=0.01';
import './UI/MobileMapHeader/mobileMapHeader.js?v=0.01';
import { initView, newMapCrossHair } from './map/View.js?v=0.01';
import {
	queryController,
	isHashedToposForQuery,
	setView,
} from './support/queryController.js?v=0.01';

// import { isScrollAtPageEnd } from './support/eventListeners/ScrollListener.js?v=0.01';

import { updateHashParams } from './support/HashParams.js?v=0.01';
import { getYearsAndScales } from './support/YearsAndScalesProcessing.js?v=0.01';

import { authorization } from './support/OAuth.js?v=0.01';
import { addAccountImage } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import {
	setBaseMapInfo,
	setViewInfo,
} from './UI/ExportMaps/ExportMapsPrompt.js?v=0.01';
import { initLayerToggle } from './UI/Basemaps/basemaps.js?v=0.01';
import { setAccountData } from './support/AddItemRequest.js?v=0.01';
import { animatingStatus } from './support/HashParams.js?v=0.01';

const initApp = async () => {
	try {
		const oauthResponse = await authorization();
		const view = await initView();
		const sliderValues = await getYearsAndScales(view);
		// const getPreviousTopos = await isHashedToposForQuery(view);
		const searchWidget = view.ui.find('searchWidget');
		const initialMapQuery = () => {
			queryController.setGeometry(view.extent.center);
			queryController.mapView = view;
			// setView(view);
			queryController.extentQueryCall();
			newMapCrossHair(view, view.center);
		};

		view
			.when(() => {
				// setView(view);
				// queryController.mapView = view;
				if (oauthResponse) {
					addAccountImage(oauthResponse);
					setAccountData(oauthResponse);
				}

				sliderValues;
			})
			.then(() => {
				initLayerToggle(view);
				setBaseMapInfo(view);
				setViewInfo(view);
			})
			.then(() => {
				isHashedToposForQuery(view);

				view.on('click', (event) => {
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

				require(['esri/core/reactiveUtils'], (reactiveUtils) => {
					let prevCenter;
					let currentZoom;

					reactiveUtils.when(
						() => view?.updating === false,
						() => {
							console.log('done building layers');
							initialMapQuery();
							animatingStatus();
						},
						{
							once: true,
						}
					);

					reactiveUtils.when(
						() => view?.stationary === true,
						async () => {
							// if (prevCenter) {
							// 	if (prevCenter.x === view.center.x) {
							// 		return;
							// 	}
							// }
							// queryController.setGeometry(view.extent.center);
							queryController.mapView = view;
							// queryController.extentQueryCall();
							updateHashParams(view.extent.center, view.zoom);

							// prevCenter = view?.center;
						}
					);

					// 	reactiveUtils.watch(
					// 		() => [view.stationary, view.zoom],
					// 		([stationary, zoom]) => {
					// 			if (stationary && zoom !== currentZoom) {
					// 				// queryController.setGeometry(view.extent.center);
					// 				// queryController.mapView = view;
					// 				// queryController.extentQueryCall();
					// 				// updateHashParams(view.extent.center);
					// 				currentZoom = zoom;
					// 			}
					// 		}
					// 	);
				});
			});

		// const isReadyForMoreMaps = (value) =>
		// 	value ? queryController.checkAvailableNumberOfMaps() : null;

		// isScrollAtPageEnd(isReadyForMoreMaps);
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
