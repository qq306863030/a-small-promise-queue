import {
  type PQOptions,
  type PQCallbackOptions,
  type PQItemOptions,
} from "../@types/index.d";
import { defaultValue } from "./common";
import Scheduler from "./Scheduler";

class PromiseQueue {
  _isSkipError: boolean = true;
  _isAutoExecByAdd: boolean = true;
  _maxConcurrenceCount: number = 1;
  _timeout: number = -1;
  _maxSize: number = -1;
  _successCallBack: (result: any) => void;
  _errorCallBack: (error: any) => void;
  _taskEndCallBack?: () => void;
  _scheduler: Scheduler;
  constructor(opt: PQOptions = {}) {
    this._isSkipError = defaultValue(opt.isSkipError, true);
    this._isAutoExecByAdd = defaultValue(opt.isAutoExecByAdd, true);
    this._timeout = defaultValue(opt.timeout, -1);
    this._maxSize = defaultValue(opt.maxSize, -1);
    this._maxConcurrenceCount = defaultValue(opt.maxConcurrenceCount, 1);
    this._successCallBack = defaultValue(opt.successCallBack, () => {});
    this._errorCallBack = defaultValue(opt.errorCallBack, () => {});
    this._taskEndCallBack = opt.taskEndCallBack
    this._scheduler = new Scheduler({
      maxConcurrenceCount: this._maxConcurrenceCount,
      maxSize: this._maxSize,
    })
  }

  get size(): number {
    return this._scheduler.getTasks().length;
  }

  get runningSize(): number {
    return this._scheduler.getRunningTasks().length;
  }

  get maxSize(): number {
    return this._maxSize;
  }

  set maxSize(value: number) {
    this._maxSize = value;
    this._scheduler.setMaxSize(value);
  }

  add(
    asyncEvent: (arg?: PQCallbackOptions) => Promise<any>,
    opt: PQItemOptions = {}
  ) {
    opt.isSkipError = defaultValue(opt.isSkipError, this._isSkipError);
    opt.timeout = defaultValue(opt.timeout, this._timeout);
    opt.successCallBack = defaultValue(
      opt.successCallBack,
      this._successCallBack
    );
    opt.errorCallBack = defaultValue(opt.errorCallBack, this._errorCallBack);
    const task = {
      event: asyncEvent,
      options: opt,
      fn: () => {
        return this._exec(asyncEvent, opt);
      },
    };
    this._scheduler.addTask(task);
    if (this._isAutoExecByAdd) {
      this.start();
    }
  }
  clear() {
    this._scheduler.clear();
  }
  pause() {
    this._scheduler.pause();
  }
  start() {
    this._scheduler.start(this._taskEndCallBack);
  }
  _exec(
    event: (arg?: PQCallbackOptions) => Promise<any>,
    options: PQItemOptions = {}
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let timeout: any;
      let nowTime = new Date().getTime();
      const schedulerState = this._scheduler.getState();
      let pqObj: PQCallbackOptions = {
        isTimeout: false,
        isPaused: schedulerState === "pause",
        schedulerState,
      };
      if (options.timeout! > 0) {
        timeout = setTimeout(() => {
          options.errorCallBack!(new Error("Timeout"));
          if (options.isSkipError) {
            pqObj.isTimeout = true;
            resolve(true);
          } else {
            reject(new Error("Timeout"));
          }
        }, options.timeout);
      }
      try {
        const res = await event(pqObj);
        // 如果设置了超时且没有超时，则执行下一个任务
        if (options.timeout) {
          if (new Date().getTime() - nowTime <= options.timeout) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            options.successCallBack!(res);
            resolve(true);
          }
        } else {
          options.successCallBack!(res);
          resolve(true);
        }
      } catch (err) {
        options.errorCallBack!(err);
        if (options.isSkipError) {
          resolve(true);
        } else {
          reject(err);
        }
      }
    });
  }
}

export { PromiseQueue as SmallPromiseQueue, PromiseQueue };
export default PromiseQueue;
