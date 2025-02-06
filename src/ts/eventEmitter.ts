/**
 * イベントの発行と購読を管理するための基本クラス
 */
class EventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();

  /**
   * 指定されたイベントにリスナーを追加する
   * @param event - イベント名
   * @param callback - イベント発生時に呼び出される関数
   */
  protected on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * 指定されたイベントを発行し、登録されたリスナーを呼び出す
   * @param event - イベント名
   * @param data - イベントと共に送信されるデータ（オプション）
   */
  protected emit(event: string, data?: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * 指定されたイベントからリスナーを削除する
   * @param event - イベント名
   * @param callback - 削除するリスナー関数
   */
  protected off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }
}

export default EventEmitter;
