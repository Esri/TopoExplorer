import { authorization, logOutTry } from '../../support/OAuth.js?v=0.01';

let account = null;
const userIconHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.5 -2 24 24" height="30" width="30"><path d="M19.5 15h-7A6.508 6.508 0 0 0 6 21.5V29h20v-7.5a6.508 6.508 0 0 0-6.5-6.5zM25 28H7v-6.5a5.506 5.506 0 0 1 5.5-5.5h7a5.506 5.506 0 0 1 5.5 5.5zm-9-14.2A5.8 5.8 0 1 0 10.2 8a5.806 5.806 0 0 0 5.8 5.8zm0-10.633A4.833 4.833 0 1 1 11.167 8 4.839 4.839 0 0 1 16 3.167z"></path></svg>`;

const sideBar = document.querySelector('#sideBar');
const exploreList = document.querySelector('#exploreList');

sideBar.addEventListener(
	'mouseenter',
	(event) => {
		//when the mouse enters the iconWrapper, remove the visibility from all tooltips, add visibility to the specific tooltip.
		if (event.target.closest('.iconWrapper')) {
			document.querySelectorAll('.tooltipText').forEach((tooltip) => {
				if (tooltip.classList.contains('visible')) {
					tooltip.classList.remove('visible');
				}
			});

			if (event.target.closest('.unpinned.svgContainer.pinned')) {
				event.target
					.closest('.iconWrapper')
					.querySelector('.tooltipText.unpinMap')
					.classList.add('visible');
				return;
			}

			if (event.target.closest('.svgContainer.transparency')) {
				event.target
					.closest('.iconWrapper')
					.querySelector('.tooltipText')
					.classList.add('visible');
				return;
			}

			if (event.target.closest('.unpinned.svgContainer')) {
				event.target
					.closest('.iconWrapper')
					.querySelector('.tooltipText.pinMap')
					.classList.add('visible');
				return;
			}

			event.target
				.closest('.iconWrapper')
				.querySelector('.tooltipText')
				.classList.add('visible');
		}

		//if the mouse enters something other than the iconWrapper, remove visibility on all tooltips
		if (
			!event.target.closest('.iconWrapper') ||
			event.target.classList.contains('tooltipText')
		) {
			document.querySelectorAll('.tooltipText').forEach((tooltip) => {
				if (tooltip.classList.contains('visible')) {
					tooltip.classList.remove('visible');
				}
			});
		}
	},
	true
);

//close all filter elements during the scroll of the explorelist
exploreList.addEventListener('scroll', () => {
	const sortWindow = document.querySelector('.sortOptions');

	document.querySelectorAll(`.sliderElement`).forEach((slideContainer) => {
		!slideContainer.classList.contains('invisible')
			? slideContainer.classList.add('invisible')
			: null;
	});

	if (!sortWindow.classList.contains('invisible')) {
		sortWindow.classList.add('invisible');
	}
});

sideBar.addEventListener(
	'mouseleave',
	(event) => {
		if (!event.target.closest('.iconWrapper')) {
			document.querySelectorAll('.tooltipText').forEach((tooltip) => {
				if (tooltip.classList.contains('visible')) {
					tooltip.classList.remove('visible');
				}
			});
			return;
		}
	},
	true
);

const addAccountImage = (accountInfo) => {
	account = accountInfo;
	const profileImg = document.createElement('img');
	if (accountInfo.img) {
		profileImg.setAttribute('src', `${accountInfo.img}`);
		document.querySelector('#user-icon .profile svg').remove();
		document.querySelector('#user-icon .profile').append(profileImg);
	}

	addLogOutElement();
};

const addLogOutElement = () => {
	const xIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 19 19">
      <path d="M8.5 1.2a7.3 7.3 0 1 0 7.3 7.3 7.3 7.3 0 0 0-7.3-7.3zm3.818 10.128l-.99.99L8.5 9.49l-2.828 2.828-.99-.99L7.51 8.5 4.682 5.672l.99-.99L8.5 7.51l2.828-2.828.99.99L9.49 8.5z"></path>
    </svg>`;
	const logOutIMG = document.createElement('div');
	logOutIMG.classList.add('logOut-icon');
	logOutIMG.innerHTML = xIcon;

	document.querySelector('#user-icon .profile').append(logOutIMG);
	logOutListener();
};

document.querySelector('#user-icon').addEventListener('click', () => {
	authorization.getCredentials();
});

const logOutListener = () => {
	document.querySelector('.logOut-icon').addEventListener('click', (event) => {
		// event.preventDefault();
		event.stopImmediatePropagation();
		logOutTry();
		setAnonymousUser();
	});
};

const setAnonymousUser = () => {
	document.querySelector('#user-icon .profile').innerHTML = userIconHTML;
};

const isMobileFormat = () => {
	//checking for device type. Checking if it's a mobile user.
	let istouchEnabled = false;
	let isMobileDeviceDetected = false;
	let isMobileScreenWidth = false;
	let isReadyForMobileFormat = false;

	if (navigator.maxTouchPoints > 0) {
		istouchEnabled = true;
	}

	// if (window.innerWidth <= 654) {
	// 	isMobileScreenWidth = true;
	// }

	if (
		/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		)
	) {
		isMobileDeviceDetected = true;
	}

	if (istouchEnabled && isMobileDeviceDetected) {
		isReadyForMobileFormat = true;
	}

	return isReadyForMobileFormat;
};

// const setMobileFormat = async () => {
// 	if (!isMobileFormat) {
// 		return;
// 	}

// 	initSideBar();
// 	initMobileHeader();
// 	headerSearchInfo();
// };

export { addAccountImage, isMobileFormat };
