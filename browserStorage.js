var browserStorage = (function() {
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
	 * @param {Object} [config] Config object to set things like domain or cookie duration
	 */
	function setOptions(config) {
		if (!!config) {
			_options.domain = config.domain || _options.domain;
			_options.expires = config.expires || _options.expires;
			_options.path = config.path || _options.path;
			_options.session = config.session || _options.session;

			// setup which type of storage to use
			_storage = _options.session ? window.sessionStorage : window.localStorage;
		}
	}

	/**
	 * Whether the current browser supports local/session storage as a way of storing data
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
	 * @param {String} name The name of the property to read from this document's cookies
	 * @return {?String} The specified cookie property's value (or null if it has not been set)
	 */
	function _readCookie(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		var c;
		for (var i = 0; i < ca.length; i++) {
			c = ca[i];
			while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
			if (c.indexOf(nameEQ) === 0) { return decodeURI(c.substring(nameEQ.length, c.length)); }
		}

		return null;
	}

	/**
	 * @param {String} name The name of the property to set by writing to a cookie
	 * @param {String} value The value to use when setting the specified property
	 * @param {int} [days] The number of days until the storage of this item expires
	 */
	function _writeCookie(name, value, days) {
		var expiration = (function() {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days*24*60*60*1000));
				return '; expires=' + date.toGMTString();
			} else {
				return _options.expiration || '';
			}
		})();
		var path = !!_options.path ? '; path=' + _options.path : '';
		var domain = !!_options.domain ? '; domain=' + _options.domain : '';

		document.cookie = name + '=' + encodeURI(value) + expiration + path + domain;
	}

	/**
	 * @param {String} name The name of the property to set
	 * @param {String} value The value to use when setting the specified property
	 * @param {int} [days] The number of days until the storage of this item expires (if storage of the provided item must fallback to using cookies)
	 * @param {Boolean} forceCookie Force write to cookie rather than preferring local/session storage
	 * @param {String} value Force a specific type of storage (acceptable values are local/session)
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
	 * Stringify a JSON object before saving
	 */
	function setObjectValue(name, value, days, forceCookie, storageType) {
		var stringifiedValue = JSON.stringify(value);
		return setValue(name, stringifiedValue, days, forceCookie, storageType);
	}

	/**
	 * @param {String} name The name of the value to retrieve
	 * @param {Boolean} forceCookie Force write to cookie rather than preferring local/session storage
	 * @param {String} value Force a specific type of storage (acceptable values are local/session)
	 * @return {?String} The stored value
	 */
	function getValue(name, forceCookie, storageType) {
		if (!!storageType && _storageTypeExists(storageType)) {
			return !forceCookie && hasStorageSupport() ? window[storageType + 'Storage'].getItem(name) : _readCookie(name);
		}
		return !forceCookie && hasStorageSupport() ? _storage.getItem(name) : _readCookie(name);
	}

	/**
	 * Parse a stringified value to a JSON object before returning
	 */
	function getObjectValue(name, forceCookie, storageType) {
		var storedValue = getValue(name, forceCookie, storageType);
		return JSON.parse(storedValue);
	}

	/**
	 * @param {String} name The name of the value to delete/remove from storage
	 */
	function removeValue(name, forceCookie) {
		if (!forceCookie && hasStorageSupport()) {
			_storage.removeItem(name);
		} else {
			setValue(name, '', -1);
		}
	}

	/**
	 * _storageTypeExists - check if the storage type passed is valid (local/session)
	 * @param  {string} storageType - storage type passed
	 * @return {boolean} returns true if the type is valid, false if not
	 */
	function _storageTypeExists(storageType) {
		return ['local', 'session'].indexOf(storageType) > -1
	}
})();