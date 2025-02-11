import UIController from "@ts/uiController";
import normalizeString from "@ts/utils/normalizeString";

/**
 * トグルボタンの制御を行うクラス
 */
class ToggleButtonController extends UIController {
  private readonly controls: string;

  /**
   * @param selector - ドロワーメニュー要素のセレクタ
   * @param controls - コントロールする要素のID
   */
  constructor(selector: string, controls: string | string[] = []) {
    super(selector);
    this.controls = normalizeString(controls);
  }

  /**
   * トグルボタンの初期化を行う
   */
  initialize(): void {
    this.element.addEventListener("click", this.handleClick);
    this.updateUI();
  }

  /**
   * クリックイベントハンドラ
   */
  private handleClick = (): void => {
    this.toggle();
  };

  /**
   * ボタンの状態をトグルする
   */
  private toggle(): void {
    this.setActive(!this.isActive);
  }

  /**
   * ボタンのUIを更新する
   */
  protected updateUI(): void {
    this.element.classList.toggle("is-active", this.isActive);
    this.element.setAttribute("aria-expanded", String(this.isActive));
    this.element.setAttribute(
      "aria-label",
      this.isActive ? "メニューを閉じる" : "メニューを開く",
    );
    if (this.controls)
      this.element.setAttribute("aria-controls", this.controls);
  }
}

export default ToggleButtonController;
