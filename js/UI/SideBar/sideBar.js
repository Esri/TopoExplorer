import { isMobileFormat } from '../EventsAndSelectors/EventsAndSelectors.js?v=0.03';

const sideBar = document.querySelector('#sideBar');
const exploreList = document.querySelector('#exploreList');
let touchstartX;
let touchendX;

const toggleSideBar = () => {
	document.querySelector('aside').classList.toggle('original-x');
	document.querySelector('aside').classList.toggle('slide-x');
};

const handleSwipe = (event) => {
	if (event.target.closest('.filter')) {
		return;
	}

	if (Math.abs(touchendX - touchstartX) > 50) {
		toggleSideBar();
	}
};

const initSideBar = () => {
	sideBar.previousElementSibling.classList.add('invisible');
	sideBar.querySelector('.for-desktop').classList.remove('display-content');
	sideBar.querySelector('.for-desktop').classList.add('invisible');
	sideBar.style.width = '100%';
	document.querySelector('aside').classList.add('fixed-position');

	//handling the mobile eventListeners
	//When a map is 'tapped' in mobile, close the sideBar to reveal the map.
	document.addEventListener('click', (event) => {
		if (!isMobileFormat()) {
			return;
		}
		if (
			!event.target.closest('aside') &&
			!document.querySelector('aside').classList.contains('slide-x')
		) {
			toggleSideBar();
		}
	});

	exploreList.addEventListener('click', (event) => {
		if (!isMobileFormat()) {
			return;
		}
		if (!event.target.closest('.map-list-item')) {
			return;
		}
		toggleSideBar();
	});

	document
		.querySelector('.explorer-mode-btn')
		.addEventListener('click', (event) => {
			toggleSideBar();
		});

	sideBar.addEventListener(
		'touchstart',
		(event) => {
			touchstartX = event.changedTouches[0].screenX;
		},
		false
	);

	sideBar.addEventListener(
		'touchend',
		(event) => {
			touchendX = event.changedTouches[0].screenX;
			handleSwipe(event);
		},
		false
	);
};

export { initSideBar, toggleSideBar };
