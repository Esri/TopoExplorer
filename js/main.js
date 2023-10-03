import './UI/Basemaps/basemaps.js?v=0.01';
import { isMobileFormat } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import { initSideBar } from './UI/SideBar/sideBar.js?v=0.01';
import { initMobileHeader } from './UI/MobileMapHeader/mobileMapHeader.js?v=0.01';
import './UI/MobileMapHeader/mobileMapHeader.js?v=0.01';
import { initView } from './map/View.js?v=0.01';
import {
	queryConfig,
	isHashedToposForQuery,
} from './support/QueryConfig.js?v=0.01';

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

const initApp = async () => {
	try {
		console.log('production trouble-shoot branch');
		const oauthRespose = await authorization();
		const view = await initView();
		const sliderValues = await getYearsAndScales(view);
		const getPreviousTopos = await isHashedToposForQuery(view);
		const initialMapQuery = () => {
			queryConfig.setGeometry(view.extent);
			queryConfig.mapView = view;
			queryConfig.extentQueryCall();
		};

		view
			.when(() => {
				if (oauthRespose) {
					addAccountImage(oauthRespose);
					setAccountData(oauthRespose);
				}

				sliderValues;
				initialMapQuery();
			})
			.then(() => {
				initLayerToggle(view);
				setBaseMapInfo(view);
				setViewInfo(view);
			})
			.then(() => {
				getPreviousTopos;
			})
			.then(() => {
				require(['esri/core/reactiveUtils'], (reactiveUtils) => {
					let prevCenter;
					let currentZoom;

					reactiveUtils.when(
						() => view?.stationary === true,
						async () => {
							if (prevCenter) {
								if (prevCenter.x === view.center.x) {
									return;
								}
							}

							queryConfig.setGeometry(view.extent);
							queryConfig.mapView = view;
							queryConfig.extentQueryCall();
							updateHashParams(view);

							prevCenter = view?.center;
						}
					);

					reactiveUtils.watch(
						() => [view.stationary, view.zoom],
						([stationary, zoom]) => {
							if (stationary && zoom !== currentZoom) {
								queryConfig.setGeometry(view.extent);
								queryConfig.mapView = view;
								queryConfig.extentQueryCall();
								updateHashParams(view);
								currentZoom = zoom;
							}
						}
					);
				});
			});

		// const isReadyForMoreMaps = (value) =>
		// 	value ? queryConfig.checkAvailableNumberOfMaps() : null;

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
