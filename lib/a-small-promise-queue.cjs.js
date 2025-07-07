'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function defaultValue(v, defaultValue) {
    if (v === undefined || v === null || v === "") {
        return defaultValue;
    }
    return v;
}

var TaskState;
(function (TaskState) {
    /**
     * 就绪状态
     */
    TaskState["READY"] = "ready";
    /**
     * 执行状态
     */
    TaskState["RUNNING"] = "running";
    /**
     * 暂停状态
     */
    TaskState["PAUSE"] = "pause";
    /**
     * 清除状态
     */
    TaskState["CLEAR"] = "clear";
})(TaskState || (TaskState = {}));
var Scheduler = /** @class */ (function () {
    function Scheduler(options) {
        this._tasks = []; // 正在等待的任务
        this._runningTasks = []; // 正在执行的任务
        this._maxConcurrenceCount = 1; // 最大并发数
        this._maxSize = -1; // 最大队列长度
        this._state = TaskState.READY; // 暂停状态 就绪状态 执行状态 清空状态
        this._maxConcurrenceCount = options.maxConcurrenceCount;
        this._maxSize = options.maxSize;
    }
    Scheduler.prototype.addTask = function (task) {
        if (this._maxSize >= 0 && this._tasks.length >= this._maxSize) {
            console.error("Queue is full");
            return;
        }
        this._tasks.push(task);
    };
    Scheduler.prototype.setMaxSize = function (maxSize) {
        this._maxSize = maxSize;
    };
    Scheduler.prototype.getState = function () {
        return this._state;
    };
    Scheduler.prototype.getTasks = function () {
        return this._tasks;
    };
    Scheduler.prototype.getRunningTasks = function () {
        return this._runningTasks;
    };
    Scheduler.prototype.start = function (endCallback) {
        this._setState(TaskState.READY);
        this._runTask(endCallback);
    };
    Scheduler.prototype.pause = function () {
        this._setState(TaskState.PAUSE);
    };
    Scheduler.prototype.clear = function () {
        this._tasks.length = 0;
        this._setState(TaskState.CLEAR);
    };
    Scheduler.prototype._runTask = function (endCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var task, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._state === TaskState.PAUSE) {
                            return [2 /*return*/];
                        }
                        task = this._getTask();
                        if (!task) return [3 /*break*/, 4];
                        this._runningTasks.push(task);
                        if (this._runningTasks.length < this._maxConcurrenceCount &&
                            this._tasks.length > 0) {
                            this._runTask(endCallback);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, task.fn()];
                    case 2:
                        _a.sent();
                        this._runningTasks.splice(this._runningTasks.indexOf(task), 1);
                        if (this._runningTasks.length < this._maxConcurrenceCount &&
                            this._tasks.length > 0) {
                            this._runTask(endCallback);
                        }
                        else if (this._runningTasks.length === 0 && this._tasks.length === 0) {
                            // 执行完成
                            if (this._state === TaskState.RUNNING) {
                                endCallback && endCallback();
                            }
                            this._setState(TaskState.READY);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Scheduler.prototype._getTask = function () {
        if (this._runningTasks.length < this._maxConcurrenceCount &&
            this._tasks.length > 0) {
            this._setState(TaskState.RUNNING);
            return this._tasks.shift();
        }
        return;
    };
    Scheduler.prototype._setState = function (state) {
        this._state = state;
    };
    return Scheduler;
}());

var PromiseQueue = /** @class */ (function () {
    function PromiseQueue(opt) {
        if (opt === void 0) { opt = {}; }
        this._isSkipError = true;
        this._isAutoExecByAdd = true;
        this._maxConcurrenceCount = 1;
        this._timeout = -1;
        this._maxSize = -1;
        this._isSkipError = defaultValue(opt.isSkipError, true);
        this._isAutoExecByAdd = defaultValue(opt.isAutoExecByAdd, true);
        this._timeout = defaultValue(opt.timeout, -1);
        this._maxSize = defaultValue(opt.maxSize, -1);
        this._maxConcurrenceCount = defaultValue(opt.maxConcurrenceCount, 1);
        this._successCallBack = defaultValue(opt.successCallBack, function () { });
        this._errorCallBack = defaultValue(opt.errorCallBack, function () { });
        this._taskEndCallBack = opt.taskEndCallBack;
        this._scheduler = new Scheduler({
            maxConcurrenceCount: this._maxConcurrenceCount,
            maxSize: this._maxSize,
        });
    }
    Object.defineProperty(PromiseQueue.prototype, "size", {
        get: function () {
            return this._scheduler.getTasks().length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PromiseQueue.prototype, "runningSize", {
        get: function () {
            return this._scheduler.getRunningTasks().length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PromiseQueue.prototype, "maxSize", {
        get: function () {
            return this._maxSize;
        },
        set: function (value) {
            this._maxSize = value;
            this._scheduler.setMaxSize(value);
        },
        enumerable: false,
        configurable: true
    });
    PromiseQueue.prototype.add = function (asyncEvent, opt) {
        var _this = this;
        if (opt === void 0) { opt = {}; }
        opt.isSkipError = defaultValue(opt.isSkipError, this._isSkipError);
        opt.timeout = defaultValue(opt.timeout, this._timeout);
        opt.successCallBack = defaultValue(opt.successCallBack, this._successCallBack);
        opt.errorCallBack = defaultValue(opt.errorCallBack, this._errorCallBack);
        var task = {
            event: asyncEvent,
            options: opt,
            fn: function () {
                return _this._exec(asyncEvent, opt);
            },
        };
        this._scheduler.addTask(task);
        if (this._isAutoExecByAdd) {
            this.start();
        }
    };
    PromiseQueue.prototype.clear = function () {
        this._scheduler.clear();
    };
    PromiseQueue.prototype.pause = function () {
        this._scheduler.pause();
    };
    PromiseQueue.prototype.start = function () {
        this._scheduler.start(this._taskEndCallBack);
    };
    PromiseQueue.prototype._exec = function (event, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var timeout, nowTime, schedulerState, pqObj, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nowTime = new Date().getTime();
                        schedulerState = this._scheduler.getState();
                        pqObj = {
                            isTimeout: false,
                            isPaused: schedulerState === "pause",
                            schedulerState: schedulerState,
                        };
                        if (options.timeout > 0) {
                            timeout = setTimeout(function () {
                                options.errorCallBack(new Error("Timeout"));
                                if (options.isSkipError) {
                                    pqObj.isTimeout = true;
                                    resolve(true);
                                }
                                else {
                                    reject(new Error("Timeout"));
                                }
                            }, options.timeout);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, event(pqObj)];
                    case 2:
                        res = _a.sent();
                        // 如果设置了超时且没有超时，则执行下一个任务
                        if (options.timeout) {
                            if (new Date().getTime() - nowTime <= options.timeout) {
                                if (timeout) {
                                    clearTimeout(timeout);
                                    timeout = null;
                                }
                                options.successCallBack(res);
                                resolve(true);
                            }
                        }
                        else {
                            options.successCallBack(res);
                            resolve(true);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        options.errorCallBack(err_1);
                        if (options.isSkipError) {
                            resolve(true);
                        }
                        else {
                            reject(err_1);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return PromiseQueue;
}());

exports.PromiseQueue = PromiseQueue;
exports.SmallPromiseQueue = PromiseQueue;
exports.default = PromiseQueue;
//# sourceMappingURL=a-small-promise-queue.cjs.js.map
