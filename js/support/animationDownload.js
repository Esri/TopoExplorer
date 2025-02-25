//NOTE: these functions in this file are used to encode the images used in the animation into an mp4.
//this encoding will only work for 'esri' related project.
import {
	addDownloadCancel,
	removeDownloadIndicator,
	addAnimationCloseBtn,
	addDownloadErrorMessage,
	addDownloadAbortMessage,
	addDownloadCancelMessage,
	endAnimation,
} from '../UI/Animation/animation.js?v=0.03';

import { revokeBasemapBlobURL } from '../UI/Animation/AnimationControl.js?v=0.03';

const images2VideoClient =
	window['@vannizhang/images-to-video-converter-client'];

let controller = null;

const cancelAnimationVideo = () => {
	controller.abort();
};

const createAnimationVideo = (params) => {
	controller = params.abortController;
	addDownloadCancel();

	images2VideoClient
		.convertImages2Video(params)
		.then((response) => {
			const videoURL = URL.createObjectURL(response.fileContent);

			downloadVideo(params, videoURL, response.filename);

			//this commented out section is intended for debugging practices
			// if (window.location.host !== 'livingatlas.arcgis.com') {
			// 	// saveDownloadComponents(params, videoURL, response);
			// }
		})
		.catch((error) => {
			if (!error.message.includes('aborted')) {
				const errorMessage = error.message;
				addDownloadErrorMessage(errorMessage);
			}

			setTimeout(() => {
				revokeBasemapBlobURL();
				revokeCompositeBlobURLs(params.data);
				endAnimation();
			}, 4000);
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
