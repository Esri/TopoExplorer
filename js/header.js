import { appConfig } from '../app-config.js?v=0.03';

if (appConfig.appHeaderColor) {
	document.getElementById('header').style.backgroundColor =
		appConfig.appHeaderColor;
}

document.title = appConfig.appTitleName;

if (appConfig.appHeaderName) {
	document.querySelector('.app.heading').innerHTML = appConfig.appHeaderName;
	document.querySelector('.app.heading').style =
		'text-align: center; align-content: center';
}

if (appConfig.enableInfoModal === false) {
	document.querySelector('.infoModalIcon').remove();
}

if (appConfig.headerLogoImgs) {
	appConfig.headerLogoImgs.forEach((img) => {
		if (!img.imageSrc) {
			return;
		}

		const imageElement = document.createElement('img');
		imageElement.src = img.imageSrc;
		imageElement.classList.add('logo');
		document.querySelector('.heading.logo-container').append(imageElement);
	});
}

document.getElementById('header').classList.remove('hidden');
