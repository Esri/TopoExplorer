const sortBtn = document.querySelector('.sortOrder');
const sortOptions = sortBtn.querySelector('.sortOptions');
const sortChoices = sortOptions.querySelectorAll('a');

const initSortChoice = (setSortChoice, filterList) => {
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

	//this forEach calls and sets the default sort order for the list of map cards.
	const defaultChoice = sortChoices.forEach((choice) => {
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
