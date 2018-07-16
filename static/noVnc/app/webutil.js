/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Copyright (C) 2013 NTT corp.
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

import { init_logging as main_init_logging } from '../core/util/logging.js'

let settings = {}
export default {
  // init log level reading the logging HTTP param
  init_logging: function(level) {
    'use strict'
    if (typeof level !== 'undefined') {
      main_init_logging(level)
    } else {
      const param = document.location.href.match(/logging=([A-Za-z0-9._-]*)/)
      main_init_logging(param || undefined)
    }
  },

  // Read a query string variable
  getQueryVar: function(name, defVal) {
    'use strict'
    const re = new RegExp('.*[?&]' + name + '=([^&#]*)'),
      match = document.location.href.match(re)
    if (typeof defVal === 'undefined') {
      defVal = null
    }

    if (match) {
      return decodeURIComponent(match[1])
    }

    return defVal
  },

  // Read a hash fragment variable
  getHashVar: function(name, defVal) {
    'use strict'
    const re = new RegExp('.*[&#]' + name + '=([^&]*)'),
      match = document.location.hash.match(re)
    if (typeof defVal === 'undefined') {
      defVal = null
    }

    if (match) {
      return decodeURIComponent(match[1])
    }

    return defVal
  },

  // Read a variable from the fragment or the query string
  // Fragment takes precedence
  getConfigVar: function(name, defVal) {
    'use strict'
    const val = this.getHashVar(name)

    if (val === null) {
      return this.getQueryVar(name, defVal)
    }

    return val
  },

  /*
 * Cookie handling. Dervied from: http://www.quirksmode.org/js/cookies.html
 */

  // No days means only for this browser session
  createCookie: function(name, value, days) {
    'use strict'
    let date, expires
    if (days) {
      date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = '; expires=' + date.toGMTString()
    } else {
      expires = ''
    }

    let secure
    if (document.location.protocol === 'https:') {
      secure = '; secure'
    } else {
      secure = ''
    }
    document.cookie = name + '=' + value + expires + '; path=/' + secure
  },

  readCookie: function(name, defaultValue) {
    'use strict'
    const nameEQ = name + '='
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }

    return typeof defaultValue !== 'undefined' ? defaultValue : null
  },

  eraseCookie: function(name) {
    'use strict'
    createCookie(name, '', -1)
  },

  /*
 * Setting handling.
 */

  initSettings: function(callback /*, ...callbackArgs */) {
    'use strict'
    const callbackArgs = Array.prototype.slice.call(arguments, 1)
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.sync.get(function(cfg) {
        settings = cfg
        if (callback) {
          callback.apply(this, callbackArgs)
        }
      })
    } else {
      settings = {}
      if (callback) {
        callback.apply(this, callbackArgs)
      }
    }
  },

  // Update the settings cache, but do not write to permanent storage
  setSetting: function(name, value) {
    settings[name] = value
  },

  // No days means only for this browser session
  writeSetting: function(name, value) {
    'use strict'
    if (settings[name] === value) return
    settings[name] = value
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.sync.set(settings)
    } else {
      localStorage.setItem(name, value)
    }
  },

  readSetting: function(name, defaultValue) {
    'use strict'
    let value
    if (name in settings || (window.chrome && window.chrome.storage)) {
      value = settings[name]
    } else {
      value = localStorage.getItem(name)
      settings[name] = value
    }
    if (typeof value === 'undefined') {
      value = null
    }

    if (value === null && typeof defaultValue !== 'undefined') {
      return defaultValue
    }

    return value
  },

  eraseSetting: function(name) {
    'use strict'
    // Deleting here means that next time the setting is read when using local
    // storage, it will be pulled from local storage again.
    // If the setting in local storage is changed (e.g. in another tab)
    // between this delete and the next read, it could lead to an unexpected
    // value change.
    delete settings[name]
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.sync.remove(name)
    } else {
      localStorage.removeItem(name)
    }
  },

  injectParamIfMissing: function(path, param, value) {
    // force pretend that we're dealing with a relative path
    // (assume that we wanted an extra if we pass one in)
    path = '/' + path

    const elem = document.createElement('a')
    elem.href = path

    const param_eq = encodeURIComponent(param) + '='
    let query
    if (elem.search) {
      query = elem.search.slice(1).split('&')
    } else {
      query = []
    }

    if (
      !query.some(function(v) {
        return v.startsWith(param_eq)
      })
    ) {
      query.push(param_eq + encodeURIComponent(value))
      elem.search = '?' + query.join('&')
    }

    // some browsers (e.g. IE11) may occasionally omit the leading slash
    // in the elem.pathname string. Handle that case gracefully.
    if (elem.pathname.charAt(0) == '/') {
      return elem.pathname.slice(1) + elem.search + elem.hash
    }

    return elem.pathname + elem.search + elem.hash
  },

  // sadly, we can't use the Fetch API until we decide to drop
  // IE11 support or polyfill promises and fetch in IE11.
  // resolve will receive an object on success, while reject
  // will receive either an event or an error on failure.
  fetchJSON: function(path, resolve, reject) {
    // NB: IE11 doesn't support JSON as a responseType
    const req = new XMLHttpRequest()
    req.open('GET', path)

    req.onload = function() {
      if (req.status === 200) {
        let resObj
        try {
          resObj = JSON.parse(req.responseText)
        } catch (err) {
          reject(err)
        }
        resolve(resObj)
      } else {
        reject(
          new Error(
            "XHR got non-200 status while trying to load '" +
              path +
              "': " +
              req.status
          )
        )
      }
    }

    req.onerror = function(evt) {
      reject(
        new Error(
          "XHR encountered an error while trying to load '" +
            path +
            "': " +
            evt.message
        )
      )
    }

    req.ontimeout = function(evt) {
      reject(new Error("XHR timed out while trying to load '" + path + "'"))
    }

    req.send()
  }
}
