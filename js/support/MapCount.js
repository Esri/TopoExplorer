import { isMobileFormat } from '../UI/EventsAndSelectors/EventsAndSelectors.js?v=0.01';

const spinnerIcon = document.querySelector('.queryIndicator');
const mapCount = document.querySelector('.mapCount');

//creating notification text for when queries are in process.
const queryNotificationMessage = document.createElement('div');
queryNotificationMessage.classList.add('notificationMessage');
queryNotificationMessage.innerHTML = 'gathering topographic maps...';

const hideMapCount = () => {
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document.querySelector('.mobile-header .mapCount').classList.add('hidden');
	}

	mapCount.classList.add('hidden');
};

const updateMapCount = (number) => {
	// if (!number) {
	// 	console.log('0 is false genius');
	// 	return;
	// }
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document.querySelector('.mobile-header .mapCount').innerHTML =
			number.toLocaleString();
		document
			.querySelector('.mobile-header .mapCount')
			.classList.remove('hidden');
	}

	mapCount.innerHTML = number.toLocaleString();
	mapCount.classList.remove('hidden');
};

const hideSpinnerIcon = () => {
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document
			.querySelector('.mobile-header .queryIndicator')
			.classList.add('hidden');
		document.querySelector('.notificationMessage').remove();
	}

	spinnerIcon.classList.add('hidden');
	if (document.querySelector('.notificationMessage')) {
		document.querySelector('.notificationMessage').remove();
	}
};

const showSpinnerIcon = () => {
	if (isMobileFormat() && document.querySelector('.mobile-header .mapCount')) {
		document
			.querySelector('.mobile-header .queryIndicator')
			.classList.remove('hidden');

		document.querySelector('#exploreList').append(queryNotificationMessage);
	}

	spinnerIcon.classList.remove('hidden');
	document.querySelector('#exploreList').append(queryNotificationMessage);
};

export { hideMapCount, updateMapCount, showSpinnerIcon, hideSpinnerIcon };
