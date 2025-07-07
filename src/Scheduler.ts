import { type PQCallbackOptions, type PQItemOptions } from "../@types/index.d";

export enum TaskState {
  /**
   * 就绪状态
   */
  READY = "ready",
  /**
   * 执行状态
   */
  RUNNING = "running",
  /**
   * 暂停状态
   */
  PAUSE = "pause",
  /**
   * 清除状态
   */
  CLEAR = "clear",
}

interface PQItem {
  event: (arg: PQCallbackOptions) => Promise<any>;
  options: PQItemOptions;
  fn?: () => Promise<any>;
}

interface SchedulerOptions {
  /**
   * 最大队列长度(默认为0，不限制)
   */
  maxSize: number;
  /**
   * 最大并发数(默认为1)
   */
  maxConcurrenceCount: number;
}


export default class Scheduler {
  _tasks: PQItem[] = []; // 正在等待的任务
  _runningTasks: PQItem[] = []; // 正在执行的任务
  _maxConcurrenceCount: number = 1; // 最大并发数
  _maxSize: number = -1; // 最大队列长度
  _state: TaskState = TaskState.READY; // 暂停状态 就绪状态 执行状态 清空状态
  constructor(options: SchedulerOptions) {
    this._maxConcurrenceCount = options.maxConcurrenceCount;
    this._maxSize = options.maxSize;
  }
  addTask(task: PQItem) {
    if (this._maxSize >= 0 && this._tasks.length >= this._maxSize) {
      console.error("Queue is full");
      return;
    }
    this._tasks.push(task);
  }
  setMaxSize(maxSize: number) {
    this._maxSize = maxSize;
  }
  getState() {
    return this._state;
  }
  getTasks() {
    return this._tasks;
  }
  getRunningTasks() {
    return this._runningTasks;
  }
  start(endCallback?: () => void) {
    this._setState(TaskState.READY);
    this._runTask(endCallback);
  }
  pause() {
    this._setState(TaskState.PAUSE);
  }
  clear() {
    this._tasks.length = 0;
    this._setState(TaskState.CLEAR);
  }
  async _runTask(endCallback?: () => void) {
    if (this._state === TaskState.PAUSE) {
      return;
    }
    const task = this._getTask();
    if (task) {
      this._runningTasks.push(task);
      if (
        this._runningTasks.length < this._maxConcurrenceCount &&
        this._tasks.length > 0
      ) {
        this._runTask(endCallback);
      }
      try {
        await task.fn!();
        this._runningTasks.splice(this._runningTasks.indexOf(task), 1);
        if (
          this._runningTasks.length < this._maxConcurrenceCount &&
          this._tasks.length > 0
        ) {
          this._runTask(endCallback);
        } else if (this._runningTasks.length === 0 && this._tasks.length === 0) {
          // 执行完成
          if (this._state === TaskState.RUNNING) {
            endCallback && endCallback();
          }
          this._setState(TaskState.READY);
        }
      } catch (error) {
        throw error;
      }
    }
  }

  private _getTask() {
    if (
      this._runningTasks.length < this._maxConcurrenceCount &&
      this._tasks.length > 0
    ) {
      this._setState(TaskState.RUNNING);
      return this._tasks.shift();
    }
    return;
  }
  private _setState(state: TaskState) {
    this._state = state;
  }
}
