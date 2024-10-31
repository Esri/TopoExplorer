import { configurables } from '../app-config.js?v=0.03';

if (configurables.appHeaderColor) {
	document.getElementById('header').style.backgroundColor =
		configurables.appHeaderColor;
}

//what about the spacing in the header section? this could be an issue?
document.title = configurables.appTitleName;

if (configurables.appHeaderName) {
	document.querySelector('.app.heading').innerHTML =
		configurables.appHeaderName;
	document.querySelector('.app.heading').style =
		'text-align: center; align-content: center';
}

if (configurables.enableInfoModal === false) {
	document.querySelector('.infoModalIcon').remove();
}

if (configurables.headerLogoImgs) {
	configurables.headerLogoImgs.forEach((img) => {
		if (!img.imageSrc) {
			return;
		}
		console.log(img);
		const imageElement = document.createElement('img');
		imageElement.src = img.imageSrc;
		imageElement.classList.add('logo');
		document.querySelector('.heading.logo-container').append(imageElement);
	});
}

document.getElementById('header').classList.remove('hidden');
