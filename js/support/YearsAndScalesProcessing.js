import {
	queryController,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
} from './queryController.js?v=0.02';
import { initDualSlider } from '../UI/DualSlider/DualSlider.js?v=0.02';
import { initSortChoice } from '../UI/Sort/Sort.js?v=0.02';
import {
	filterMaps,
	setFilterValues,
} from '../UI/MapCards/ListOfMaps.js?v=0.02';

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
		while (startScale > minMaxScales[0]) {
			if (startScale === 31250) {
				startScale = 24000;
			} else if (startScale === 12000) {
				startScale = 10000;
			}
			scalesArr.unshift(startScale);
			startScale = startScale / 2;
		}
		resolve(scalesArr);
	});
};

const getMinMaxYears = Promise.all([getMinYear, getMaxYear]);
const getMinMaxScales = Promise.all([getMinScale, getMaxScale]);

const minMaxYears = getMinMaxYears;
const minMaxScales = getMinMaxScales;

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

const getYearsAndScales = async (view) => {
	await minMaxYears.then((minMaxYears) => {
		allYearChoices(minMaxYears).then((years) => {
			// yearsAndMapScales.setMinMaxYears(years);
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
	}),
		await minMaxScales.then((minMaxScales) => {
			allScaleChoices(minMaxScales).then((scales) => {
				// yearsAndMapScales.setMinMaxMapScales(scales);
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
