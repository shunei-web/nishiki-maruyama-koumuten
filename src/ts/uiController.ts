import EventEmitter from "@ts/eventEmitter";

/**
 * UI要素の制御を行う抽象基底クラス
 */
abstract class UIController extends EventEmitter {
  protected element: HTMLElement;
  protected isActive: boolean = false;

  /**
   * @param selector - 制御対象のDOM要素を選択するためのセレクタ
   * @throws Error 要素が見つからない場合
   */
  constructor(selector: string) {
    super();
    const element = document.querySelector(selector);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`要素が見つかりません: ${selector}`);
    }
    this.element = element;
  }

  /**
   * コントローラの初期化を行う抽象メソッド
   */
  abstract initialize(): void;

  /**
   * 状態変更リスナーを追加する
   * @param listener - 状態変更時に呼び出されるコールバック関数
   */
  public addStateChangeListener(listener: (isActive: boolean) => void): void {
    this.on("stateChange", listener);
  }

  /**
   * 状態変更リスナーを削除する
   * @param listener - 削除するリスナー関数
   */
  public removeStateChangeListener(
    listener: (isActive: boolean) => void,
  ): void {
    this.off("stateChange", listener);
  }

  /**
   * アクティブ状態を設定し、UIを更新する
   * @param isActive - 設定するアクティブ状態
   */
  protected setActive(isActive: boolean): void {
    if (this.isActive !== isActive) {
      this.isActive = isActive;
      this.updateUI();
      this.emit("stateChange", this.isActive);
    }
  }

  /**
   * 外部からアクティブ状態を更新するためのメソッド
   * @param isActive - 設定するアクティブ状態
   */
  public updateState(isActive: boolean): void {
    this.setActive(isActive);
  }

  /**
   * UIを更新する抽象メソッド
   */
  protected abstract updateUI(): void;
}

export default UIController;
