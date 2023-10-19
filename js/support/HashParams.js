let parsedHashParams = null;
// let exportParams;

const parseHashParams = () => {
	if (parsedHashParams) {
		return;
	}

	const urlHash = window.location.hash;
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
	if (Array.isArray(data)) {
		parsedHashParams.maps = data.join(',');
	} else {
		parsedHashParams.loc = `${data.center.longitude.toFixed(
			2
		)},${data.center.latitude.toFixed(2)}`;
		parsedHashParams.LoD = data.zoom.toFixed(2);
	}

	// console.log(exportParams);
	const exportParams = parsedHashParams.export
		? `&export=${parsedHashParams.export}`
		: '';

	const animatingParams = parsedHashParams.isAnimating
		? `&isAnimating=${parsedHashParams.isAnimating}`
		: '';

	const hashString = `maps=${parsedHashParams.maps || ''}&loc=${
		parsedHashParams.loc
	}&LoD=${parsedHashParams.LoD}${exportParams}${animatingParams}`;

	//replacing the window location with the new information
	window.location.hash = hashString;
};

const invertHashedMapOrder = () => {
	const invertedMapOrder = parsedHashParams.maps.split(',').reverse();

	updateHashParams(invertedMapOrder);
};

const addHashExportPrompt = (mapDetails) => {
	const mapsForExport = mapDetails
		.map((mapDetail) => {
			return mapDetail.attributes.oid.value;
		})
		.join(',');

	window.location.hash += `&export=${mapsForExport}`;
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
	console.log(parsedHashParams.LoD);
	console.log(Number.parseFloat(parsedHashParams.LoD).toFixed(2));
	return Number.parseFloat(parsedHashParams.LoD).toFixed(2);
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

	parsedHashParams.export = null;

	const hashString = `maps=${parsedHashParams.maps || ''}&loc=${
		parsedHashParams.loc
	}&LoD=${parsedHashParams.LoD}`;

	window.location.hash = hashString;
};

const removeAnimationStatus = (isAnimating) => {
	if (!isAnimating) {
		parseHashParams;

		parsedHashParams.window.location.hash += `&animating=${isAnimating}`;
	}
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
