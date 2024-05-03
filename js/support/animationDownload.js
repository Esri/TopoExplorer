import {
	addDownloadCancel,
	removeDownloadIndicator,
	addAnimationCloseBtn,
	addDownloadErrorMessage,
} from '../UI/Animation/animation.js?v=0.01';

import { revokeBasemapBlobURL } from '../UI/Animation/AnimatingLayers.js?v=0.01';

const images2VideoClient =
	window['@vannizhang/images-to-video-converter-client'];

let controller = null;

const cancelAnimationVideo = () => {
	controller.abort();
	revertAnimationUIToPreview();
};

const createAnimationVideo = (params) => {
	console.log(params);
	controller = params.abortController;
	addDownloadCancel();

	images2VideoClient
		.convertImages2Video(params)
		.then((response) => {
			const videoURL = URL.createObjectURL(response.fileContent);
			console.log(response);
			console.log(videoURL);

			downloadVideo(params, videoURL, response.filename);

			//this commented out section is intended for debugging practices
			// if (window.location.host !== 'livingatlas.arcgis.com') {
			// 	// saveDownloadComponents(params, videoURL, response);
			// }
		})
		.catch((error) => {
			if (error.message.includes('canceled')) {
				return;
			}
			addDownloadErrorMessage();
			setTimeout(() => {
				revokeBasemapBlobURL();
				revokeCompositeBlobURLs(params.data);
				revertAnimationUIToPreview();
			}, 2000);
			console.log(error);
		});
};

const revokeBlobDownloadURL = (downloadURL) => {
	URL.revokeObjectURL(downloadURL);
};

const revokeCompositeBlobURLs = (compositeData) => {
	compositeData.map((compositeImage) => {
		URL.revokeObjectURL(compositeImage.image.src);
	});
};

const downloadVideo = (params, url, filename) => {
	const anchor = document.createElement('a');

	anchor.href = url;
	anchor.download = `${filename}`;

	anchor.click();
	anchor.remove();
	revokeBlobDownloadURL(url);
	revokeBasemapBlobURL();
	revokeCompositeBlobURLs(params.data);
	revertAnimationUIToPreview();
};

const revertAnimationUIToPreview = () => {
	removeDownloadIndicator();
	addAnimationCloseBtn();
};

//Intended to be used as a debugging function. Downloads a file containing the download information to the user.
const saveDownloadComponents = (params, videoURL, response) => {
	const imgSources = params.data.map((imgFile) => {
		return [imgFile.imageInfo, imgFile.image.src];
	});

	const components = {
		downloadParams: params,
		animationFrames: imgSources,
		animationServiceResponse: response,
		animationMP4: videoURL,
	};

	const downloadComponents = encodeURIComponent(JSON.stringify(components));
	const componentsURL = `data:text/json;charset=utf-8, ${downloadComponents}`;

	const anchor = document.createElement('a');

	anchor.href = componentsURL;
	anchor.download = `download_components.json`;

	anchor.click();
	anchor.remove();
};

export { createAnimationVideo, cancelAnimationVideo };
