import './UI/Basemaps/basemaps.js?v=0.01';
import { isMobileFormat } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.01';
import { initSideBar } from './UI/SideBar/sideBar.js?v=0.01';
import { initMobileHeader } from './UI/MobileMapHeader/mobileMapHeader.js?v=0.01';
import './UI/MobileMapHeader/mobileMapHeader.js?v=0.01';
import { initView } from './map/View.js?v=0.01';
//NOTE: you are importing two elements from this module. Is that necessary?
import {
	queryConfig,
	isHashedToposForQuery,
} from './support/QueryConfig.js?v=0.01';
//You should remove this import. You probably don't need this here.
import { isScrollAtPageEnd } from './support/eventListeners/ScrollListener.js?v=0.01';

import { updateHashParams } from './support/HashParams.js?v=0.01';
import { getYearsAndScales } from './support/YearsAndScalesProcessing.js?v=0.01';

import { authorization } from './support/OAuth.js?v=0.01';
import { addAccountImage } from './UI/EventsAndSelectors/EventsAndSelectors.js?v=0.01';
// import { setUserItemPageURL } from './UI/ExportMapsPrompt/exportPromptUI.js?v=0.01';
import { setBaseMapInfo } from './UI/ExportMaps/ExportMapsPrompt.js?v=0.01';
import { initLayerToggle } from './UI/Basemaps/basemaps.js?v=0.01';
import { setAccountData } from './support/AddItemRequest.js?v=0.01';

// console.log('set to mobile format?', isMobileFormat());
// if(isMobileFormat()){

// }

const initApp = async () => {
	try {
		const oauthRespose = await authorization().then((results) => {
			if (!results) {
				return;
			}
			console.log('authorization results', results);
			addAccountImage(results);
			setAccountData(results);
		});
		const view = await initView();
		const sliderValues = await getYearsAndScales(view);
		const getPreviousTopos = await isHashedToposForQuery(view);

		view
			.when(() => {})
			.then(() => {
				sliderValues;
				setBaseMapInfo(view);
				// initLayerToggle(view);
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
							console.log('view info', view);
							// console.log('view info', view.extent.xmax);

							// console.log('new layer count', view.map.layers.length);
							if (prevCenter) {
								if (prevCenter.x === view.center.x) {
									// console.log('previous center', prevCenter.x);
									// console.log('new center', view.center.x);

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

		const isReadyForMoreMaps = (value) =>
			value ? queryConfig.checkAvailableNumberOfMaps() : null;

		isScrollAtPageEnd(isReadyForMoreMaps);
		// });
	} catch (error) {
		//error handeling for any intialization issues
		console.error('problem initalizing app', error);
	}
};

// await authorization()
// 	.then((hash) => {
// 		console.log('hashparams before main.js calls initView()', hash);
// 		return hash;
// 	})
// 	.then((hash) => {
// 		console.log('the hash value right before initapp is called', hash);
// 		initApp();
// 	});
if (isMobileFormat()) {
	initSideBar();
	initMobileHeader();
}
initApp();
