var serviceWorkerOption = {
  "assets": []
};
        
        /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./sw.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sw.js":
/*!***************!*\
  !*** ./sw.js ***!
  \***************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//const DEBUG = false;

// When the user navigates to your site,
// the browser tries to redownload the script file that defined the service
// worker in the background.
// If there is even a byte's difference in the service worker file compared
// to what it currently has, it considers it 'new'.
//const { assets } = global.serviceWorkerOption;

//const CACHE_NAME = new Date().toISOString();

//let assetsToCache = [...assets, './'];

//assetsToCache = assetsToCache.map(path => {
//    return new URL(path, global.location).toString();
//});

//assetsToCache = [];

// When the service worker is first added to a computer.
//self.addEventListener('install', event => {
//   Perform install steps.
//  if (DEBUG) {
//    console.log('[SW] Install event');
//  }

//  // Add core website files to cache during serviceworker installation.
//  event.waitUntil(
//    global.caches
//      .open(CACHE_NAME)
//      .then(cache => {
//        return cache.addAll(assetsToCache);
//      })
//      .then(() => {
//        if (DEBUG) {
//          console.log('Cached assets: main', assetsToCache);
//        }
//      })
//      .catch(error => {
//        console.error(error);
//        throw error;
//      })
//  );
//});

// After the install event.
//self.addEventListener('activate', event => {
//  if (DEBUG) {
//    console.log('[SW] Activate event');
//  }

//   Clean the caches
//  event.waitUntil(
//    global.caches.keys().then(cacheNames => {
//      return Promise.all(
//        cacheNames.map(cacheName => {
//           Delete the caches that are not the current one.
//          if (cacheName.indexOf(CACHE_NAME) === 0) {
//            return null;
//          }

//          return global.caches.delete(cacheName);
//        })
//      )
//    })
//  );
//})

//self.addEventListener('message', event => {
//  switch (event.data.action) {
//    case 'skipWaiting':
//      if (self.skipWaiting) {
//        self.skipWaiting();
//        self.clients.claim();
//      }
//      break
//    default:
//      break
//  }
//})

var CACHE = 'cache-and-update';

self.addEventListener('install', function () {
    return self.skipWaiting();
});

self.addEventListener('activate', function () {
    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    //Ignore not GET request.
    if (e.request.method !== 'GET') {
        return;
    }

    const isHashed = e.request.url.includes("---") && (e.request.url.includes("dist/main") || e.request.url.includes("dist/chunk") || e.request.url.includes("dist/resourcemanager"));

    e.waitUntil(() => {
        fromCache(e.request).then(result => {
            e.respondWith(result);
            if (isHashed) return;
            e.waitUntil(update(e.request));
        }).catch(() => {
            e.respondWith(update(e.request));
        });
    });
});

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (matching) {
                return matching;
            } else {
                Promise.reject('no-match');
            }
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            cache.put(request, response);
            return response;
        });
    });
}

self.addEventListener('push', function (e) {
    e.waitUntil((async () => {
        const data = e.data.json();
        console.log(data);
        let employee = {};
        if (data.RequesterId) {
            const response = await fetch(`/api/Employee/GetEmployee?EmployeeId=${data.RequesterId}`,
                {
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "Get",
                }
            );
            employee = await response.json();
        }
        console.log(employee);
        let options = {
            body: data.Body,
            icon: "data:image/png;base64," + employee.Photo || false,
            vibrate: [50, 30, 50],
            //actions: [
            //    {
            //        action: "yay", title: "قبول"
            //    },
            //    {
            //        action: "nay", title: "رد"
            //    }
            //]
        };
        console.log("before notification");
        await self.registration.showNotification(`${data.Title} • ${employee.FullName}`, options);
        console.log("after notification");
    })());
});

//self.addEventListener("notificationclick", (event) => {
//    let promise = new Promise((resolve) => {
//        event.notification.close();
//        console.log(event.action);
//        resolve();
//    });
//    event.waitUntil(promise);
//});

// Pass Through
//self.addEventListener('fetch', e => {
//    e.respondWith(fetch(e.request));
//});


/***/ })

/******/ });
//# sourceMappingURL=service-worker.js.map