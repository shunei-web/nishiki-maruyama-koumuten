/**
 * ウィンドウサイズに応じてビューポートを管理するクラス
 */
class ViewportManager {
  private viewport: HTMLMetaElement;
  private observer: ResizeObserver;

  /**
   * @param minWidth - ビューポートの最小幅（デフォルト: 375）
   */
  constructor(private minWidth = 375) {
    this.viewport =
      document.querySelector('meta[name="viewport"]') ??
      (() => {
        throw new Error("ビューポートのメタタグが見つかりません");
      })();

    this.observer = new ResizeObserver(this.updateViewport);
    this.observer.observe(document.documentElement);
    this.updateViewport();
  }

  /**
   * ビューポートを更新
   */
  private updateViewport = (): void => {
    const content = `width=${window.outerWidth > this.minWidth ? "device-width" : this.minWidth},initial-scale=1`;
    if (this.viewport.content !== content) this.viewport.content = content;
  };

  /**
   * リソースを解放
   */
  public dispose(): void {
    this.observer.disconnect();
    window.dispatchEvent(
      new CustomEvent("viewportManagerDisposed", {
        detail: { currentViewport: this.viewport.content },
      }),
    );
  }
}

export default ViewportManager;
