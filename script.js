// --- KẾT NỐI FILE GIAO DIỆN ---
const timeDisplay = document.getElementById('time-left');
const statusText = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const ytLinkInput = document.getElementById('yt-link');       // <- TRỢ THỦ 1: Ô nhập link
const ytVolumeSlider = document.getElementById('yt-volume');  // <- TRỢ THỦ 2: Mụn gạt âm thanh

let workMinutes = 25;   
let breakMinutes = 5;   
let totalSeconds = workMinutes * 60;
let isWorking = true;   
let isRunning = false;  
let timerInterval = null; 

// Nhạc Chuông Cố Định 2s lúc hết giờ
const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'); 

// ==========================================
// KỸ THUẬT SIÊU HẠNG: YOUTUBE API TẶNG KÈM
// ==========================================
let ytPlayer; 
let currentVideoId = ""; 

// Bước 1: Âm thầm kéo mã nguồn của Youtube vào trang Web
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Bước 2: Youtube chui vào tổ xong sẽ Tự Ra Mắt qua hàm này. (Gắn cái tổ cho the div tàng hình)
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '0',  // Ẩn chiều cao
        width: '0',   // Ẩn chiều dài
        videoId: '',  // Rỗng từ đầu
        playerVars: { 'autoplay': 0, 'controls': 0 }
    });
}

// Hàm này như cái nhíp gắp đồ, lôi đúng mã số ID từ link dài khùng điên
function extractVideoID(url) {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null; // Mã youtube luôn đúng giới hạn 11 Ký Tự
}

// Xử lý Cục Tròn Bấm Chuột (Thanh Gạt lướt âm lượng)
ytVolumeSlider.addEventListener('input', function() {
    if (ytPlayer && ytPlayer.setVolume) {
        // Lấy con số % của thanh gạt vặn thẳng vào Youtube
        ytPlayer.setVolume(this.value); 
    }
});
// ==========================================

function updateDisplay() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timeDisplay.textContent = `${minutes}:${seconds}`; 
}

function timerTick() {
    if (totalSeconds > 0) {
        totalSeconds--;
        updateDisplay();
    } else {
        // HẾT GIỜ!
        clearInterval(timerInterval); 
        isRunning = false;
        startBtn.textContent = "BẮT ĐẦU";
        
        // Ép anh Youtube tắt ngay lập tức
        if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo(); 
        
        alarmSound.play(); // Gõ chuông báo thức
        
        if (isWorking) {
            isWorking = false;
            totalSeconds = breakMinutes * 60;
            statusText.textContent = "🍵 THỜI GIAN NGHỈ NGƠI"; 
            statusText.style.color = "#4CAF50"; 
            new Notification("Báo Động Pomodoro", {body: "Đã hết giờ làm việc! Đứng lên vươn vai ngay bạn nhé."});
        } else {
            isWorking = true;
            totalSeconds = workMinutes * 60;
            statusText.textContent = "⚡ THỜI GIAN TẬP TRUNG";
            statusText.style.color = "#E94560"; 
            new Notification("Sẵn Sàng!", {body: "Nghỉ thế đủ rồi! Quay lại Code thôi."});
        }
        updateDisplay(); 
    }
}

startBtn.addEventListener('click', () => {
    if (alarmSound.paused) { alarmSound.play().then(() => alarmSound.pause()).catch(e => {}); alarmSound.currentTime = 0; }

    if (isRunning) {
        clearInterval(timerInterval); 
        isRunning = false;
        startBtn.textContent = "TIẾP TỤC";
        
        // Tắt nhạc YTB khi đi tiểu, uống nước sớm
        if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
    } else {
        isRunning = true;
        startBtn.textContent = "TẠM DỪNG";
        timerInterval = setInterval(timerTick, 1000); 
        
        // Khi BẮT ĐẦU: Nhờ Youtube cất giọng
        if (isWorking && ytPlayer) {
            let inputUrl = ytLinkInput.value.trim();
            let newVideoId = extractVideoID(inputUrl);

            if (newVideoId) { // Nếu cái link bạn dán có vẻ uy tín và đúng chuẩn
                if (newVideoId !== currentVideoId) {
                    currentVideoId = newVideoId;
                    ytPlayer.loadVideoById(currentVideoId); // Nhét Băng Vô Máy Youtube
                } else {
                    ytPlayer.playVideo(); // Ấn Play cục băng cũ nếu bị Tạm dừng
                }
                ytPlayer.setVolume(ytVolumeSlider.value); // Khớp mức âm lượng đã chỉnh
            }
        }
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    isWorking = true;
    totalSeconds = workMinutes * 60;
    statusText.textContent = "⚡ THỜI GIAN TẬP TRUNG";
    statusText.style.color = "#E94560";
    startBtn.textContent = "BẮT ĐẦU";
    
    if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
    updateDisplay();
});

updateDisplay();
if (Notification.permission !== "granted") { Notification.requestPermission(); }
