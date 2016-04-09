////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Use like this: 
// socialSharing.openWindow(socialSharing.createTwitterShareLink('My Tweet is great.'));

// Sample sharing links reference: http://www.sharelinkgenerator.com/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.socialSharing = (function($) {

	return {
		openWindow: openWindow,
		createFBFeedDialogLink: createFBFeedDialogLink,
		createFBSharerLink: createFBSharerLink,
		createTwitterShareLink: createTwitterShareLink,
		createLinkedInShareLink: createLinkedInShareLink,
		createGPlusShareLink: createGPlusShareLink,
		createPinterestPinLink: createPinterestPinLink
	};

	/**
	 * openWindow - open a popup window to load the sharing link in
	 * @param  {string} url - URL to open
	 * @param  {number} width - width of the window (optional)
	 * @param  {number} height - height of the window (optional)
	 * @param  {string} winName - window name (optional)
	 * @return {WindowObjectReference} - Reference to the newly created window or null if failed
	 */
	function openWindow(url, width, height, winName) {
		width = width || 580;
		height = height || 400;
		winName = winName || 'shareDialog';

		return window.open(url, winName, 'toolbar=0,status=0,width=' + width + ',height=' + height);
	}

	/**
	 * createFBFeedDialogLink - create a URL for a custom FB feed dialog
	 * @param  {object} fbVars - custom object containing the Facebook vars to fill in this link
	 * @return {string} returns URL string
	 *
	 * Notes: 
	 * 		Reference for the Feed Dialog:
	 * 		http://developers.facebook.com/docs/reference/dialogs/feed/
	 */
	function createFBFeedDialogLink(fbVars) {
		var url = 'http://www.facebook.com/dialog/feed?app_id=' + fbVars.fbAppId + 
				'&link=' + fbVars.fbShareUrl + 
				(fbVars.fbSharePicPath !== '' ? '&picture=' + fbVars.fbSharePicPath : '') + 
				(fbVars.nameLine !== '' ? '&name=' + encodeURIComponent(fbVars.nameLine) : '') + 
				(fbVars.capt !== '' ? '&caption=' + encodeURIComponent(fbVars.capt) : '') + 
				(fbVars.desc !== '' ? '&description=' + encodeURIComponent(fbVars.desc) : '') + 
				'&redirect_uri=' + fbVars.baseURL + 'PopupClose.html' +
				'&display=popup';

		return url;
	}

	/**
	 * createFBSharerLink - create a URL for FB sharer dialog
	 * @param  {string} shareURL - url to share
	 * @return {string} returns URL string
	 */
	function createFBSharerLink(shareURL) {
		var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareURL);

		return url;
	}

	/**
	 * createTwitterShareLink - create a URL for Twitter share dialog
	 * @param  {string} shareText - text to share on Twitter
	 * @return {string} returns URL string
	 */
	function createTwitterShareLink(shareText) {
		var url = 'https://twitter.com/home?status=' + encodeURIComponent(shareText);

		return url;
	}

	/**
	 * createLinkedInShareLink - create a URL for LinkedIn share dialog
	 * @param  {object} LIVars - custom object containing the LinkedIn vars to fill in this link
	 * @return {string} returns URL string
	 */
	function createLinkedInShareLink(LIVars) {
		var url = 'https://www.linkedin.com/shareArticle?mini=true&' + 
				'url=' + encodeURIComponent(LIVars.shareUrl) + 
				'&title=' + encodeURIComponent(LIVars.shareTitle) + 
				(LIVars.shareSummary !== '' ? '&summary=' + encodeURIComponent(LIVars.shareSummary) : '') + 
				(LIVars.shareSource !== '' ? '&source=' + encodeURIComponent(LIVars.shareSource) : '');

		return url;
	}

	/**
	 * createGPlusShareLink - create a URL for Google Plus share dialog
	 * @param  {string} shareURL - url to share
	 * @return {string} returns URL string
	 */
	function createGPlusShareLink(shareURL) {
		var url = 'https://plus.google.com/share?url=' + encodeURIComponent(shareUrl);  

		return url;
	}

	/**
	 * createPinterestPinLink - create a URL for Pinterest Pin Dialog
	 * @param  {object} pinVars - custom object containing the Pinterest vars to fill in this link
	 * @return {string} returns URL string
	 */
	function createPinterestPinLink(pinVars) {
		var url = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(pinVars.shareUrl) + 
		'&media=' + encodeURIComponent(pinVars.shareMedia) + 
		(pinVars.shareDescription !== '' ? '&description=' + encodeURIComponent(pinVars.shareDescription) : '');

		return url;
	}
}(jQuery));

//////////////////////////////////////////////////////////////////////
// Additional information for the Social Sharing module
//////////////////////////////////////////////////////////////////////

/* Facebook Share requires a Facebook Application ID and uses an fbVars object that can be created from server code or JavaScript */
/* fbVars oject looks like:

var fbVars = {
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

/* Pinterest Pin Share uses an pinVars object that can be created from server code or JavaScript */
/* pinVars oject looks like:

var pinVars = {
	shareUrl: '', // image URL
	shareMedia: '', // image source
	shareDescription: '' // share description is optional
}
*/