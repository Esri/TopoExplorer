const spinnerIcon = document.querySelector('.queryIndicator');
const mapCount = document.querySelector('.mapCount');

//creating notification text for when queries are in process.
const queryNotificationMessage = document.createElement('div');
queryNotificationMessage.classList.add('notificationMessage');
queryNotificationMessage.innerHTML = 'gathering topographic maps...';

const hideMapCount = () => {
	mapCount.classList.add('hidden');
};

const updateMapcount = (number) => {
	if (number) {
		mapCount.innerHTML = number.toLocaleString();
		mapCount.classList.remove('hidden');
	}
};

const hideSpinnerIcon = () => {
	spinnerIcon.classList.add('hidden');
	if (document.querySelector('.notificationMessage')) {
		document.querySelector('.notificationMessage').remove();
	}
};

const showSpinnerIcon = () => {
	spinnerIcon.classList.remove('hidden');
	document.querySelector('#exploreList').append(queryNotificationMessage);
};

export { hideMapCount, updateMapcount, showSpinnerIcon, hideSpinnerIcon };
