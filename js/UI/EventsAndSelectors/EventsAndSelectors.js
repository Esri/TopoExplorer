import { getCredentials, logOutTry } from '../../support/OAuth.jsv=0.03';
import {
	queryController,
	getView,
} from '../../support/queryController.jsv=0.03';
import {
	addCancelTextToAnimationLoading,
	addDownloadingNotification,
	removeCloseAnimationBtn,
	beginAnimation,
	endAnimation,
	isAnimating,
	isLoading,
} from '../Animation/animation.jsv=0.03';
import {
	setCancelledStatus,
	checkToposIncludedForDownload,
	setVideoExportName,
} from '../Animation/AnimatingLayers.jsv=0.03';
import { findAspectRatio } from '../Animation/animationOptionsUI.jsv=0.03';
import {
	displayInfoModal,
	removeInfoModal,
} from '../InfoModal/infoModalUI.jsv=0.03';
import { cancelAnimationVideo } from '../../support/animationDownload.jsv=0.03';

let account = null;
// const view = queryController.mapView;
const userIconHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.5 -2 24 24" height="30" width="30"><path d="M19.5 15h-7A6.508 6.508 0 0 0 6 21.5V29h20v-7.5a6.508 6.508 0 0 0-6.5-6.5zM25 28H7v-6.5a5.506 5.506 0 0 1 5.5-5.5h7a5.506 5.506 0 0 1 5.5 5.5zm-9-14.2A5.8 5.8 0 1 0 10.2 8a5.806 5.806 0 0 0 5.8 5.8zm0-10.633A4.833 4.833 0 1 1 11.167 8 4.839 4.839 0 0 1 16 3.167z"></path></svg>`;

const sideBar = document.querySelector('#sideBar');
const exploreList = document.querySelector('#exploreList');

const preventingMapInteractions = () => {
	const view = getView();

	view.on('drag', (event) => {
		if (isAnimating) {
			event.stopPropagation();
		}
	});

	view.on('key-down', (event) => {
		const haltedKeys = ['+', '-', 'Shift', '_', '='];
		const keyPressed = event.key;
		if (isAnimating) {
			if (haltedKeys.indexOf(keyPressed) !== -1) {
				event.stopPropagation();
			}
		}
	});

	view.on('mouse-wheel', (event) => {
		if (isAnimating) {
			event.stopPropagation();
		}
	});

	view.on('double-click', (event) => {
		if (isAnimating) {
			event.stopPropagation();
		}
	});

	view.on('double-click', ['Control'], (event) => {
		if (isAnimating) {
			event.stopPropagation();
		}
	});
};

sideBar.addEventListener(
	'mouseenter',
	(event) => {
		if (isAnimating) {
			return;
		}

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

		if (event.target.closest('.mapCard-slider')) {
			event.target
				.closest('.mapCard-slider')
				.querySelector('.tooltipText')
				.classList.add('visible');
		}

		if (event.target.closest('.infoIcon')) {
			event.preventDefault();

			if (
				event.target
					.closest('.infoIcon')
					.querySelector('.tooltipText')
					.classList.contains('visible')
			) {
				return;
			}
			event.target
				.closest('.infoIcon')
				.querySelector('.tooltipText')
				.classList.add('visible');

			event.target
				.closest('.infoIcon')
				.querySelector('.tooltipText').style.top = `${checkOverFlow(event)}px`;

			event.target
				.closest('.infoIcon')
				.querySelector('.tooltipText').style.left = `${event.clientX - 35}px`;
		}

		if (
			!event.target.closest('.infoIcon') &&
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

const checkOverFlow = (event) => {
	if (!document.elementFromPoint(event.clientY - 249, event.clientX)) {
		return event.clientY + 20;
	}
	return event.clientY - 255;
};
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
	getCredentials();
});

const logOutListener = () => {
	document.querySelector('.logOut-icon').addEventListener('click', (event) => {
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

	if (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
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

const isPinModeActive = () => {
	if (document.querySelector('.pin-mode-btn.selected')) {
		return true;
	}

	return false;
};
const scrollPosition = () => {
	return Math.abs(
		exploreList.scrollHeight - exploreList.clientHeight - exploreList.scrollTop
	);
};

exploreList.addEventListener('scroll', () => {
	if (exploreList.firstElementChild.classList.contains('notificationMessage')) {
		return;
	}

	if (scrollPosition() < 1) {
		// queryController.checkAvailableNumberOfMaps();
	}
});

document.addEventListener('click', (event) => {
	if (event.target.closest('.modalClose')) {
		removeInfoModal();
	}
});

document.querySelector('.infoModalIcon').addEventListener('click', () => {
	displayInfoModal();
});

//event listeners that work with animation process
document
	.querySelector('.icon .play-pause')
	.addEventListener('click', (event) => {
		if (event.target.closest('svg').classList.contains('play') && !isLoading) {
			beginAnimation();
		}

		if (event.target.closest('.pause') && !isLoading) {
			endAnimation();
		}
	});

document.querySelector('#viewDiv').addEventListener('click', (event) => {
	if (isAnimating && event.target.closest('.closeAnimationBtn')) {
		event.stopImmediatePropagation();
		endAnimation();
	}

	if (isAnimating && event.target.closest('.cancelAnimationBtn')) {
		// endAnimation();
		event.stopImmediatePropagation();

		removeCloseAnimationBtn(event);
		addCancelTextToAnimationLoading();
		setCancelledStatus(true);
		// endAnimation();
	}

	if (isAnimating && event.target.closest('.downloadAnimationBtn')) {
		event.stopImmediatePropagation();

		document
			.querySelector('.downloadOptionsWrapper')
			.classList.toggle('invisible');

		event.target.closest('.downloadAnimationBtn').style.display = 'none';
	}

	if (event.target.closest('.choice')) {
		event.stopImmediatePropagation();

		const videoName = document.getElementById('animation-title').value
			? document.getElementById('animation-title').value
			: 'Topo Map Explorer';

		checkToposIncludedForDownload();
		addDownloadingNotification();

		setVideoExportName(videoName);
	}

	if (event.target.closest('.mapAnimationOverlay a')) {
		event.stopImmediatePropagation();
		cancelAnimationVideo();
	}
});

//TODO: Clean-up this event listener. It's not clear what's going on.
document.querySelector('#viewDiv').addEventListener('mouseover', (event) => {
	if (event.target.closest('.choice')) {
		const orientation =
			event.target.closest('.choiceGroup').firstElementChild.innerText;

		const dimension = event.target
			.closest('.choice')
			.querySelector('a').innerText;

		// findAspectRatio(window.innerWidth - 400, window.innerHeight, orientation);
		findAspectRatio(dimension, orientation);
		document
			.querySelector('.downloadPreview div')
			.classList.remove('invisible');
	}

	if (
		!event.target.closest('.choice') &&
		document.querySelector('.downloadPreview div')
	) {
		document.querySelector('.downloadPreview div').classList.add('invisible');
	}
});

document.querySelector;
export {
	addAccountImage,
	isMobileFormat,
	preventingMapInteractions,
	isPinModeActive,
};
