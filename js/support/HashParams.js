// const parseHashParams = urlHash
// 	.substring(1)
// 	.split('&')
// 	.reduce((res, item) => {
// 		const paramElement = item.split('=');
// 		res[paramElement[0]] = paramElement[1];
// 		return res;
// 	}, {});

let parsedHashParams = null;

const parseHashParams = () => {
	if (parsedHashParams) {
		return;
	}

	const urlHash = window.location.hash;
	console.log('asking hash update', urlHash);
	parsedHashParams = urlHash
		.substring(1)
		.split('&')
		.reduce((res, item) => {
			const paramElement = item.split('=');
			res[paramElement[0]] = paramElement[1];
			return res;
		}, {});
};

const updateHashParams = (data) => {
	//NOTE: I'm not sure if using one function to update the hashParams string is the best idea,
	//I'm worried that it could clutter the goal of the function,
	//but I thought this apporach might be a simple way to track and implement the changes to the hash params
	// console.log(data);
	// console.log(typeof data);

	if (Array.isArray(data)) {
		// console.log(data)
		// data.reverse();
		parsedHashParams.maps = data.join(',');
	} else {
		parsedHashParams.loc = `${data.center.longitude.toFixed(
			2
		)},${data.center.latitude.toFixed(2)}`;
		parsedHashParams.LoD = data.zoom;
	}

	// console.log(parsedHashParams);

	const exportParams = parsedHashParams.export
		? `&export=${parsedHashParams.export}`
		: '';

	const hashString = `maps=${parsedHashParams.maps || ''}&loc=${
		parsedHashParams.loc
	}&LoD=${parsedHashParams.LoD}${exportParams}`;

	window.location.hash = hashString;
};

const invertHashedMapOrder = () => {
	console.log(parsedHashParams.maps);

	const invertedMapOrder = parsedHashParams.maps.split(',').reverse();

	updateHashParams(invertedMapOrder);
};
const addHashExportPrompt = (mapDetails) => {
	console.log(mapDetails);
	const mapIDs = mapDetails
		.map((mapDetail) => {
			console.log(mapDetail.attributes.oid.value);
			return mapDetail.attributes.oid.value;
		})
		.join(',');
	console.log('adding export info');
	window.location.hash += `&export=${mapIDs}`;
};

const hashCoordinates = () => {
	parseHashParams();

	if (!parsedHashParams.loc) {
		return;
	}

	return parsedHashParams.loc.split(',');
};

const hashLoD = () => {
	parseHashParams();

	if (!parsedHashParams.LoD) {
		return;
	}

	return parsedHashParams.LoD;
};

const checkForPreviousTopos = () => {
	parseHashParams();

	return parsedHashParams.maps;
};

const activeExport = () => {
	parseHashParams;

	return parsedHashParams.export;
};

const removeExportParam = () => {
	parseHashParams;

	const hashString = `maps=${parsedHashParams.maps || ''}&loc=${
		parsedHashParams.loc
	}&LoD=${parsedHashParams.LoD}`;

	window.location.hash = hashString;
};

export {
	updateHashParams,
	invertHashedMapOrder,
	addHashExportPrompt,
	activeExport,
	removeExportParam,
	hashCoordinates,
	checkForPreviousTopos,
	hashLoD,
};
