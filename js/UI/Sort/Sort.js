const sortBtn = document.querySelector('.sortOrder');
const sortOptions = sortBtn.querySelector('.sortOptions');
const sortChoices = sortOptions.querySelectorAll('a');

const sortChoice = (callBack) => {
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

	//selecting a new sort option
	sortChoices.forEach((choice) => {
		choice.addEventListener('click', (event) => {
			event.stopPropagation();

			sortChoices.forEach((string) => {
				string.classList.remove('bold');
			});

			event.target.classList.add('bold');

			callBack(event.target.attributes.value.value);
		});
	});
};

// if the user clicks anywhere ouside of the sort-choice element, close the sort-choice element
document.addEventListener('click', (event) => {
	if (!event.target.closest('.sortOrder')) {
		!sortOptions.classList.contains('invisible')
			? sortOptions.classList.add('invisible')
			: null;
		return;
	}
});
export { sortChoice };
