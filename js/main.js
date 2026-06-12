const form = document.querySelector("#promptForm");
const output = document.querySelector("#promptOutput");
const toast = document.querySelector("#toast");
const previewTitle = document.querySelector("#previewTitle");
const statusType = document.querySelector("#statusType");
const statusOutput = document.querySelector("#statusOutput");
const tableEditor = document.querySelector("#tableEditor");
const tablePreview = document.querySelector("#tablePreview");
const tableViewToggle = document.querySelector("#tableViewToggle");
const previewPane = document.querySelector(".prompt-builder-ec__preview");
const captionImageList = document.querySelector("#captionImageList");
const addCaptionImageBtn = document.querySelector("#addCaptionImageBtn");
const maxCaptionImages = 10;

const cases = {
  caption: {
    label: "商品説明文",
    output: "Prompt for Product Descriptions",
  },
  translation: {
    label: "商品説明文（英文翻訳）",
    output: "Prompt for Product Descriptions",
  },
  tags: {
    label: "タグキーワード出力",
    output: "Keyword Tags",
  },
  table: {
    label: "サイズテーブルHTML生成",
    output: "HTML Table",
  },
};

const templates = {
  caption: `あなたはECサイトの商品ページ制作に特化したプロフェッショナルです。
ユーザーの購買行動を理解し、売れる商品ページを設計できます。
以下の画像をもとに、ECサイト掲載予定の商品情報として登録する前提で商品情報を作成してください。

■ 目的
・ECサイトの商品登録にそのまま使用できる情報を作る
・親商品（1つ）＋カラーバリエーション（複数）として設計する
・実務レベルの粒度・精度で統一する
・画像ごとに色違いを正しく認識し、バリエーションに反映する

■ 出力構成
① 親商品情報（共通）
【商品名】英語表記・全て大文字
【商品名（カタカナ）】
【ブランド名】
【品番（親）】
【カテゴリ】
【価格】
【サイズ詳細】
【タグ（共通）】
【商品説明（テキスト）】
【URLハンドル】{{ブランド名}}-{{品番}} 全て小文字

② バリエーション情報（カラー別）
【カラー】
【カラーコード（任意）】
【品番（SKU）】
【タグ（カラー別）】
【内部メモ】

③ ECサイト掲載商品説明HTML（共通）
<p>説明文1文目。<br>説明文2文目以降</p>
<ul>
  <li>特徴1</li>
  <li>特徴2</li>
  <li>特徴3</li>
</ul>

■ カテゴリ判定
TOPS / BOTTOMS / OUTER / SHOES / BAG / ACCESSORY / GOODS から、画像の形状と構造を見てゼロベースで判定してください。
袖、着丈、身幅、ウエスト、股下、ソール、持ち手、収納部、頭に被る形状の有無を必ず確認してください。`,
  translation: `# 英語商品情報の翻訳・校正依頼
以下は、ブランド／メーカーから提供された【英語の商品情報】です。
ECサイト掲載用として使用するため、下記ルールに沿って「翻訳 → 日本語校正 → 表現調整」を行ってください。

## ① 作業内容
- 英文を自然な日本語に翻訳
- 誤訳・不自然な直訳・意味の取り違えがないかチェック
- EC向けの商品説明として読みやすく校正
- 日本語として不自然な表現、重複表現、冗長表現を整理
- ブランドの世界観を損なわない範囲で表現を整える

## ② トーン・文体ルール
- 文体：です・ます調
- 過度に感情的／広告的な表現は避ける
- 客観的でわかりやすい商品説明を優先
- 不明確な情報は無理に補完せず、原文準拠で調整

## ③ 出力形式
- 見出し＋本文構成
- 改行を適切に入れ、EC管理画面にそのまま貼れる形
- 箇条書きが適切な箇所は箇条書きで整理`,
  tags: `# SEOタグの選定

## 目的
検索・SEOを意識した汎用性の高いタグキーワードを最低5つ出力してください。

## ルール
- 1つ目は「商品名から判断できるカテゴリーキーワード」を出力
- ブランド名、商品名そのもの、人名、型番、カラー名は含めない
- 検索意図は汎用ワードを優先し、具体性と汎用性のバランスを取る
- 「限定」「レア」「希少」「入手困難」「話題」「大人気」などの誇張表現は禁止
- 実際の仕様・素材・用途・カテゴリに基づくキーワードのみ使用

## 出力形式
① タグキーワード用（半角カンマ区切り）
② Excel貼り付け用（1行スペース区切り）`,
};

const templateData = {
  size: [
    ["サイズ", "肩幅", "身幅", "着丈", "袖丈"],
    ["M", "54", "68", "74", "27"],
    ["L", "56", "70", "76", "28"],
    ["XL", "58", "72", "78", "29"],
    ["XXL", "60", "74", "80", "30"],
  ],
  spec: [
    ["項目", "内容"],
    ["素材", "コットン 100%"],
    ["原産国", "中国"],
    ["カラー", "BLACK / BEIGE / GREEN"],
  ],
  set: [
    ["内容", "数量"],
    ["本体", "1点"],
    ["専用ケース", "1点"],
    ["取扱説明書", "1点"],
  ],
  delivery: [
    ["配送項目", "内容"],
    ["発送目安", "ご注文から2〜4営業日"],
    ["配送方法", "宅配便"],
    ["注意事項", "地域により到着日が異なります"],
  ],
};

const tableInlineStyles = {
  table: "width: 100%; min-width: 520px; border-collapse: collapse; table-layout: fixed;",
  cell: "height: 44px; padding: 8px; border: 1px solid rgb(27 29 33 / 0.16); text-align: center; font-size: 13px; font-weight: 400;",
  heading: "height: 44px; padding: 8px; border: 1px solid rgb(27 29 33 / 0.16); text-align: center; font-size: 13px; font-weight: 620; background: #efefef;",
};

let tableState = {
  headerMode: "top-left",
  cells: structuredClone(templateData.size),
};

let tableView = "html";

function value(id) {
  return document.querySelector(`#${id}`)?.value.trim() || "";
}

function getUseCase() {
  return new FormData(form).get("useCase") || "caption";
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-show");
  }, 2200);
}

function replayTransition(element, className) {
  if (!element) return;
  element.classList.remove(className);
  window.requestAnimationFrame(() => {
    element.classList.add(className);
  });
}

function closeDialogWithAnimation(dialog) {
  if (!dialog || !dialog.open || dialog.classList.contains("is-closing")) return;
  dialog.classList.remove("is-opening");
  dialog.classList.add("is-closing");

  const handleAnimationEnd = () => {
    dialog.classList.remove("is-closing");
    dialog.close();
  };

  dialog.addEventListener("animationend", handleAnimationEnd, { once: true });
}

function switchCase(nextCase) {
  document.querySelectorAll("[data-case-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.casePanel !== nextCase;
  });

  previewTitle.textContent = cases[nextCase].label;
  statusType.textContent = cases[nextCase].label;
  statusOutput.textContent = cases[nextCase].output;
  tableViewToggle.hidden = nextCase !== "table";
  output.hidden = false;
  updateOutput();
  replayTransition(document.querySelector(`[data-case-panel="${nextCase}"]`), "is-entering");
  replayTransition(previewPane, "is-switching");
}

function getCaptionImageItems() {
  return [...captionImageList.querySelectorAll("[data-caption-image-item]")];
}

function updateCaptionImageRows() {
  const items = getCaptionImageItems();

  items.forEach((item, index) => {
    const noteLabel = item.querySelector(".prompt-builder-ec__image-note")?.closest("label");
    const removeButton = item.querySelector("[data-remove-caption-image]");

    if (noteLabel?.firstChild) {
      noteLabel.firstChild.textContent = `${index + 1}枚目補足情報`;
    }

    if (removeButton) {
      removeButton.hidden = items.length === 1;
      removeButton.setAttribute("aria-label", `${index + 1}枚目の商品画像情報を削除`);
    }
  });

  addCaptionImageBtn.disabled = items.length >= maxCaptionImages;
}

function createCaptionImageItem(index) {
  const item = document.createElement("div");
  item.className = "prompt-builder-ec__image-item";
  item.dataset.captionImageItem = "";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "ファイル名";
  const nameInput = document.createElement("input");
  nameInput.className = "prompt-builder-ec__image-name";
  nameInput.type = "text";
  nameInput.placeholder = "例: product-black-side.jpg";
  nameLabel.append(nameInput);

  const noteLabel = document.createElement("label");
  noteLabel.textContent = `${index + 1}枚目補足情報`;
  const noteTextarea = document.createElement("textarea");
  noteTextarea.className = "prompt-builder-ec__image-note";
  noteTextarea.rows = 4;
  noteTextarea.placeholder = "例: 色、角度、ディテールなど";
  noteLabel.append(noteTextarea);

  const removeButton = document.createElement("button");
  removeButton.className = "prompt-builder-ec__image-remove";
  removeButton.type = "button";
  removeButton.dataset.removeCaptionImage = "";
  removeButton.textContent = "削除";

  item.append(nameLabel, noteLabel, removeButton);
  return item;
}

function addCaptionImageItem() {
  const items = getCaptionImageItems();
  if (items.length >= maxCaptionImages) return;

  captionImageList.append(createCaptionImageItem(items.length));
  updateCaptionImageRows();
  updateOutput();
}

function resetCaptionImageItems() {
  const firstItem = getCaptionImageItems()[0] || createCaptionImageItem(0);
  firstItem.querySelector(".prompt-builder-ec__image-name").value = "";
  firstItem.querySelector(".prompt-builder-ec__image-note").value = "";
  captionImageList.replaceChildren(firstItem);
  updateCaptionImageRows();
}

function getCaptionImagesText() {
  return getCaptionImageItems()
    .map((item) => {
      const name = item.querySelector(".prompt-builder-ec__image-name")?.value.trim() || "{{ファイル名}}";
      const note = item.querySelector(".prompt-builder-ec__image-note")?.value.trim() || "{{補足情報}}";
      return `${name} / ${note}`;
    })
    .join("、");
}

function buildCaptionPrompt() {
  return [
    templates.caption,
    "",
    "# 入力情報",
    `- ブランド名: ${value("captionBrand") || "未入力"}`,
    `- 品番: ${value("captionSku") || "未入力"}`,
    `- 価格: ${value("captionPrice") || "未入力"}`,
    `- 商品画像: ${getCaptionImagesText()}`,
    "",
    "# 実行指示",
    "上記情報と添付画像をもとに、親商品情報、カラー別バリエーション情報、商品説明HTMLを生成してください。",
  ].join("\n");
}

function buildTranslationPrompt() {
  const translationTone = new FormData(form).get("translationTone") || "{{選択されたルール}}";

  return [
    templates.translation,
    "",
    "# 入力情報",
    `- ブランド名: ${value("translationBrand") || "任意 / 未入力"}`,
    `- 文体: ${translationTone}`,
    `- 補足情報: ${value("translationNotes") || "なし"}`,
    "",
    "## 【翻訳対象：英語原文】",
    value("translationSource") || "{{ここに英文を貼り付け}}",
  ].join("\n");
}

function buildTagPrompt() {
  return [
    templates.tags,
    "",
    "## 商品情報",
    `- 商品名: ${value("tagName") || "未入力"}`,
    `- 商品説明: ${value("tagDescription") || "未入力"}`,
  ].join("\n");
}

function getCellTag(rowIndex, colIndex) {
  const mode = tableState.headerMode;
  const isTop = rowIndex === 0 && (mode === "top" || mode === "top-left");
  const isLeft = colIndex === 0 && (mode === "left" || mode === "top-left");
  return isTop || isLeft ? "th" : "td";
}

function buildTableHtml() {
  const hasTopHeader =
    tableState.headerMode === "top" || tableState.headerMode === "top-left";
  const buildRows = (rows, offset = 0) => rows.map((row, index) => {
    const rowIndex = index + offset;
    const cells = row
      .map((cell, colIndex) => {
        const tag = getCellTag(rowIndex, colIndex);
        const scope =
          tag === "th"
            ? rowIndex === 0
              ? ' scope="col"'
              : ' scope="row"'
            : "";
        const style = tag === "th" ? tableInlineStyles.heading : tableInlineStyles.cell;
        return `    <${tag}${scope} style="${style}">${escapeHtml(cell)}</${tag}>`;
      })
      .join("\n");
    return `  <tr>\n${cells}\n  </tr>`;
  });

  if (hasTopHeader) {
    const head = buildRows([tableState.cells[0] || []]).join("\n");
    const body = buildRows(tableState.cells.slice(1), 1).join("\n");
    return `<table style="${tableInlineStyles.table}">\n<thead>\n${head}\n</thead>\n<tbody>\n${body}\n</tbody>\n</table>`;
  }

  return `<table style="${tableInlineStyles.table}">\n<tbody>\n${buildRows(tableState.cells).join("\n")}\n</tbody>\n</table>`;
}

function buildTablePrompt() {
  return buildTableHtml();
}

function updateOutput() {
  const current = getUseCase();
  const builders = {
    caption: buildCaptionPrompt,
    translation: buildTranslationPrompt,
    tags: buildTagPrompt,
    table: buildTablePrompt,
  };

  output.value = builders[current]();
  const isTable = current === "table";
  output.hidden = isTable && tableView === "demo";
  tablePreview.hidden = !isTable || tableView !== "demo";
  if (isTable) renderTablePreview();
}

function normalizeRows(rows, cols) {
  tableState.cells = tableState.cells.slice(0, rows);
  while (tableState.cells.length < rows) {
    tableState.cells.push(Array.from({ length: cols }, () => ""));
  }
  tableState.cells = tableState.cells.map((row) => {
    const next = row.slice(0, cols);
    while (next.length < cols) next.push("");
    return next;
  });
}

function renderTableEditor() {
  const table = document.createElement("table");
  table.className = "prompt-builder-ec__edit-table";

  tableState.cells.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell, colIndex) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.value = cell;
      input.setAttribute("aria-label", `${rowIndex + 1}行${colIndex + 1}列`);
      input.addEventListener("input", () => {
        tableState.cells[rowIndex][colIndex] = input.value;
        updateOutput();
      });
      td.append(input);
      tr.append(td);
    });
    table.append(tr);
  });

  tableEditor.replaceChildren(table);
  document.querySelector("#tableRows").value = tableState.cells.length;
  document.querySelector("#tableCols").value = tableState.cells[0]?.length || 1;
  updateOutput();
}

function renderTablePreview() {
  tablePreview.innerHTML = buildTableHtml();
}

function setTableFromInputs() {
  const rows = Number(document.querySelector("#tableRows").value) || 1;
  const cols = Number(document.querySelector("#tableCols").value) || 1;
  normalizeRows(Math.min(Math.max(rows, 1), 12), Math.min(Math.max(cols, 1), 8));
  renderTableEditor();
}

function applyTemplate(name) {
  tableState.cells = structuredClone(templateData[name]);
  tableState.headerMode = "top-left";
  document.querySelector("#headerMode").value = tableState.headerMode;
  renderTableEditor();
}

function runTableAction(action) {
  const cols = tableState.cells[0]?.length || 1;
  if (action === "add-row" && tableState.cells.length < 12) {
    tableState.cells.push(Array.from({ length: cols }, () => ""));
  }
  if (action === "add-col" && cols < 8) {
    tableState.cells.forEach((row) => row.push(""));
  }
  if (action === "remove-row" && tableState.cells.length > 1) {
    tableState.cells.pop();
  }
  if (action === "remove-col" && cols > 1) {
    tableState.cells.forEach((row) => row.pop());
  }
  if (action === "clear") {
    tableState.cells = tableState.cells.map((row) => row.map(() => ""));
  }
  renderTableEditor();
}

async function copyCurrent() {
  try {
    await navigator.clipboard.writeText(output.value);
    showToast(getUseCase() === "table" ? "HTMLをコピーしました" : "プロンプトをコピーしました");
  } catch {
    output.select();
    document.execCommand("copy");
    showToast("コピーしました");
  }
}

function resetApp() {
  form.reset();
  resetCaptionImageItems();
  tableState = {
    headerMode: "top-left",
    cells: structuredClone(templateData.size),
  };
  tableView = "html";
  document.querySelector('input[name="tableView"][value="html"]').checked = true;
  history.replaceState(null, "", location.pathname);
  renderTableEditor();
  switchCase("caption");
  showToast("初期状態に戻しました");
}

function loadFromUrl() {
  const params = new URLSearchParams(location.search);
  if (!params.size) return;

  params.forEach((paramValue, key) => {
    if (key === "useCase" || key === "table") return;
    const input = document.querySelector(`#${key}`);
    if (input) input.value = paramValue;
  });

  if (params.has("table")) {
    try {
      const parsed = JSON.parse(params.get("table"));
      if (Array.isArray(parsed.cells)) tableState = parsed;
    } catch {
      tableState = {
        headerMode: "top-left",
        cells: structuredClone(templateData.size),
      };
    }
  }

  const requestedCase = params.get("useCase");
  if (cases[requestedCase]) {
    document.querySelector(`input[name="useCase"][value="${requestedCase}"]`).checked = true;
  }
}

document.querySelectorAll("[data-modal-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.querySelector(`#${button.dataset.modalTarget}`);
    if (!dialog) return;
    dialog.showModal();
    replayTransition(dialog, "is-opening");
  });
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => {
    closeDialogWithAnimation(button.closest("dialog"));
  });
});

document.querySelectorAll(".prompt-builder-ec-modal").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialogWithAnimation(dialog);
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialogWithAnimation(dialog);
  });
});

form.addEventListener("input", updateOutput);
form.addEventListener("change", (event) => {
  if (event.target.name === "useCase") switchCase(event.target.value);
  updateOutput();
});

document.querySelector("#buildTableBtn").addEventListener("click", setTableFromInputs);
document.querySelector("#applyHeaderBtn").addEventListener("click", () => {
  tableState.headerMode = document.querySelector("#headerMode").value;
  updateOutput();
});
document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => applyTemplate(button.dataset.template));
});
document.querySelectorAll("[data-table-action]").forEach((button) => {
  button.addEventListener("click", () => runTableAction(button.dataset.tableAction));
});
document.querySelectorAll('input[name="tableView"]').forEach((input) => {
  input.addEventListener("change", () => {
    tableView = input.value;
    updateOutput();
  });
});
addCaptionImageBtn.addEventListener("click", addCaptionImageItem);
captionImageList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-caption-image]");
  if (!removeButton) return;
  removeButton.closest("[data-caption-image-item]")?.remove();
  updateCaptionImageRows();
  updateOutput();
});
document.querySelector("#copyBtn").addEventListener("click", copyCurrent);
document.querySelector("#resetBtn").addEventListener("click", resetApp);

loadFromUrl();
updateCaptionImageRows();
renderTableEditor();
switchCase(getUseCase());
