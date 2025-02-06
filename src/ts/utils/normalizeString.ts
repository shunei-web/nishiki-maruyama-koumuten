/**
 * 文字列または文字列の配列を正規化し、連続した空白を1つの空白に置き換え、
 * 指定された区切り文字で結合します。
 *
 * @param input - 操作対象の文字列または文字列の配列。
 * @param delimiter - 結果の文字列で使用する区切り文字（デフォルトは半角スペース）。
 * @returns 正規化された文字列。入力が配列の場合は、各要素が正規化されて
 *          指定された区切り文字で結合された結果を返します。
 *          入力が文字列でない場合は空文字列を返します。
 */
function normalizeString(input: string | string[], delimiter: string = " "): string {
  if (Array.isArray(input)) {
    return [...new Set(input.filter(Boolean))].join(delimiter);
  }

  if (typeof input === "string") {
    const normalized = input.trim().split(/\s+/);
    return [...new Set(normalized)].join(delimiter);
  }

  return "";
}

export default normalizeString;
