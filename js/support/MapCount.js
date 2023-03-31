const spinnerIcon = document.querySelector('.queryIndicator');
const mapCount = document.querySelector('.mapCount');

const hideMapCount = () => {
	mapCount.classList.add('hidden');
};

const updateMapcount = (number) => {
	mapCount.innerHTML = number.toLocaleString();
	mapCount.classList.remove('hidden');
};

const hideSpinnerIcon = () => {
	spinnerIcon.classList.add('hidden');
};

const showSpinnerIcon = () => {
	spinnerIcon.classList.remove('hidden');
};

export { hideMapCount, updateMapcount, showSpinnerIcon, hideSpinnerIcon };
