import { initView } from './map/View.js?v=0.01';

const initApp = async () => {
	try {
		//Initializing 'mapView', which contains 'map'.
		const view = await initView();

		//recognizing when the view has been successfully initialized.
		view.when().then(console.log('webmap initialized'));
	} catch (error) {
		//error handeling for any intialization issues
		console.error('problem initalizing app', error);
	}
};

//executing intialization
initApp();
