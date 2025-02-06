import UIController from "./uiController";
import backfaceFixed from "./utils/backfaceFixed";

/**
 * ドロワーメニューの制御を行うクラス
 */
class DrawerMenuController extends UIController {
  private breakpoint: number | null;
  private isDesktopMode: boolean = false;
  private readonly resizeObserver: ResizeObserver | null = null;

  /**
   * @param selector - ドロワーメニュー要素のセレクタ
   * @param breakpoint - デスクトップモードに切り替えるブレークポイント（ピクセル単位）
   */
  constructor(selector: string, breakpoint: number | null = null) {
    super(selector);
    this.breakpoint = breakpoint;

    if (this.breakpoint) {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(document.documentElement);
    }
  }

  /**
   * ドロワーメニューの初期化を行う
   */
  initialize(): void {
    this.handleResize();
    this.updateUI();
  }

  /**
   * ウィンドウのリサイズを処理する
   */
  private handleResize = (): void => {
    let isDesktopMode = false;
    if (this.breakpoint) {
      isDesktopMode = this.breakpoint <= window.innerWidth;
      if (this.isDesktopMode === isDesktopMode) return;
    }

    this.isDesktopMode = isDesktopMode;
    this.updateLinkListeners();
    this.setActive(isDesktopMode);
  };

  /**
   * リンクのイベントリスナーを更新する
   */
  private updateLinkListeners(): void {
    const links = this.element.querySelectorAll<HTMLAnchorElement>("a");
    links.forEach((link) => {
      link.removeEventListener("click", this.handleLinkClick);
      if (!this.isDesktopMode) {
        link.addEventListener("click", this.handleLinkClick);
      }
    });
  }

  /**
   * ドロワーメニューのUIを更新する
   */
  protected updateUI(): void {
    this.element.classList.toggle("is-active", this.isActive);
    this.element.classList.toggle("is-desktop", this.isDesktopMode);
    this.element.setAttribute("aria-hidden", String(!this.isActive && !this.isDesktopMode));
    if (!this.element.hasAttribute("aria-label")) this.element.setAttribute("aria-label", "サイトメニュー");
    backfaceFixed(this.isActive && !this.isDesktopMode);
  }

  /**
   * ドロワーを閉じて、リンク先に遷移
   */
  private handleLinkClick = (event: MouseEvent): void => {
    if (!this.isActive) return;

    const link = event.currentTarget;
    if (!(link instanceof HTMLAnchorElement)) return;

    event.preventDefault();
    this.updateState(false);

    requestAnimationFrame(() => {
      link.click();
    });
  };

  /**
   * リソースの解放
   */
  public dispose(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.updateLinkListeners();
  }
}

export default DrawerMenuController;
