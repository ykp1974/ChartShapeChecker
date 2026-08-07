/**
 * ==========================================
 * 銘柄データマスター (src/data/tickers.js)
 * ==========================================
 * 
 * 【このファイルの役割】
 * アプリ全体で使用する銘柄情報（銘柄コード・名称・市場区分など）が一括管理されています。
 * 
 * 【初学者が押さえるべきポイント：UIとデータの分離】
 * 見た目を決める画面コンポーネント（JSX）内に直接データを書き込むのではなく、
 * このように専用のファイルへ切り出すことで、銘柄の追加・編集が容易になり、
 * コードの再利用性と保守性（メンテナンスのしやすさ）が高まります。
 */

/**
 * 銘柄リストのデータ構造（配列 × オブジェクト）
 * 
 * - [ ] (配列/Array): 複数の銘柄を順番に並べたリストです。
 * - { } (オブジェクト/Object): 1つの銘柄が持つ属性（コード、名称、市場など）をキーと値のペアで保持します。
 * 
 * ※ `export` キーワードを付けることで、他のファイル（コンポーネント）から
 *   `import { TICKERS } from '...'` の形式で呼び出して利用できるようになります。
 */
export const tickers = [
  {
    "symbol": "1356",
    "market": "T",
    "name": "ＴＯＰＩＸベア２倍上場投信",
    "id": "13PuoMZxeUbPhQoZ934yDIVSUmX4OF_mz",
    "filename": "1356_T_ＴＯＰＩＸベア２倍上場投信_chart.png"
  },
  {
    "symbol": "1569",
    "market": "T",
    "name": "ＴＯＰＩＸベア上場投信",
    "id": "14cCIpQ33DP0prwbCaMappiknZg0uxcdx",
    "filename": "1569_T_ＴＯＰＩＸベア上場投信_chart.png"
  },
  {
    "symbol": "2212",
    "market": "T",
    "name": "山崎製パン",
    "id": "1zLj9X_JohdDYBCQSTvjKeSs25_iBEmZz",
    "filename": "2212_T_山崎製パン_chart.png"
  },
  {
    "symbol": "2282",
    "market": "T",
    "name": "日本ハム",
    "id": "1ABK-8T_mNR3BF8bwQ7S2ZuvbxIakYsEq",
    "filename": "2282_T_日本ハム_chart.png"
  },
  {
    "symbol": "2288",
    "market": "T",
    "name": "丸大食品",
    "id": "1iAH3i6InhLHyjRUMr28WAL4SqIKh_cIc",
    "filename": "2288_T_丸大食品_chart.png"
  },
  {
    "symbol": "2674",
    "market": "T",
    "name": "ハードオフコーポレーション",
    "id": "1unkwdHZgNedFvKMsnBrM0CM4vVkv1CSN",
    "filename": "2674_T_ハードオフコーポレーション_chart.png"
  },
  {
    "symbol": "3387",
    "market": "T",
    "name": "クリエイト・レストランツ・ホールディング",
    "id": "1bR_f-dfIPoXaVY05svwBpu_5CaCRdLLe",
    "filename": "3387_T_クリエイト・レストランツ・ホールディング_chart.png"
  },
  {
    "symbol": "3632",
    "market": "T",
    "name": "グリーホールディングス",
    "id": "1AcnL2rMvcBlFHDIcUsqPihLwZvVwmH3S",
    "filename": "3632_T_グリーホールディングス_chart.png"
  },
  {
    "symbol": "4072",
    "market": "T",
    "name": "電算システムホールディングス",
    "id": "1MJB4V6QwAgDKJYiPpy9G8dvXIE3YRJHm",
    "filename": "4072_T_電算システムホールディングス_chart.png"
  },
  {
    "symbol": "4326",
    "market": "T",
    "name": "インテージホールディングス",
    "id": "1T0gJeoNkAdE18NEAIy7zQcv5yp6HcbTz",
    "filename": "4326_T_インテージホールディングス_chart.png"
  },
  {
    "symbol": "4927",
    "market": "T",
    "name": "ポーラ・オルビスホールディングス",
    "id": "1H10mC03RauesJLrQ5sUEUc4mFnWwpUQ_",
    "filename": "4927_T_ポーラ・オルビスホールディングス_chart.png"
  },
  {
    "symbol": "5970",
    "market": "T",
    "name": "ジーテクト",
    "id": "1FnQIjns6C21kbzrBx8dJxRvby4GxiwSB",
    "filename": "5970_T_ジーテクト_chart.png"
  },
  {
    "symbol": "6625",
    "market": "T",
    "name": "ＪＡＬＣＯホールディングス",
    "id": "1T_vPyNPJjL3VEDh2kr7Gz4TRGODg_TYr",
    "filename": "6625_T_ＪＡＬＣＯホールディングス_chart.png"
  },
  {
    "symbol": "6810",
    "market": "T",
    "name": "マクセル",
    "id": "1-HJ_VKg5QHMfBU8OlaoJuocrSAZC0oti",
    "filename": "6810_T_マクセル_chart.png"
  },
  {
    "symbol": "7458",
    "market": "T",
    "name": "第一興商",
    "id": "1PiUtqIajqqbrhyqJIcXY08aOe7coghnF",
    "filename": "7458_T_第一興商_chart.png"
  },
  {
    "symbol": "7846",
    "market": "T",
    "name": "パイロットコーポレーション",
    "id": "1_SVkXxO4keTZvFehKMjvgWalF7NZ2sdn",
    "filename": "7846_T_パイロットコーポレーション_chart.png"
  },
  {
    "symbol": "7943",
    "market": "T",
    "name": "ニチハ",
    "id": "1S4b-WcpZddhJKqJ-7n9c0DLT626Z-gU9",
    "filename": "7943_T_ニチハ_chart.png"
  },
  {
    "symbol": "8984",
    "market": "T",
    "name": "大和ハウスリート投資法人　投資証券",
    "id": "1pjMU-woSBgAA_62LdtBIeb1AbK7alglD",
    "filename": "8984_T_大和ハウスリート投資法人　投資証券_chart.png"
  },
  {
    "symbol": "9037",
    "market": "T",
    "name": "ハマキョウレックス",
    "id": "1RlbznlX5NZ-p3lomGXg8MAAQgoy28iAP",
    "filename": "9037_T_ハマキョウレックス_chart.png"
  },
  {
    "symbol": "9369",
    "market": "T",
    "name": "キユーソー流通システム",
    "id": "17F5GUyUnRtsaO9qnIPboUyFeXuyUf_lT",
    "filename": "9369_T_キユーソー流通システム_chart.png"
  }
];
/**
 * 【発展知識：UIコンポーネントでの使われ方イメージ】
 * 
 * `TickerSelector.jsx` などのコンポーネント側では、このデータを以下のように
 * `map()` 関数を使ってドロップダウン肢（<option>）へと変換します。
 * 
 * import { TICKERS } from '../data/tickers';
 * 
 * <select>
 *   {TICKERS.map((ticker) => (
 *     <option key={ticker.code} value={ticker.code}>
 *       {ticker.code} : {ticker.name}
 *     </option>
 *   ))}
 * </select>
 */