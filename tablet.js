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
    const data = await res.json();

    grid.innerHTML = "";

    data.items.forEach(item => {
      const div = document.createElement("div");
      div.className = "video-item";
      div.onclick = () => selectVideo(item, div);

      const thumb = document.createElement("img");
      thumb.className = "thumbnail";
      thumb.src = item.thumbnail;
      div.appendChild(thumb);

      const info = document.createElement("div");
      info.className = "video-info";

      const channelRow = document.createElement("div");
      channelRow.className = "channel-row";
      const channelIcon = document.createElement("img");
      channelIcon.className = "channel-icon";
      channelIcon.src = item.channelIcon || ""; // Workersにチャンネルアイコン追加してもOK
      channelRow.appendChild(channelIcon);

      const title = document.createElement("div");
      title.className = "video-title";
      title.textContent = item.title;
      channelRow.appendChild(title);

      info.appendChild(channelRow);

      const start = document.createElement("div");
      start.className = "video-start";
      start.textContent = new Date(item.startTime).toLocaleString();
      info.appendChild(start);

      div.appendChild(info);

      grid.appendChild(div);
    });

  } catch (err) {
    grid.innerHTML = "エラーが発生しました";
    console.error(err);
  }
}

function selectVideo(video, div) {
  document.querySelectorAll(".video-item").forEach(d => d.classList.remove("selected"));
  div.classList.add("selected");
  selectedVideoId = video.videoId;
  urlInput.value = video.url;

  // モニター再生イベント（Udonと連携可能）
  console.log("選択された動画ID:", video.videoId);
}

// 再生ボタン
playButton.onclick = () => {
  const url = urlInput.value;
  console.log("再生URL:", url);
  // ここでUdonに送信してモニター再生可能
}

// 音量スライダー
volumeSlider.oninput = () => {
  const vol = volumeSlider.value;
  console.log("音量:", vol);
  // Udonでモニター音量変更可能
}

// モニターON/OFF
monitorToggle.onclick = () => {
  console.log("モニターON/OFF切替");
  // Udonで切替処理
}

// 初期ページロード
loadPage(1);
