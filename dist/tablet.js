const grid = document.getElementById("grid");
const paginationButtons = document.querySelectorAll("#pagination button");
const urlInput = document.getElementById("url-input");
const playButton = document.getElementById("play-button");
const volumeSlider = document.getElementById("volume");
const monitorToggle = document.getElementById("monitor-toggle");

let selectedVideoId = null;
let currentPage = 1;

async function loadPage(page) {
  grid.innerHTML = "読み込み中…";
  currentPage = page;

  // ページボタンのハイライト切り替え
  paginationButtons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === page - 1);
  });

  try {
    const res = await fetch(`https://vrchat-youtube-live.fuyuvrc.workers.dev/lives?page=${page}`);
    console.log("HTTPステータス:", res.status);

    const text = await res.text(); // まず文字列として受け取る
    console.log("レスポンス本文（最初の200文字）:", text.slice(0, 200));

    const data = JSON.parse(text); // JSON.parseで変換
    if (!data.items) throw new Error("itemsフィールドがありません");

    grid.innerHTML = "";

    data.items.forEach(item => {
      const div = document.createElement("div");
      div.className = "video-item";
      div.onclick = () => selectVideo(item, div);
    
      // 1. サムネイル
      const thumb = document.createElement("img");
      thumb.className = "thumbnail";
      thumb.src = item.thumbnail;
      div.appendChild(thumb);
    
      // 2. 情報エリア全体 (アイコン + テキスト群)
      const info = document.createElement("div");
      info.className = "video-info";
    
      // --- 左側：チャンネルアイコン ---
      const channelIcon = document.createElement("img");
      channelIcon.className = "channel-icon";
      channelIcon.src = item.channelIcon || "";
      info.appendChild(channelIcon); // 直接 info に入れる
    
      // --- 右側：テキストだけをまとめるコンテナ ---
      const textContainer = document.createElement("div");
      textContainer.className = "text-container"; // CSSで追加したクラス
    
      // タイトル
      const title = document.createElement("div");
      title.className = "video-title";
      title.textContent = item.title;
      textContainer.appendChild(title);
    
      // チャンネル名（追加）
      const channelName = document.createElement("div");
      channelName.className = "channel-name";
      channelName.textContent = item.channelName; // APIから取得したチャンネル名
      textContainer.appendChild(channelName);
    
      // 開始時間
      const start = document.createElement("div");
      start.className = "video-start";
      
      const startDate = new Date(item.startTime);
      const formattedDate = startDate.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });      
      start.textContent = `${formattedDate} に配信開始`;
      textContainer.appendChild(start);
    
      // テキストコンテナを info に追加
      info.appendChild(textContainer);
    
      div.appendChild(info);
      grid.appendChild(div);
    });


  } catch (err) {
    grid.innerHTML = "エラーが発生しました";
    console.error("詳細エラー:", err);
  }
}

function selectVideo(video, div) {
  document.querySelectorAll(".video-item").forEach(d => d.classList.remove("selected"));
  div.classList.add("selected");
  selectedVideoId = video.videoId;
  urlInput.value = video.url;

  console.log("選択された動画ID:", video.videoId);
  playButton.click(); 
}

// 再生ボタン
playButton.onclick = () => {
  const url = urlInput.value;
  if (!url) return;
  console.log("再生URL:", url);
}

// 音量スライダー
volumeSlider.oninput = () => {
  const vol = volumeSlider.value;
  console.log("音量:", vol);
}

// モニターON/OFF
monitorToggle.onclick = () => {
  console.log("モニターON/OFF切替");
}

// 初期ページロード
loadPage(1);



