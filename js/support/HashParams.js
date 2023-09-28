let parsedHashParams = null;

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
		parsedHashParams.LoD = data.zoom;
	}

	const exportParams = parsedHashParams.export
		? `&export=${parsedHashParams.export}`
		: '';

	const hashString = `maps=${parsedHashParams.maps || ''}&loc=${
		parsedHashParams.loc
	}&LoD=${parsedHashParams.LoD}${exportParams}`;

	window.location.hash = hashString;
};

const invertHashedMapOrder = () => {
	const invertedMapOrder = parsedHashParams.maps.split(',').reverse();

	updateHashParams(invertedMapOrder);
};
const addHashExportPrompt = (mapDetails) => {
	const mapIDs = mapDetails
		.map((mapDetail) => {
			return mapDetail.attributes.oid.value;
		})
		.join(',');
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
