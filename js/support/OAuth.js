import { config } from '../../app-config.js?v=0.01';

const appId = config.environment.appId;

let userCredentials;
let esriAccountId;
let info;
let portal;

const logOutTry = () => {
	esriAccountId.destroyCredentials();
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
		}
		resolve(userCredentials);
	});
};

const authorization = async () => {
	return new Promise((resolve, reject) => {
		require([
			'esri/portal/Portal',
			'esri/identity/OAuthInfo',
			'esri/identity/IdentityManager',
		], function (Portal, OAuthInfo, esriId) {
			esriAccountId = esriId;

			info = new OAuthInfo({
				appId: appId,
				preserveUrlHash: true,
				popup: false,
			});

			esriId.registerOAuthInfos([info]);

			esriAccountId
				.checkSignInStatus(info.portalUrl + '/sharing', appId)
				.then((credential) => {
					userCredentials = credential;
					handleSignedIn(credential);
				})
				.catch(() => {
					resolve();
				});

			const handleSignedIn = (credential) => {
				portal = new Portal();

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
					});
			};
		});
	});
};

export { authorization, logOutTry, getCredentials };
