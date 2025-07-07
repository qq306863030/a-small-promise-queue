export class PromiseQueue {
  constructor(options?: PQOptions);
  /**
   * 当前列表中的任务数
   */
  size: number;
  /**
   * 列表中的最大任务数
   */
  maxSize: number;
  /**
   * 当前正在执行的任务数
   */
  runningSize: number;
  /**
   * 添加任务到队列中
   * @param asyncEvent 在执行中会自动在函数的最后追加一个参数，用于传递当前的执行状态
   * @param opt 单独任务的配置项
   */
  add(asyncEvent: (...args: any[]) => Promise<any>, opt?: PQItemOptions): void;
  /**
   * 开始执行
   */
  start(): void;
  /**
   * 暂停执行
   */
  pause(): void;
  /**
   * 清除任务队列
   */
  clear(): void;
}
export { PromiseQueue as SmallPromiseQueue };
export default PromiseQueue;

export interface PQOptions {
  /**
   * 是否跳过错误(默认true)
   */
  isSkipError?: boolean;
  /**
   * 是否在添加时自动执行(默认true)
   */
  isAutoExecByAdd?: boolean;
  /**
   * 超时时长(ms)(默认为-1，不限制)
   */
  timeout?: number;
  /**
   * 最大队列长度(默认为-1，不限制)
   */
  maxSize?: number;
  /**
   * 最大并发数(默认为1)
   */
  maxConcurrenceCount?: number;
  /**
   * 执行成功的回调函数
   * @param result 传入异步方法的返回值
   * @returns
   */
  successCallBack?: (result: any) => void;
  /**
   * 执行错误时的回调函数
   * @param error
   * @returns
   */
  errorCallBack?: (error: any) => void;
  /**
   * 任务列表执行完成时的返回值
   * @returns
   */
  taskEndCallBack?: () => void;
}

export type TaskState = "ready" | "running" | "pause" | "clear";

export interface PQCallbackOptions {
  /**
   * 是否超时
   */
  isTimeout: boolean;
  /**
   * 是否处于暂停状态
   */
  isPaused: boolean;
  /**
   * 调度器的状态(ready就绪状态、running执行状态、pause暂停状态、clear清除状态)
   */
  schedulerState: TaskState;
}

export interface PQItemOptions {
  /**
   * 是否跳过错误
   */
  isSkipError?: boolean;
  /**
   * 超时时长(ms)
   */
  timeout?: number;
  /**
   * 执行成功的回调函数
   * @param result 传入异步方法的返回值
   * @returns
   */
  successCallBack?: (result: any) => void;
  /**
   * 执行错误时的回调函数
   * @param error
   * @returns
   */
  errorCallBack?: (error: any) => void;
}

