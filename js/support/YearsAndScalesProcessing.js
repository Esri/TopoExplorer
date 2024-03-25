import {
	yearsAndMapScales,
	getMinYear,
	getMaxYear,
	getMinScale,
	getMaxScale,
} from './queryController.js?v=0.01';
import { queryController } from './queryController.js?v=0.01';
import { initDualSlider } from '../UI/DualSlider/DualSlider.js?v=0.01';
import { sortChoice } from '../UI/Sort/Sort.js?v=0.01';

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

const getMinMaxyears = Promise.all([getMinYear, getMaxYear]);
const getMinMaxScales = Promise.all([getMinScale, getMaxScale]);

const minMaxYears = getMinMaxyears;
const minMaxScales = getMinMaxScales;

const getTheYear = (index, value) => {
	const minYearSlider = document.querySelector('#years .minSlider');
	const maxYearSlider = document.querySelector('#years .maxSlider');

	if (parseInt(minYearSlider.value) > parseInt(maxYearSlider.value)) {
		yearsAndMapScales.updateMinYear(maxYearSlider.value);
		yearsAndMapScales.updateMaxYear(minYearSlider.value);
		queryController.extentQueryCall();
		return;
	}

	if (parseInt(minYearSlider.value) <= parseInt(maxYearSlider.value)) {
		yearsAndMapScales.updateMaxYear(maxYearSlider.value);
		yearsAndMapScales.updateMinYear(minYearSlider.value);
		queryController.extentQueryCall();
		return;
	}
};

const getTheScale = (index, value) => {
	const minScaleSlider = document.querySelector('#scales .minSlider');
	const maxScaleSlider = document.querySelector('#scales .maxSlider');

	if (parseInt(minScaleSlider.value) > parseInt(maxScaleSlider.value)) {
		yearsAndMapScales.updateMinScale(maxScaleSlider.value);
		yearsAndMapScales.updateMaxScale(minScaleSlider.value);
		queryController.extentQueryCall();
		return;
	}

	if (parseInt(minScaleSlider.value) <= parseInt(maxScaleSlider.value)) {
		yearsAndMapScales.updateMaxScale(maxScaleSlider.value);
		yearsAndMapScales.updateMinScale(minScaleSlider.value);
		queryController.extentQueryCall();
		return;
	}
};

const setSortOptions = (choiceValue) => {
	queryController.setSortChoice(choiceValue);
	queryController.extentQueryCall();
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
