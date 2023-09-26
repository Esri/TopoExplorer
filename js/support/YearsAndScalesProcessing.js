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
	const minYearSlider = document.querySelector('#years .minSlider');
	const maxYearSlider = document.querySelector('#years .maxSlider');

	if (parseInt(minYearSlider.value) > parseInt(maxYearSlider.value)) {
		console.log('setting years based on inverted slider position');
		yearsAndMapScales.updateMinYear(maxYearSlider.value);
		yearsAndMapScales.updateMaxYear(minYearSlider.value);
		queryConfig.extentQueryCall();
		return;
	}

	if (parseInt(minYearSlider.value) < parseInt(maxYearSlider.value)) {
		console.log('setting years based on initial slider position');
		yearsAndMapScales.updateMaxYear(maxYearSlider.value);
		yearsAndMapScales.updateMinYear(minYearSlider.value);
		queryConfig.extentQueryCall();
		return;
	}

	// console.log('only the max needs to be updated')
	// // console.log(yearsAndMapScales);
	// index === 0
	// 	? yearsAndMapScales.updateMinYear(value)
	// 	: yearsAndMapScales.updateMaxYear(value);
	// queryConfig.extentQueryCall();
};

const getTheScale = (index, value) => {
	const minScaleSlider = document.querySelector('#scales .minSlider');
	const maxScaleSlider = document.querySelector('#scales .maxSlider');

	if (parseInt(minScaleSlider.value) > parseInt(maxScaleSlider.value)) {
		console.log('setting scales based on inverted slider position');
		yearsAndMapScales.updateMinScale(maxScaleSlider.value);
		yearsAndMapScales.updateMaxScale(minScaleSlider.value);
		queryConfig.extentQueryCall();
		return;
	}

	if (parseInt(minScaleSlider.value) < parseInt(maxScaleSlider.value)) {
		console.log('setting scales based on initial slider position');
		yearsAndMapScales.updateMaxScale(maxScaleSlider.value);
		yearsAndMapScales.updateMinScale(minScaleSlider.value);
		queryConfig.extentQueryCall();
		return;
	}

	// index === 0
	// 	? yearsAndMapScales.updateMinScale(value)
	// 	: yearsAndMapScales.updateMaxScale(value);

	// queryConfig.extentQueryCall();
};

const setSortOptions = (choiceValue) => {
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
