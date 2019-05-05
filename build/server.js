require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "ff95f9cd4a26883be77c";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_config_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/config/env */ "./src/config/env/index.js");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/app */ "./src/app.js");



var server = http__WEBPACK_IMPORTED_MODULE_1___default.a.createServer(_src_app__WEBPACK_IMPORTED_MODULE_2__["default"]);
var currentApp = _src_app__WEBPACK_IMPORTED_MODULE_2__["default"];
var PORT = process.env.PORT || 8080;
server.listen(PORT, function () {
  console.log('running app');
});

if (true) {
  module.hot.accept(/*! ./src/app */ "./src/app.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _src_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/app */ "./src/app.js");
(function () {
    server.removeListener('request', currentApp);
    server.on('request', _src_app__WEBPACK_IMPORTED_MODULE_2__["default"]);
    currentApp = _src_app__WEBPACK_IMPORTED_MODULE_2__["default"];
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
}

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + (err.stack || err.message));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log(
							"warning",
							"[HMR] Update failed: " + (err.stack || err.message)
						);
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./middleware */ "./src/middleware/index.js");
/* harmony import */ var _routes_home__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./routes/home */ "./src/routes/home.js");
/* harmony import */ var _routes_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./routes/user */ "./src/routes/user.js");





var app = express__WEBPACK_IMPORTED_MODULE_0___default()();
mongoose__WEBPACK_IMPORTED_MODULE_1___default.a.set('useCreateIndex', true);
mongoose__WEBPACK_IMPORTED_MODULE_1___default.a.connect('mongodb://alterhop:india123@18.191.25.159:27017/alterhop', {
  useNewUrlParser: true
});
Object(_middleware__WEBPACK_IMPORTED_MODULE_2__["default"])(app);
app.use(_routes_home__WEBPACK_IMPORTED_MODULE_3__["default"]);
app.use(_routes_user__WEBPACK_IMPORTED_MODULE_4__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "./src/config/env/index.js":
/*!*********************************!*\
  !*** ./src/config/env/index.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);

/**
 * [envConfig load appropiate .env file based on the NODE_ENV environemtn variable]
 * @return {Promise} [.env file]
 */

var envConfig = function envConfig() {
  var env = "development";

  switch (env) {
    case 'development':
      return __webpack_require__(/*! dotenv */ "dotenv").config({
        path: path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(process.cwd(), 'src/config/env/.env.dev')
      });

    case 'production':
      return __webpack_require__(/*! dotenv */ "dotenv").config({
        path: path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(process.cwd(), 'src/config/env/.env.prod')
      });

    case 'test':
      return __webpack_require__(/*! dotenv */ "dotenv").config({
        path: path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(process.cwd(), 'src/config/env/.env.test')
      });

    default:
      return __webpack_require__(/*! dotenv */ "dotenv").config({
        path: path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(process.cwd(), 'src/config/env/.env.dev')
      });
  }
};

/* harmony default export */ __webpack_exports__["default"] = (envConfig());

/***/ }),

/***/ "./src/controllers/home.js":
/*!*********************************!*\
  !*** ./src/controllers/home.js ***!
  \*********************************/
/*! exports provided: home */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "home", function() { return home; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);


var home =
/*#__PURE__*/
function () {
  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return res.send({
              host: req.headers.host,
              message: 'API up and running.'
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function home(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/controllers/user.js":
/*!*********************************!*\
  !*** ./src/controllers/user.js ***!
  \*********************************/
/*! exports provided: userSignup, userLogin, verifyUser, resendOTP, resetPasswordToken, resetPasswordTokenVerify, resetPassword */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userSignup", function() { return userSignup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userLogin", function() { return userLogin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyUser", function() { return verifyUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resendOTP", function() { return resendOTP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetPasswordToken", function() { return resetPasswordToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetPasswordTokenVerify", function() { return resetPasswordTokenVerify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetPassword", function() { return resetPassword; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/user */ "./src/models/user.js");
/* harmony import */ var _utils_auth_auth_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/auth/auth.util */ "./src/utils/auth/auth.util.js");
/* harmony import */ var _utils_mail_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/mail.util */ "./src/utils/mail.util.js");
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/message */ "./src/utils/message.js");






var userSignup =
/*#__PURE__*/
function () {
  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(req, res) {
    var email, oldUser, user;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = req.body.email;
            _context.next = 3;
            return _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findOne({
              email: email
            });

          case 3:
            oldUser = _context.sent;

            if (!oldUser) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('User already exists')));

          case 6:
            _context.prev = 6;
            user = new _models_user__WEBPACK_IMPORTED_MODULE_2__["default"](req.body);
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](6);
            return _context.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('invalid data passed')));

          case 13:
            _context.next = 15;
            return user.hashPassword();

          case 15:
            _context.next = 17;
            return user.sendOTP();

          case 17:
            _context.prev = 17;
            _context.next = 20;
            return user.save();

          case 20:
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t1 = _context["catch"](17);
            return _context.abrupt("return", Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])(_context.t1.message));

          case 25:
            return _context.abrupt("return", res.status(201).send({
              status: true,
              message: 'successfully created user',
              user: user.id
            }));

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[6, 10], [17, 22]]);
  }));

  return function userSignup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var userLogin =
/*#__PURE__*/
function () {
  var _ref2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(req, res) {
    var _req$body, email, password, user;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            _context2.next = 3;
            return _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findOne({
              email: email
            });

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('No user Exists')));

          case 6:
            if (user.verifyPassword(password)) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('password do not match')));

          case 8:
            return _context2.abrupt("return", res.status(200).send({
              type: user.user,
              token: "Bearer ".concat(Object(_utils_auth_auth_util__WEBPACK_IMPORTED_MODULE_3__["generateJwtToken"])({
                id: user.id
              }))
            }));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function userLogin(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var verifyUser =
/*#__PURE__*/
function () {
  var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(req, res) {
    var _req$body2, token, id, user, msg;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, token = _req$body2.token, id = _req$body2.id;
            _context3.next = 3;
            return _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findById(id);

          case 3:
            user = _context3.sent;

            if (user) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('No user Exists')));

          case 6:
            if (!user.verifyOTP(token)) {
              _context3.next = 13;
              break;
            }

            msg = Object(_utils_mail_util__WEBPACK_IMPORTED_MODULE_4__["createMessage"])(user.email, 'admin@alterhop.com', 'Alterhop - Important details about the upcoming webinars', "Hi, \nWelcome to the free webinar series #Learnfromleaders on Alterhop.\nWe are excited to connect you with eminent industry leaders.\n\n\nOur speakers:\n\n1) Data scientists from Silicon Valley\n\n2) Forbes 30 under 30\n\n3) Senior leaders from Amazon, Microsoft, TCS, Capgemini\n\n4) Entrepreneurs from Singapore\n\n5) McKinsey, New York\n\n6) And many more!!!\n\n\nThese will happen every Saturday & Sunday (7-8 PM).\n\nPlease follow our Facebook page for more details (we will also send you webinar links on your email).\n\nThe industry leaders will answer all your questions.\n\nPlease login into your account on Alterhop and write down your questions.\n\nWe will talk about them in the webinar.\n\n\nThank you!\n\nTeam Alterhop\n\nadmin@alterhop.com");
            _context3.next = 10;
            return Object(_utils_mail_util__WEBPACK_IMPORTED_MODULE_4__["sendMail"])(msg);

          case 10:
            _context3.next = 12;
            return user.save();

          case 12:
            return _context3.abrupt("return", res.send({
              status: true,
              verified: true
            }));

          case 13:
            return _context3.abrupt("return", res.send({
              status: false,
              verified: false,
              message: 'wrong token'
            }));

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function verifyUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var resendOTP =
/*#__PURE__*/
function () {
  var _ref4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(req, res) {
    var id, user;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.body.id;
            _context4.next = 3;
            return _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findById(id);

          case 3:
            user = _context4.sent;

            if (user) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('No user Exists')));

          case 6:
            _context4.next = 8;
            return user.sendOTP();

          case 8:
            _context4.prev = 8;
            _context4.next = 11;
            return user.save();

          case 11:
            _context4.next = 16;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](8);
            return _context4.abrupt("return", Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])(_context4.t0.message));

          case 16:
            return _context4.abrupt("return", res.status(201).send({
              status: true,
              message: 'successfully resended OTP',
              user: user.id
            }));

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[8, 13]]);
  }));

  return function resendOTP(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var resetPasswordToken =
/*#__PURE__*/
function () {
  var _ref5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(req, res) {
    var email, user, msg;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            email = req.body.email;
            _context5.next = 3;
            return _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findOne({
              email: email
            });

          case 3:
            user = _context5.sent;

            if (user) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('No user Exists')));

          case 6:
            _context5.prev = 6;
            user.sendPwdToken();
            msg = Object(_utils_mail_util__WEBPACK_IMPORTED_MODULE_4__["createMessage"])(email, 'admin@alterhop.com', 'Password reset token', "\n\t\tYour reset password token is: ".concat(user.password.reset_token, "\n\t\t"));
            _context5.next = 11;
            return Object(_utils_mail_util__WEBPACK_IMPORTED_MODULE_4__["sendMail"])(msg);

          case 11:
            _context5.next = 13;
            return user.save();

          case 13:
            return _context5.abrupt("return", res.send({
              status: true,
              message: 'successfully sended token'
            }));

          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5["catch"](6);
            res.send({
              status: false,
              message: 'failed to send token'
            });

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[6, 16]]);
  }));

  return function resetPasswordToken(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var resetPasswordTokenVerify =
/*#__PURE__*/
function () {
  var _ref6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(req, res) {
    var _req$body3, token, id, user;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$body3 = req.body, token = _req$body3.token, id = _req$body3.id;
            _context6.next = 3;
            return _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findById(id);

          case 3:
            user = _context6.sent;

            if (user) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('No user Exists')));

          case 6:
            if (!user.verifyPwdToken(token)) {
              _context6.next = 12;
              break;
            }

            _context6.next = 9;
            return user.save();

          case 9:
            return _context6.abrupt("return", res.send({
              status: true,
              verified: true
            }));

          case 12:
            res.send({
              status: false,
              message: 'failed to verify token'
            });

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function resetPasswordTokenVerify(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var resetPassword =
/*#__PURE__*/
function () {
  var _ref7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7(req, res) {
    var _req$body4, password, id, user;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$body4 = req.body, password = _req$body4.password, id = _req$body4.id;
            _context7.next = 3;
            return _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findById(id);

          case 3:
            user = _context7.sent;

            if (user) {
              _context7.next = 6;
              break;
            }

            return _context7.abrupt("return", res.send(Object(_utils_message__WEBPACK_IMPORTED_MODULE_5__["errMsg"])('No user Exists')));

          case 6:
            user.password.current = password;
            _context7.prev = 7;
            _context7.next = 10;
            return user.save();

          case 10:
            return _context7.abrupt("return", res.send({
              status: true,
              message: 'successfuly reset password'
            }));

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](7);
            res.send({
              status: false,
              message: 'something error'
            });

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this, [[7, 13]]);
  }));

  return function resetPassword(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/middleware/cors.js":
/*!********************************!*\
  !*** ./src/middleware/cors.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_0__);

var corsOption = {
  origin: true,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTION',
  credentials: true,
  exposedHeaders: ['authorization']
};

var corsConfig = function corsConfig(app) {
  app.use(cors__WEBPACK_IMPORTED_MODULE_0___default()(corsOption));
};

/* harmony default export */ __webpack_exports__["default"] = (corsConfig);

/***/ }),

/***/ "./src/middleware/ignReq.js":
/*!**********************************!*\
  !*** ./src/middleware/ignReq.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var ignoreFavicon = function ignoreFavicon(req, res, next) {
  if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

  return next();
};

var ignoreRobots = function ignoreRobots(req, res, next) {
  if (req.url === '/robots.txt') {
    res.type('text/plain');
    return res.send('User-agent: *\nDisallow: /');
  }

  return next();
};

var ignoreRequest = function ignoreRequest(app) {
  app.use(ignoreFavicon);
  app.use(ignoreRobots);
};

/* harmony default export */ __webpack_exports__["default"] = (ignoreRequest);

/***/ }),

/***/ "./src/middleware/index.js":
/*!*********************************!*\
  !*** ./src/middleware/index.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! compression */ "compression");
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cors */ "./src/middleware/cors.js");
/* harmony import */ var _toobussy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toobussy */ "./src/middleware/toobussy.js");
/* harmony import */ var _ignReq__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ignReq */ "./src/middleware/ignReq.js");
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./security */ "./src/middleware/security.js");
/* harmony import */ var _utils_auth_auth_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/auth/auth.util */ "./src/utils/auth/auth.util.js");







/* harmony default export */ __webpack_exports__["default"] = (function (app) {
  app.set('trust proxy', true);
  app.use(body_parser__WEBPACK_IMPORTED_MODULE_0___default.a.urlencoded({
    extended: false
  }));
  app.use(body_parser__WEBPACK_IMPORTED_MODULE_0___default.a.json());
  Object(_cors__WEBPACK_IMPORTED_MODULE_2__["default"])(app);
  app.use(compression__WEBPACK_IMPORTED_MODULE_1___default()());
  app.use(_toobussy__WEBPACK_IMPORTED_MODULE_3__["default"]);
  Object(_ignReq__WEBPACK_IMPORTED_MODULE_4__["default"])(app);
  Object(_security__WEBPACK_IMPORTED_MODULE_5__["default"])(app);
  app.use(_utils_auth_auth_util__WEBPACK_IMPORTED_MODULE_6__["verifyJwt"]);
});

/***/ }),

/***/ "./src/middleware/security.js":
/*!************************************!*\
  !*** ./src/middleware/security.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! helmet */ "helmet");
/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(helmet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var hpp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hpp */ "hpp");
/* harmony import */ var hpp__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(hpp__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ __webpack_exports__["default"] = (function (app) {
  // Don't expose any software information to hackers.
  app.disable('x-powered-by'); // Express middleware to protect against HTTP Parameter Pollution attacks

  app.use(hpp__WEBPACK_IMPORTED_MODULE_1___default()()); // The X-Frame-Options header tells browsers to prevent your webpage from being put in an iframe.

  app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.frameguard({
    action: 'sameorigin'
  })); // Cross-site scripting, abbreviated to “XSS”, is a way attackers can take over webpages.

  app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.xssFilter()); // Sets the X-Download-Options to prevent Internet Explorer from executing
  // downloads in your site’s context.
  // @see https://helmetjs.github.io/docs/ienoopen/

  app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.ieNoOpen()); // Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
  // to guess (“sniff”) the MIME type, which can have security implications. It
  // does this by setting the X-Content-Type-Options header to nosniff.
  // @see https://helmetjs.github.io/docs/dont-sniff-mimetype/

  app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.noSniff());
});

/***/ }),

/***/ "./src/middleware/toobussy.js":
/*!************************************!*\
  !*** ./src/middleware/toobussy.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var toobusy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! toobusy-js */ "toobusy-js");
/* harmony import */ var toobusy_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(toobusy_js__WEBPACK_IMPORTED_MODULE_0__);

var isDevelopment = "development" === 'development';
/* harmony default export */ __webpack_exports__["default"] = (function (req, res, next) {
  if (!isDevelopment && toobusy_js__WEBPACK_IMPORTED_MODULE_0___default()()) {
    res.statusCode = 503;
    res.send('It looke like the sever is bussy. Wait few seconds...');
  } else {
    // queue up the request and wait for it to complete in testing and development phase
    next();
  }
});

/***/ }),

/***/ "./src/models/user.js":
/*!****************************!*\
  !*** ./src/models/user.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/token */ "./src/utils/token.js");


var Schema = mongoose__WEBPACK_IMPORTED_MODULE_1___default.a.Schema;
var accountSid = process.env.TWILIO_AUTH_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var client = __webpack_require__(/*! twilio */ "twilio")(accountSid, authToken);


var userSchema = new Schema({
  fullname: {
    type: String,
    trim: true,
    validate: {
      validator: function validator(v) {
        return /^([a-zA-z0-9 _]){2,}$/.test(v);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid name");
      }
    },
    required: [true, 'firstname is required']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      /* eslint-disable */
      validator: function validator(v) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid email");
      }
    },
    required: [true, 'email is required']
  },
  password: {
    current: {
      type: String,
      trim: true,
      required: true
    },
    reset_token: {
      type: String
    }
  },
  mobile: {
    no: {
      type: String,
      unique: true,
      validate: {
        validator: function validator(v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: function message(props) {
          return "".concat(props.value, " is not a valid 10 digit phone number");
        }
      },
      required: [true, 'phone no is required']
    },
    con_code: {
      type: String,
      default: '+91'
    },
    token: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  college: {
    type: String,
    lowercase: true,
    trim: true
  },
  branch: {
    type: String,
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});
/*
 * Method's to encrypt and decrypt the password
 * @params {password}
 * @return {hashed password}
 */

userSchema.methods.hashPassword = function hashPassword() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 64;
  var salt = Buffer.from("".concat(process.env.HASH_SECRET), 'base64');
  var key = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.pbkdf2Sync(this.password.current, salt, 100000, length, 'sha512');
  this.password.current = key.toString('hex');
  return true;
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;
  var salt = Buffer.from("".concat(process.env.HASH_SECRET), 'base64');
  var key = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.pbkdf2Sync(password, salt, 100000, length, 'sha512');

  if (this.password.current === key.toString('hex')) {
    return true;
  }

  return false;
};
/*
 * Method's to aend and receive token
 * @params {token}
 * @return {boolean status}
 */


userSchema.methods.sendOTP = function sendOTP() {
  var token = Object(_utils_token__WEBPACK_IMPORTED_MODULE_2__["default"])(4);
  this.mobile.token = token;
  client.messages.create({
    body: "Your OTP token is: ".concat(token),
    from: '+17753128664',
    to: "".concat(this.mobile.con_code).concat(this.mobile.no)
  }).then(function (message) {
    return true;
  }).catch(function (err) {
    return false;
  });
};

userSchema.methods.verifyOTP = function verifyOTP(token) {
  if (this.mobile.token === token) {
    this.mobile.token = '';
    this.mobile.verified = true;
    return true;
  }

  return false;
};

userSchema.methods.sendPwdToken = function sendPwdToken() {
  var token = Object(_utils_token__WEBPACK_IMPORTED_MODULE_2__["default"])();

  try {
    this.password.reset_token = Object(_utils_token__WEBPACK_IMPORTED_MODULE_2__["default"])();
    return true;
  } catch (e) {
    return false;
  }
};

userSchema.methods.verifyPwdToken = function verifyPwdToken(token) {
  if (this.password.reset_token === token) {
    this.password.reset_token = '';
    return true;
  }

  return false;
};

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_1___default.a.model('User', userSchema));

/***/ }),

/***/ "./src/routes/home.js":
/*!****************************!*\
  !*** ./src/routes/home.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _controllers_home__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/home */ "./src/controllers/home.js");


var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();
router.route('/').get(_controllers_home__WEBPACK_IMPORTED_MODULE_1__["home"]);
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/routes/user.js":
/*!****************************!*\
  !*** ./src/routes/user.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _controllers_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/user */ "./src/controllers/user.js");


var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();
router.route('/auth/login').post(_controllers_user__WEBPACK_IMPORTED_MODULE_1__["userLogin"]);
router.route('/auth/signup').post(_controllers_user__WEBPACK_IMPORTED_MODULE_1__["userSignup"]);
router.route('/auth/verifyuser').post(_controllers_user__WEBPACK_IMPORTED_MODULE_1__["verifyUser"]);
router.route('/auth/resendotp').post(_controllers_user__WEBPACK_IMPORTED_MODULE_1__["resendOTP"]);
router.route('/auth/resetpasswordtoken').post(_controllers_user__WEBPACK_IMPORTED_MODULE_1__["resetPasswordToken"]);
router.route('/auth/resetpasswordverify').post(_controllers_user__WEBPACK_IMPORTED_MODULE_1__["resetPasswordTokenVerify"]);
router.route('/auth/resetpassword').post(_controllers_user__WEBPACK_IMPORTED_MODULE_1__["resetPassword"]);
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/utils/auth/auth.util.js":
/*!*************************************!*\
  !*** ./src/utils/auth/auth.util.js ***!
  \*************************************/
/*! exports provided: generateJwtToken, verifyJwtToken, verifyJwt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateJwtToken", function() { return generateJwtToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyJwtToken", function() { return verifyJwtToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyJwt", function() { return verifyJwt; });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);



var privateCert = fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync(path__WEBPACK_IMPORTED_MODULE_1___default.a.resolve(__dirname, 'private.key'));
var publicCert = fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync(path__WEBPACK_IMPORTED_MODULE_1___default.a.resolve(__dirname, 'public.key'));
var generateJwtToken = function generateJwtToken(payload) {
  var cert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : privateCert;
  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.sign(payload, cert, {
    algorithm: 'RS256',
    expiresIn: '30d'
  });
};
var verifyJwtToken = function verifyJwtToken(token) {
  var cert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : publicCert;

  try {
    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.verify(token, cert);
  } catch (e) {
    throw new Error(e);
  }
};
var verifyJwt = function verifyJwt(req, res, next) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    var token = req.headers.authorization.split(' ')[1];
    var payload = verifyJwtToken(token);

    if (payload !== null || payload !== undefined) {
      req.user = payload;
    }
  } else {
    req.user = {};
  }

  next();
};
/* WEBPACK VAR INJECTION */}.call(this, "src/utils/auth"))

/***/ }),

/***/ "./src/utils/mail.util.js":
/*!********************************!*\
  !*** ./src/utils/mail.util.js ***!
  \********************************/
/*! exports provided: createMessage, sendMail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMessage", function() { return createMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sendMail", function() { return sendMail; });
/* harmony import */ var _sendgrid_mail__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sendgrid/mail */ "@sendgrid/mail");
/* harmony import */ var _sendgrid_mail__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sendgrid_mail__WEBPACK_IMPORTED_MODULE_0__);

_sendgrid_mail__WEBPACK_IMPORTED_MODULE_0___default.a.setApiKey(process.env.SENDGRID_API_KEY);
var createMessage = function createMessage(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'admin@alterhop.com';
  var subject = arguments.length > 2 ? arguments[2] : undefined;
  var text = arguments.length > 3 ? arguments[3] : undefined;
  return {
    to: to,
    from: from,
    subject: subject,
    text: text
  };
};
var sendMail = function sendMail(message) {
  return _sendgrid_mail__WEBPACK_IMPORTED_MODULE_0___default.a.send(message);
};

/***/ }),

/***/ "./src/utils/message.js":
/*!******************************!*\
  !*** ./src/utils/message.js ***!
  \******************************/
/*! exports provided: errMsg */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "errMsg", function() { return errMsg; });
var errMsg = function errMsg(message) {
  return {
    status: false,
    message: message
  };
};

/***/ }),

/***/ "./src/utils/token.js":
/*!****************************!*\
  !*** ./src/utils/token.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


var token = function token() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
  var buf = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.randomBytes(size);
  var token = buf.toString('hex');
  return token;
};

/* harmony default export */ __webpack_exports__["default"] = (token);

/***/ }),

/***/ 0:
/*!*******************************************!*\
  !*** multi webpack/hot/poll?1000 ./index ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! ./index */"./index.js");


/***/ }),

/***/ "@babel/runtime/helpers/asyncToGenerator":
/*!**********************************************************!*\
  !*** external "@babel/runtime/helpers/asyncToGenerator" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/regenerator");

/***/ }),

/***/ "@sendgrid/mail":
/*!*********************************!*\
  !*** external "@sendgrid/mail" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@sendgrid/mail");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),

/***/ "hpp":
/*!**********************!*\
  !*** external "hpp" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("hpp");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "toobusy-js":
/*!*****************************!*\
  !*** external "toobusy-js" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("toobusy-js");

/***/ }),

/***/ "twilio":
/*!*************************!*\
  !*** external "twilio" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("twilio");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map