/**
 * センチネル要素の入力タイプ
 */
type SentinelInput = HTMLElement | string | number;

/**
 * ターゲット要素の入力タイプ
 */
type TargetsInput = HTMLElement | NodeListOf<HTMLElement> | string | null;

/**
 * ScrollAnimator のオプション
 */
interface ScrollAnimatorOptions extends IntersectionObserverInit {
  /**
   * アニメーション状態を示す属性名
   * @default "data-animated"
   */
  animatedAttribute?: string;
  reverse?: boolean;
}

/**
 * スクロールアニメーションを制御するクラス
 */
class ScrollAnimator {
  private readonly sentinel: HTMLElement;
  private readonly targetElements: HTMLElement[];
  private readonly options: Required<ScrollAnimatorOptions>;
  private readonly observer: IntersectionObserver;

  /**
   * ScrollAnimator のコンストラクタ
   * @param sentinelInput センチネル要素の入力
   * @param targetsInput ターゲット要素の入力
   * @param options ScrollAnimator のオプション
   */
  constructor(sentinelInput: SentinelInput, targetsInput: TargetsInput = null, options: ScrollAnimatorOptions = {}) {
    const defaultOptions: Required<ScrollAnimatorOptions> = {
      animatedAttribute: "data-animated",
      reverse: false,
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    this.options = { ...defaultOptions, ...options };

    this.sentinel = this.createSentinel(sentinelInput);
    this.targetElements = this.getTargetElements(targetsInput);
    this.observer = new IntersectionObserver(this.handleIntersection, this.options);
    this.observer.observe(this.sentinel);
  }

  /**
   * センチネル要素を作成する
   * @param input センチネル要素の入力
   * @returns 作成されたセンチネル要素
   * @throws Error 無効な入力の場合
   */
  private createSentinel(input: SentinelInput): HTMLElement {
    if (input instanceof HTMLElement) {
      return input;
    }

    const sentinel = document.createElement("div");
    Object.assign(sentinel.style, {
      position: "absolute",
      insetInline: "0",
      blockSize: "1px",
      pointerEvents: "none",
      opacity: "0",
    });

    if (typeof input === "number") {
      sentinel.style.insetBlockStart = `${input}px`;
    } else if (typeof input === "string") {
      const units = [
        "%",
        "px",
        "em",
        "rem",
        "vh",
        "vw",
        "vb",
        "vi",
        "vmin",
        "vmax",
        "svh",
        "svw",
        "svb",
        "svi",
        "svmin",
        "svmax",
        "lvh",
        "lvw",
        "lvb",
        "lvi",
        "lvmin",
        "lvmax",
        "dvh",
        "dvw",
        "dvb",
        "dvi",
        "dvmin",
        "dvmax",
      ];
      if (units.some((unit) => input.endsWith(unit))) {
        sentinel.style.insetBlockStart = input;
      } else {
        const element = document.querySelector<HTMLElement>(input);
        if (element) {
          return element;
        }
        throw new Error(`Invalid selector: ${input}`);
      }
    }

    document.body.appendChild(sentinel);
    return sentinel;
  }

  /**
   * ターゲット要素を取得する
   * @param input ターゲット要素の入力
   * @returns ターゲット要素の配列
   */
  private getTargetElements(input: TargetsInput): HTMLElement[] {
    if (input === null) {
      return [this.sentinel];
    }

    if (input instanceof HTMLElement) {
      return [input];
    }

    if (input instanceof NodeList) {
      return Array.from(input).filter((el): el is HTMLElement => el instanceof HTMLElement);
    }

    if (typeof input === "string") {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(input));
      if (elements.length === 0) {
        console.warn(`No elements found for selector: ${input}`);
      }
      return elements;
    }

    return [];
  }

  /**
   * Intersection Observer のコールバック関数
   * @param entries Intersection Observer のエントリー
   */
  private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    const isIntersecting = entries.some((entry) => entry.isIntersecting);
    this.targetElements.forEach((el) => {
      el.toggleAttribute(this.options.animatedAttribute, this.options.reverse ? !isIntersecting : isIntersecting);
    });
  };

  /**
   * ScrollAnimator インスタンスを破棄する
   */
  public destroy(): void {
    this.observer.disconnect();
    if (this.sentinel.parentNode && this.sentinel !== document.body) {
      this.sentinel.parentNode?.removeChild(this.sentinel);
    }
    this.targetElements.forEach((el) => {
      el.removeAttribute(this.options.animatedAttribute);
    });
  }
}

export default ScrollAnimator;
