import { configurables } from '../../app-config.js?v=0.03';

const appId = configurables.appId;

let userCredentials;
let esriAccountId;
let info;
let portal;

const logOutTry = () => {
	esriAccountId.destroyCredentials();
	userCredentials = null;
	window.location.reload();
};

const getCredentials = () => {
	return new Promise((resolve, reject) => {
		if (!userCredentials) {
			esriAccountId
				.getCredential(info.portalUrl + '/sharing')
				.then((credential) => {
					userCredentials = credential;
					resolve(credential);
				});
		} else {
			resolve(userCredentials);
		}
	});
};

const authorization = async () => {
	const portalUrl = 'https://www.arcgis.com';

	return new Promise((resolve, reject) => {
		require([
			'esri/portal/Portal',
			'esri/identity/OAuthInfo',
			'esri/identity/IdentityManager',
		], function (Portal, OAuthInfo, esriId) {
			esriAccountId = esriId;

			if (configurables.enablePortalAuthentication === false) {
				document.getElementById('user-icon').remove();
				document
					.querySelector('.icon.save-all')
					.closest('.iconWrapper')
					.remove();

				document.querySelector(
					'.pinned-mode-options .pinned-mode-sub-section'
				).style.justifyContent = 'space-around';

				resolve(false);
			}

			info = new OAuthInfo({
				portalUrl: portalUrl,
				appId,
				preserveUrlHash: true,
				popup: false,
				popupCallbackUrl: 'http://localhost/topoExplorer/',
			});

			esriAccountId.registerOAuthInfos([info]);

			esriAccountId
				.checkSignInStatus(`${portalUrl}/sharing`, appId)
				.then((credential) => {
					userCredentials = credential;
					handleSignedIn(credential);
				})
				.catch(() => {
					resolve();
				});

			const handleSignedIn = (credential) => {
				portal = new Portal(portalUrl);

				portal.authMode = 'immediate';

				portal
					.load()
					.then(() => {
						const results = {
							name: portal.user.fullName,
							userName: portal.user.username,
							url: portal.url,
							urlKey: portal.urlKey,
							customUrl: portal.customBaseUrl,
							img: portal.user.thumbnailUrl,
							thumbnail: portal.user.thumbnail,
							restUrl: portal.restUrl,
							token: credential.token,
						};

						resolve(results);
					})
					.catch(() => {
						console.log('error in authorization', error);
						reject(error);
					});
			};
		});
	});
};

export { authorization, logOutTry, getCredentials };
