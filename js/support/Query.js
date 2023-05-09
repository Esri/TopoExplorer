//NOTE: TODO: You need to seperate some of these query-calls, some of doing similar things but for a different purpose. They should be grouped together (the queries for UI, and the queries for the map items)
// import { queryConfig } from './QueryConfig.js?=v0.01';
// import { createMapSlotItems } from '../UI/MapCards/ListOfMaps.js?=v0.01';

let isQuerying;

let controller = new AbortController();

const cancelQuery = () => {
	// console.log('canceling query...');
	controller.abort();
	controller = new AbortController();
};

const extentQuery = async (url, params) => {
	console.log(
		`query to get ${params.resultRecordCount} maps at position ${params.resultOffset}`
	);

	//TODO: need to refactor the querySelector and 'hidden' class removal. It occurs twice and shouldn't really be here.
	if (isQuerying !== true) {
		// console.log(isQuerying !== true);
		isQuerying = true;
	} else {
		// console.log(isQuerying !== true);
		cancelQuery();
		isQuerying = true;
	}

	// console.log(url);
	// console.log(params);

	//Do I want to move params to the queryConfig? I would need to make another OBJ within it for the total maps and the 25 maps queries
	return new Promise((resolve, reject) => {
		axios.get(url, { params, signal: controller.signal }).then((response) => {
			isQuerying = false;

			// console.log(response);

			// console.log(isQuerying);
			setTimeout(() => {
				!isQuerying ? resolve(response) : (response = []);
			}, 700);
		});
	}).catch((error) => {
		console.log(error);
	});
};

const numberOfMapsinView = async (url, params) => {
	console.log('querying to find total number of maps');

	if (isQuerying !== true) {
		// console.log(isQuerying !== true);
		isQuerying = true;
	} else {
		// console.log(isQuerying !== true);
		isQuerying = true;
		cancelQuery();
	}

	return new Promise((resolve, reject) => {
		// console.log('url', url);
		// console.log('params', params);

		axios.get(url, { params, signal: controller.signal }).then((response) => {
			isQuerying = false;
			// console.log(response);

			// console.log(isQuerying);
			resolve(response);
		});
	});
};

//NOTE: do I need to export both?
export { extentQuery, numberOfMapsinView };
