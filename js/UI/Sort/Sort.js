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

export { sortChoice };
