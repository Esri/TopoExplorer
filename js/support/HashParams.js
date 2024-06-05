import { beginAnimation } from '../UI/Animation/animation.js?v=0.02';
import { toggleListVisibility } from '../UI/MapCards/ListOfMaps.js?v=0.02';
import { isPinModeActive } from '../UI/EventsAndSelectors/EventsAndSelectors.js?v=0.02';

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

const updateHashParams = (data, zoomLevel) => {
	if (Array.isArray(data)) {
		parsedHashParams.maps = data.join(',');

		window.location.hash = window.location.hash.replace(
			window.location.hash.substring(1).split('&')[0],
			`maps=${parsedHashParams.maps}`
		);

		return;
	} else {
		parsedHashParams.loc = `${data.longitude.toFixed(
			2
		)},${data.latitude.toFixed(2)}`;
		parsedHashParams.LoD = zoomLevel.toFixed(2);
	}

	const exportParams = parsedHashParams.export
		? `&export=${parsedHashParams.export}`
		: '';

	const animationParams = parsedHashParams.animation
		? `&animation=${parsedHashParams.animation}`
		: '';

	const hashString = `maps=${parsedHashParams.maps || ''}&loc=${
		parsedHashParams.loc
	}&LoD=${parsedHashParams.LoD}${exportParams}${animationParams}`;

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

const addAnimateStatusHashParam = () => {
	if (parsedHashParams.animation) {
		return;
	}
	const animationStatus = `&animation=true`;

	window.location.hash += animationStatus;
};

const removeAnimationStatusHashParam = () => {
	parseHashParams;

	parsedHashParams.animation = null;

	const hashString = `maps=${parsedHashParams.maps || ''}&loc=${
		parsedHashParams.loc
	}&LoD=${parsedHashParams.LoD}`;

	window.location.hash = hashString;
};

const animatingStatus = () => {
	if (parsedHashParams.animation) {
		if (!isPinModeActive()) {
			toggleListVisibility();
		}
		beginAnimation();
	}
	return;
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

export {
	updateHashParams,
	invertHashedMapOrder,
	addHashExportPrompt,
	addAnimateStatusHashParam,
	activeExport,
	animatingStatus,
	removeExportParam,
	removeAnimationStatusHashParam,
	hashCoordinates,
	checkForPreviousTopos,
	hashLoD,
};
