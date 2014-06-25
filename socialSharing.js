////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Use like this: 
// socialSharing.openWindow(socialSharing.createTwitterShareLink('My Tweet is great.'));

// Sample sharing links reference: http://www.sharelinkgenerator.com/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

;(function($, undefined) {
	window.socialSharing = {
		openWindow: function(url, w, h) {  // w/h are optional
			w = w || 580;
			h = h || 400;
			window.open(url, 'shareDialog', 'toolbar=0,status=0,width=' + w + ',height=' + h);
			return false;
		},
		createFBFeedDialogLink: function(FBVars) {
			// Reference for the Feed Dialog:
			// http://developers.facebook.com/docs/reference/dialogs/feed/
			var url = 'http://www.facebook.com/dialog/feed?app_id=' + FBVars.fbAppId + 
					'&link=' + FBVars.fbShareUrl + 
					(FBVars.fbSharePicPath !== '' ? '&picture=' + FBVars.fbSharePicPath : '') + 
					(FBVars.nameLine !== '' ? '&name=' + encodeURIComponent(FBVars.nameLine) : '') + 
					(FBVars.capt !== '' ? '&caption=' + encodeURIComponent(FBVars.capt) : '') + 
					(FBVars.desc !== '' ? '&description=' + encodeURIComponent(FBVars.desc) : '') + 
					'&redirect_uri=' + FBVars.baseURL + 'PopupClose.html' +
					'&display=popup';

			return url;
		},
		createFBSharerLink: function (shareURL) {
			// Reference for the Facebook Sharer Share:
			// 
			var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareURL);

			return url;
		},
		createTwitterShareLink: function(shareText) {
			// Reference for the Twitter Share:
			// 
			var url = 'https://twitter.com/home?status=' + encodeURIComponent(shareText);

			return url;
		},
		createLinkedInShareLink: function(LIVars) {
			// Reference for the LinkedIn Share:
			// 
			var url = 'https://www.linkedin.com/shareArticle?mini=true&' + 
					'url=' + encodeURIComponent(LIVars.shareUrl) + 
					'&title=' + encodeURIComponent(LIVars.shareTitle) + 
					(LIVars.shareSummary !== '' ? '&summary=' + encodeURIComponent(LIVars.shareSummary) : '') + 
					(LIVars.shareSource !== '' ? '&source=' + encodeURIComponent(LIVars.shareSource) : '');

			return url;
		},
		createGPlusShareLink: function(shareURL) {
			// Reference for the Google+ share
			//

			var url = 'https://plus.google.com/share?url=' + encodeURIComponent(shareUrl);  

			return url;
		},
		createPinterestPinLink: function(PinVars) {
			// Reference for the Pinterest Pin share
			//

			var url = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(PinVars.shareUrl) + 
			'&media=' + encodeURIComponent(PinVars.shareMedia) + 
			(PinVars.shareDescription !== '' ? '&description=' + encodeURIComponent(PinVars.shareDescription) : '');

			return url;
		}
	};
})(jQuery);


/* Facebook Share requires a Facebook Application ID and uses an FBVars object that can be created from server code or JavaScript */
/* FBVars oject looks like:

var FBVars = {
	fbAppId: '',  // Application ID
	fbShareUrl:'',  // URL to Share
	fbSharePicPath:'', // Picture URL if you want to customize the image
	nameLine:'', // The main heading of the share text
	capt:'', // the caption that will show under the main heading
	desc:'', // the description text that will show under the heading and caption
	baseURL:'' // the base URL to redirect to after the share, this must match the URL in the Facebook Application 
}
*/
/* Since generally used in a popup window, the popupClose.html file is a simple html file that includes a script to close the popup:

<!DOCTYPE html>
<html>
<head>
    <title>Close Popup Window</title>
</head>
<body>
    <script>
		window.close();
	</script>
</body>
</html>

*/

/* LinkedIn Share uses an LIVars object that can be created from server code or JavaScript */
/* LIVars oject looks like:

var LIVars = {
	shareUrl: '', // share URL
	shareTitle: '', // share title
	shareSummary: '', // summary is optional
	shareSource: '' // source is optional
}
*/

/* Pinterest Pin Share uses an PinVars object that can be created from server code or JavaScript */
/* PinVars oject looks like:

var PinVars = {
	shareUrl: '', // image URL
	shareMedia: '', // image source
	shareDescription: '' // share description is optional
}
*/