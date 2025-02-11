/**
 * 許可されたCSSスタイルのタイプ定義
 */
type AllowedStyles =
  | "position"
  | "insetBlockStart"
  | "insetInlineStart"
  | "inlineSize"
  | "blockSize"
  | "paddingInlineEnd";

const HEADER_SELECTOR: string = "[data-fixed-header]";
const BACKFACE_FIXED_ATTRIBUTE: string = "data-backface-fixed";

/**
 * 背面を固定するための関数
 * @param fixed - 固定するかどうか
 */
const backfaceFixed = (fixed: boolean): void => {
  const scrollBarWidth = getScrollBarSize();
  const scrollPosition = getScrollPosition(fixed);

  requestAnimationFrame(() => {
    applyStyles(fixed, scrollBarWidth, scrollPosition);
    if (!fixed) {
      restorePosition(scrollPosition);
    }
  });
};

/**
 * スクロールバーの幅を計算する
 * @returns スクロールバーの幅
 */
const getScrollBarSize = (): number => {
  const { innerWidth, innerHeight } = window;
  const { clientWidth, clientHeight } = document.documentElement;
  return isVerticalWritingMode()
    ? innerHeight - clientHeight
    : innerWidth - clientWidth;
};

/**
 * スクロール位置を取得する
 * @param fixed - 固定モードかどうか
 * @returns スクロール位置
 */
const getScrollPosition = (fixed: boolean): number => {
  let headerBlockSize = 0;

  // Firefoxでヘッダーがstickyの場合にヘッダーが画面外になることの対策
  const header = document.querySelector(HEADER_SELECTOR) as HTMLElement;
  if (header) {
    if (getHeaderPosition() === "sticky") {
      headerBlockSize = getHeaderBlockSize();
    } else if (
      (header.getAttribute(BACKFACE_FIXED_ATTRIBUTE) as string) === "sticky"
    ) {
      headerBlockSize = getHeaderBlockSize();
    }
  }

  if (fixed) {
    const { scrollLeft = 0, scrollTop = 0 } = document.scrollingElement ?? {};
    return (isVerticalWritingMode() ? scrollLeft : scrollTop) - headerBlockSize;
  }
  return (
    parseInt(document.body.style.insetBlockStart || "0", 10) - headerBlockSize
  );
};

/**
 * 固定ヘッダーの高さを計算
 */
const getHeaderBlockSize = (): number => {
  const header = document.querySelector(HEADER_SELECTOR) as HTMLElement;
  if (!header) return 0;
  const { position, blockSize } = window.getComputedStyle(header);
  return parseInt(
    position === "fixed" || position === "sticky" ? blockSize : "0",
  );
};

/**
 * ヘッダーのポジションを取得する
 */
const getHeaderPosition = (): string => {
  const header = document.querySelector(HEADER_SELECTOR) as HTMLElement;
  if (!header) return "";
  const { position } = window.getComputedStyle(header);
  return position;
};

/**
 * 背面固定のスタイルを適用する
 * @param apply - スタイルを適用するかどうか
 * @param scrollBarWidth - スクロールバーの幅
 * @param scrollPosition - スクロール位置
 */
const applyStyles = (
  apply: boolean,
  scrollBarWidth: number,
  scrollPosition: number,
): void => {
  // Firefoxでヘッダーがstickyの場合にヘッダーが画面外になることの対策
  const header = document.querySelector(HEADER_SELECTOR) as HTMLElement;
  if (header) {
    if (apply) {
      header.setAttribute(BACKFACE_FIXED_ATTRIBUTE, getHeaderPosition());
    } else {
      header.removeAttribute(BACKFACE_FIXED_ATTRIBUTE);
    }
    header.style["position"] = apply ? "fixed" : "";
  }

  const isVertical = isVerticalWritingMode();
  const styles: Partial<Record<AllowedStyles, string>> = {
    position: "fixed",
    insetBlockStart: `${isVertical ? scrollPosition : -scrollPosition}px`,
    insetInlineStart: "0",
    inlineSize: "100dvi",
    blockSize: "100dvb",
    paddingInlineEnd: `${scrollBarWidth}px`,
  };

  Object.entries(styles).forEach(([key, value]) => {
    document.body.style[key as AllowedStyles] = apply ? value : "";
  });
};

/**
 * スクロール位置を元に戻す
 * @param scrollPosition - 復元するスクロール位置
 */
const restorePosition = (scrollPosition: number): void => {
  const isVertical = isVerticalWritingMode();
  window.scrollTo({
    [isVertical ? "left" : "top"]: isVertical
      ? scrollPosition
      : -scrollPosition,
    behavior: "instant",
  });
};

/**
 * ドキュメントの書字方向を取得し、縦書きかどうかを判定
 * @returns 縦書きの場合true、それ以外はfalse
 */
const isVerticalWritingMode = (): boolean => {
  return window
    .getComputedStyle(document.documentElement)
    .writingMode.includes("vertical");
};

export default backfaceFixed;
