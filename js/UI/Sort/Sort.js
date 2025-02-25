/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const sortBtn = document.querySelector('.sortOrder');
const sortOptions = sortBtn.querySelector('.sortOptions');
const sortChoices = sortOptions.querySelectorAll('a');

const initSortChoice = (setSortChoice, filterList, appConfig) => {
	establishSortOptions(appConfig);

	sortBtn.addEventListener('click', (event) => {
		document.querySelectorAll('.sliderElement').forEach((filterSlider) => {
			!filterSlider.classList.contains('invisible')
				? filterSlider.classList.add('invisible')
				: null;
		});

		sortOptions.classList.contains('invisible')
			? sortOptions.classList.remove('invisible')
			: sortOptions.classList.add('invisible');
	});

	// this forEach calls and sets the default sort order for the list of map cards.
	sortChoices.forEach((choice) => {
		if (choice.classList.contains('bold')) {
			const choiceValue = choice.attributes.value.value;
			setSortChoice(choiceValue);
		}
	});

	//selecting a new sort option
	sortChoices.forEach((choice) => {
		choice.addEventListener('click', (event) => {
			event.stopPropagation();

			sortChoices.forEach((string) => {
				string.classList.remove('bold');
			});

			event.target.classList.add('bold');

			setSortChoice(event.target.attributes.value.value);
			filterList();
		});
	});
};

const establishSortOptions = (appConfig) => {
	if (!appConfig.outfields.requiredFields.mapName) {
		const options = sortOptions.getElementsByClassName('nameSortOption');

		const choiceArray = Array.from(options);

		choiceArray.forEach((choice) => choice.remove());
	}
	if (!appConfig.outfields.requiredFields.dateCurrent) {
		const options = sortOptions.getElementsByClassName('yearSortOption');

		const choiceArray = Array.from(options);

		choiceArray.forEach((choice) => choice.remove());
	}
	if (!appConfig.outfields.requiredFields.mapScale) {
		const options = sortOptions.getElementsByClassName('scaleSortOption');

		const choiceArray = Array.from(options);

		choiceArray.forEach((choice) => choice.remove());
	}
};

// if the user clicks anywhere outside of the sort-choice element, close the sort-choice element
document.addEventListener('click', (event) => {
	if (!event.target.closest('.sortOrder')) {
		!sortOptions.classList.contains('invisible')
			? sortOptions.classList.add('invisible')
			: null;
		return;
	}
});
export { initSortChoice };
