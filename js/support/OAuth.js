const appId = 'KZAK9DITO38X2SXM';

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
			});

			console.log('OAuthInfo', info);
			esriId.registerOAuthInfos([info]);

			esriId
				.checkSignInStatus(info.portalUrl + '/sharing')
				.then((credential) => {
					handleSignedIn(credential);
				})
				.catch(() => {
					console.log('user is not signed in');
					resolve();
				});

			const getCredentials = () => {
				esriId.getCredential(info.portalUrl + '/sharing');
			};

			const logOut = () => {
				esriId.destroyCredentials();
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
