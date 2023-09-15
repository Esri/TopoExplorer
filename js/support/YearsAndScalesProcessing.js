import {
	yearsAndMapScales,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
} from './QueryConfig.js?v=0.01';
import { queryConfig } from './QueryConfig.js?v=0.01';
import { initDualSlider } from '../UI/DualSlider/DualSlider.js?v=0.01';
import { sortChoice } from '../UI/Sort/Sort.js?v=0.01';

const allYearChoices = (minMaxYears) => {
	return new Promise((resolve, reject) => {
		let startYear = Math.ceil(minMaxYears[0] / 10) * 10;
		const decadesArr = [minMaxYears[0]];
		while (startYear <= minMaxYears[1]) {
			decadesArr.push(startYear);
			startYear = startYear + 10;
			// console.log(decades);
		}
		decadesArr.push(startYear);

		// console.log(decades);
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
			// console.log(scalesArr);
		}
		resolve(scalesArr);
	});
};

const getMinMaxyears = Promise.all([getMinYear, getMaxYear]);
const getMinMaxScales = Promise.all([getMinScale, getMaxScale]);
// getAllScalesAndYears;

const minMaxYears = getMinMaxyears;
const minMaxScales = getMinMaxScales;

const getTheYear = (index, value) => {
	// console.log(yearsAndMapScales);
	index === 0
		? yearsAndMapScales.updateMinYear(value)
		: yearsAndMapScales.updateMaxYear(value);
	// console.log(scalesAndYears);
	queryConfig.extentQueryCall();
};

const getTheScale = (index, value) => {
	// console.log(value);
	index === 0
		? yearsAndMapScales.updateMinScale(value)
		: yearsAndMapScales.updateMaxScale(value);

	// console.log(yearsAndMapScales);
	queryConfig.extentQueryCall();
};

const setSortOptions = (choiceValue) => {
	console.log('check the query Config', queryConfig);
	queryConfig.setSortChoice(choiceValue);
	queryConfig.extentQueryCall();
};

sortChoice(setSortOptions);

const getYearsAndScales = async (view) => {
	await minMaxYears.then((minMaxYears) => {
		allYearChoices(minMaxYears).then((years) => {
			yearsAndMapScales.setMinMaxYears(years);
			initDualSlider(
				'years',
				'YEARS',
				getTheYear,
				years,
				years[0],
				years[years.length - 1],
				view
			);
		});
	}),
		await minMaxScales.then((minMaxScales) => {
			allScaleChoices(minMaxScales).then((scales) => {
				yearsAndMapScales.setMinMaxMapScales(scales);
				initDualSlider(
					'scales',
					'SCALES',
					getTheScale,
					scales,
					scales[0],
					scales[scales.length - 1],
					view
				);
			});
		});
};
export { getYearsAndScales };
