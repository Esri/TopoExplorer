import {
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
} from './queryController.js?v=0.03';
import { initDualSlider } from '../UI/DualSlider/DualSlider.js?v=0.03';
import {
	filterMaps,
	setFilterValues,
} from '../UI/MapCards/ListOfMaps.js?v=0.03';

let scaleSelections = null;
let yearSelections = null;

const allYearChoices = (minMaxYears) => {
	return new Promise((resolve, reject) => {
		let startYear = Math.ceil(minMaxYears[0] / 10) * 10;
		const decadesArr = [minMaxYears[0]];
		while (startYear <= minMaxYears[1]) {
			decadesArr.push(startYear);
			startYear = startYear + 10;
		}
		decadesArr.push(minMaxYears[1]);

		resolve(decadesArr);
	});
};

const allScaleChoices = (minMaxScales) => {
	return new Promise((resolve, reject) => {
		let startScale = minMaxScales[1];
		const scalesArr = [];
		while (startScale >= minMaxScales[0]) {
			if (startScale === 31250) {
				startScale = 24000;
			} else if (startScale === 12000) {
				startScale = 10000;
			}
			scalesArr.unshift(startScale);
			startScale = startScale / 2;
		}

		resolve(scalesArr);
		reject();
	});
};

const getMinMaxYears = Promise.all([getMinYear, getMaxYear]);
const getMinMaxScales = Promise.all([getMinScale, getMaxScale]);

const filterTheYear = (minYear, maxYear) => {
	setYearSelections(minYear, maxYear);
	const minScale = scaleSelections[0];
	const maxScale = scaleSelections[1];

	setFilterValues(minYear, maxYear, minScale, maxScale);
	filterMaps();
};

const filterTheScale = (minScale, maxScale) => {
	setScaleSelections(minScale, maxScale);
	const minYear = yearSelections[0];
	const maxYear = yearSelections[1];

	setFilterValues(minYear, maxYear, minScale, maxScale);
	filterMaps();
};

const setScaleSelections = (minScale, maxScale) => {
	scaleSelections = [minScale, maxScale];
};

const setYearSelections = (minYear, maxYear) => {
	yearSelections = [minYear, maxYear];
};

const getYearsAndScales = async (view, appConfig) => {
	if (!appConfig.enableTimeFilterSlider) {
		return;
	}
	await getMinMaxYears.then((minMaxYearsResponse) => {
		if (minMaxYearsResponse[0].error) {
			console.error(
				`error occurred during years-slider filter instantiation: attempting to retrieve the image service's ${appConfig.outfields.dateCurrent} attributes. The attribute, '${appConfig.outfields.dateCurrent}' is either not associated with this service or returns data not compatible to the generation the scales filter.`
			);
			return;
		}

		const minMaxYears = minMaxYearsResponse.map((yearAttributeResponse) => {
			return yearAttributeResponse.features[0].attributes.MapYear;
		});

		allYearChoices(minMaxYears).then((years) => {
			initDualSlider(
				'years',
				'YEARS',
				filterTheYear,
				years,
				years[0],
				years[years.length - 1],
				view
			);
			setYearSelections(years[0], years[years.length - 1]);
		});
	});

	if (!appConfig.enableScaleFilterSlider) {
		return;
	}
	await getMinMaxScales.then((minMaxScalesServiceResponse) => {
		if (minMaxScalesServiceResponse[0].error) {
			console.error(
				`error occurred during scales-slider filter instantiation: attempting to retrieve the image service's '${appConfig.outfields.mapScale}' attributes. The attribute, '${appConfig.outfields.mapScale}' is either not associated with this service or returns data not compatible to the generation the scales filter.`
			);
			return;
		}

		const minMaxScales = minMaxScalesServiceResponse.map(
			(scaleAttributeResponse) => {
				return scaleAttributeResponse.features[0].attributes.MapScale;
			}
		);

		allScaleChoices(minMaxScales).then((scales) => {
			initDualSlider(
				'scales',
				'SCALES',
				filterTheScale,
				scales,
				scales[0],
				scales[scales.length - 1],
				view
			);
			setScaleSelections(scales[0], scales[scales.length - 1]);
		});
	});
};
export { getYearsAndScales };
