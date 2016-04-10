ohfad.utils.browserStorage = (function () {
	'use strict';

	/**
	 * Defaults for setting cookies when the browser falls back
	 */
	var _options = {
		domain: '',
		expires: 30*24*60*60*1000,
		path: '/',
		session: false
	};
	var _storage = window.localStorage;

	setOptions();

	return {
		hasStorageSupport: hasStorageSupport,
		set: setValue,
		get: getValue,
		setObject: setObjectValue,
		getObject: getObjectValue,
		remove: removeValue,
		config: setOptions
	};

	/**
	 * setOptions - set options if different than defaults
	 * @param {Object} [config] Config object to set things like domain or cookie duration
	 */
	function setOptions(config) {
		if (config) {
			_options.domain = config.domain || _options.domain;
			_options.expires = config.expires || _options.expires;
			_options.path = config.path || _options.path;
			_options.session = config.session || _options.session;

			// setup which type of storage to use
			_storage = _options.session ? window.sessionStorage : window.localStorage;
		}
	}

	/**
	 * hasStorageSupport - Whether the current browser supports local/session storage as a way of storing data
	 *
	 * @param {String} storageType The storage type to check
	 * @returns {boolean}
	 */
	function hasStorageSupport(storageType) {
		var _storageType = _options.session ? 'sessionStorage' : 'localStorage';
		var _oldStorage = _storage;
		var _hasSupport = false;

		if (_storageTypeExists(storageType)) {
			_storageType = storageType + 'Storage';
			_storage = window[_storageType];
		}

		try {
			_storage.test = 2;
			_storage.setItem('test', 2);
			_storage.removeItem('test');
			_hasSupport = _storageType in window && window[_storageType] !== null;
		} catch (e) {
			_hasSupport = false;
		}

		if (_storageTypeExists(storageType)) {
			_storage = _oldStorage;
		}
		return _hasSupport;
	}

	/**
	 * _readCookie - read cookie
	 *
	 * @param {String} name The name of the property to read from this document's cookies
	 * @returns {?String} The specified cookie property's value (or null if it has not been set)
	 */
	function _readCookie(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		var c;
		var i;
		for (i = 0; i < ca.length; i++) {
			c = ca[i];
			while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
			if (c.indexOf(nameEQ) === 0) { return decodeURI(c.substring(nameEQ.length, c.length)); }
		}

		return null;
	}

	/**
	 * _writeCookie - writes a cookie
	 *
	 * @param {String} name The name of the property to set by writing to a cookie
	 * @param {String} value The value to use when setting the specified property
	 * @param {int} [days] The number of days until the storage of this item expires
	 */
	function _writeCookie(name, value, days) {
		var expiration = (function () {
			var date;
			if (days) {
				date = new Date();
				date.setTime(date.getTime() + (days*24*60*60*1000));
				return '; expires=' + date.toGMTString();
			} else {
				return _options.expiration || '';
			}
		}());
		var path = _options.path ? '; path=' + _options.path : '';
		var domain = _options.domain ? '; domain=' + _options.domain : '';

		document.cookie = name + '=' + encodeURI(value) + expiration + path + domain;
	}

	/**
	 * setValue - set a value to storage or cookie
	 *
	 * @param {String} name The name of the property to set
	 * @param {String} value The value to use when setting the specified property
	 * @param {int} days The number of days until the storage of this item expires (if storage of the provided item must fallback to using cookies)
	 * @param {boolean} forceCookie Whether or not to force the use of cookies
	 * @param {String} storageType Override the default storage type [local, session]
	 */
	function setValue(name, value, days, forceCookie, storageType) {
		if (!forceCookie && hasStorageSupport()) {
			if (!storageType || !_storageTypeExists(storageType)) {
				_storage.setItem(name, value);
			} else if (_storageTypeExists(storageType)) {
				window[storageType + 'Storage'].setItem(name, value);
			}
		} else {
			_writeCookie(name, value, days);
		}
	}

	/**
	 * setObjectValue - Stringify a JSON object before saving
	 *
	 * @param {String} name The name of the value to save
	 * @param {String} value The value to save
	 * @param {int} days Time period before expiration (Cookies only)
	 * @param {boolean} forceCookie Whether or not to force the use of cookies
	 * @param {String} storageType Override the default storage type [local, session]
	 */
	function setObjectValue(name, value, days, forceCookie, storageType) {
		var stringifiedValue = JSON.stringify(value);
		setValue(name, stringifiedValue, days, forceCookie, storageType);
	}

	/**
	 * getValue - get a value by name from storage or cookie
	 *
	 * @param {String} name The name of the value to retrieve
	 * @param {boolean} forceCookie Whether or not to force the use of cookies
	 * @param {String} storageType Override the default storage type [local, session]
	 * @return {?String} The value requested by name from the storage type or cookie
	 */
	function getValue(name, forceCookie, storageType) {
		if (!!storageType && _storageTypeExists(storageType)) {
			return !forceCookie && hasStorageSupport() ? window[storageType + 'Storage'].getItem(name) : _readCookie(name);
		}
		return !forceCookie && hasStorageSupport() ? _storage.getItem(name) : _readCookie(name);
	}

	/**
	 * getObjectValue - Parse a stringified object to JSON before returning
	 *
	 * @param {string} name The name of the value to retrieve
	 * @param {boolean} forceCookie Whether or not to force the use of cookies
	 * @param {String} storageType Override the default storage type [local, session]
	 * @return {?Object} The JSON object requested by name from the storage type or cookie
	 */
	function getObjectValue(name, forceCookie, storageType) {
		var storedValue = getValue(name, forceCookie, storageType);
		return JSON.parse(storedValue);
	}

	/**
	 * removeValue - delete a cookie or storage value by name
	 * @param {String} name The name of the value to delete/remove from storage
	 * @param {boolean} forceCookie Whether or not to force the use of cookies
	 */
	function removeValue(name, forceCookie) {
		if (!forceCookie && hasStorageSupport()) {
			_storage.removeItem(name);
		} else {
			setValue(name, '', -1, true);
		}
	}

	/**
	 * _storageTypeExists - check if the storage type passed is valid (local/session)
	 * @param  {string} storageType - storage type passed
	 * @return {boolean} returns true if the type is valid, false if not
	 */
	function _storageTypeExists(storageType) {
		return ['local', 'session'].indexOf(storageType) > -1;
	}
}());