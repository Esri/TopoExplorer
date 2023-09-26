const appId = 'KZAK9DITO38X2SXM';

let userCredentials;

const logOutTry = () => {
	require(['esri/identity/IdentityManager'], function (esriId) {
		esriId.destroyCredentials();
		window.location.reload();
	});
};

const authorization = async () => {
	return new Promise((resolve, reject) => {
		require([
			'esri/portal/Portal',
			'esri/identity/OAuthInfo',
			'esri/identity/IdentityManager',
		], function (Portal, OAuthInfo, esriId) {
			// console.log('hashparams from OAuth', location.hash);
			// const hash = window.location.hash;
			const info = new OAuthInfo({
				appId: appId,
				preserveUrlHash: true,
				popup: false,
				// expiration: 20160,
			});

			console.log('OAuthInfo', info);
			esriId.registerOAuthInfos([info]);

			esriId
				.checkSignInStatus(info.portalUrl + '/sharing')
				.then((credential) => {
					console.log('just checked sign in status', credential);
					userCredentials = credential;
					handleSignedIn(credential);
				})
				.catch(() => {
					console.log('user is not signed in');
					resolve();
				});

			const getCredentials = () => {
				return new Promise((resolve, reject) => {
					const currentTime = Date.now();
					console.log(userCredentials.expires);
					console.log(currentTime);
					console.log(userCredentials.expires - currentTime);
					console.log(userCredentials.expires - currentTime <= 0);
					if (userCredentials.expires - currentTime <= 0) {
						esriId
							.getCredential(info.portalUrl + '/sharing')
							.then((credential) => {
								// 	// if (credential.expires - currentTime < 300000) {
								// 	console.log(credential.expires);
								// 	console.log(currentTime);
								// 	console.log(credential.expires - currentTime);
								// 	console.log(credential.expires - currentTime <= 0);
								// 	if (credential.expires - currentTime <= 0) {
								// 		console.log('logging in');
								// 		handleSignedIn(credential);
								// 	}
								// });
								resolve(credential);
							});
					}

					resolve(userCredentials);
				});
			};

			const handleSignedIn = (credential) => {
				const portal = new Portal();
				console.log(credential);

				portal
					.load()
					.then(() => {
						console.log(portal);
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

			authorization.getCredentials = getCredentials;
			// authorization.logOut = logOut;
		});
	});
};

//NOTE: I need to add log-out.
export { authorization, logOutTry };
