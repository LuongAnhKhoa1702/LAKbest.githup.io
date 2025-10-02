// Typing effect - Hiệu ứng Gõ từng chữ cái (đã tối ưu hóa và thêm Pulse)
const typing = document.getElementById("typing");
const roles = ["Nhà đầu tư Crypto ", "Sinh viên IT ", "Gamer "]; 
let i=0,j=0,current="",isDeleting=false;

function type(){
    // Đảm bảo luôn lặp lại vai trò
    if(i>=roles.length) {
        i = 0; 
    }

    // Ẩn hiệu ứng Pulse/Shake trong lúc gõ/xóa để chữ chạy mượt
    typing.classList.remove('text-pulse');

    // 1. Logic GÕ và XÓA
    if(!isDeleting && j<=roles[i].length){
        current=roles[i].substring(0,j++);
    }
    else if(isDeleting && j>=0){
        current=roles[i].substring(0,j--);
    }
    typing.textContent=current;

    // 2. Chuyển sang chế độ XÓA sau khi gõ xong. Chờ 1200ms (1.2 giây).
    if(!isDeleting && j===roles[i].length){
        isDeleting=true;
        // Thêm hiệu ứng pulse/shake khi từ đã gõ xong
        typing.classList.add('text-pulse');
        setTimeout(type, 2000); 
        return;
    } 
    
    // 3. Chuyển sang vai trò tiếp theo sau khi xóa xong (j===0).
    if(isDeleting && j===0){
        isDeleting=false;
        i=(i+1)%roles.length;
        
        // Độ trễ ngắn (80ms) trước khi bắt đầu gõ từ mới, tạo cảm giác chuyển tiếp mượt mà
        setTimeout(type, 80); 
        return;
    }

    // Tốc độ: 100ms để GÕ, 50ms để XÓA (Cực kỳ mượt và nhanh)
    setTimeout(type, isDeleting ? 70 : 90); 
}
type();

// ------------------------------------------------------------------

// --- Music Toggle (Đã sửa để thử Autoplay) ---
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");

// Thử tự động phát nhạc ngay khi tải trang
function startMusicAutoplay() {
    // 1. Dùng async/await để xử lý promise trả về từ play()
    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Nhạc được phát thành công
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicBtn.classList.add('music-toggle-spinning', 'music-playing');
        }).catch(error => {
            // Bị chặn bởi trình duyệt (Autoplay Blocked)
            console.log("Autoplay bị chặn. Yêu cầu người dùng tương tác.");
            music.pause();
            musicBtn.innerHTML = '<i class="fas fa-play"></i>';
            musicBtn.classList.remove('music-toggle-spinning', 'music-playing');
        });
    }
}

// Bắt đầu chức năng tự động phát
startMusicAutoplay();


// Hàm xử lý khi người dùng nhấn nút (vẫn cần thiết)
musicBtn.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        musicBtn.classList.add('music-toggle-spinning', 'music-playing'); 
    } else {
        music.pause();
        musicBtn.innerHTML = '<i class="fas fa-play"></i>';
        musicBtn.classList.remove('music-toggle-spinning', 'music-playing'); 
    }
});

// ------------------------------------------------------------------

// Chart
new Chart(document.getElementById("investmentChart"),{
    type:"doughnut",
    data:{
        labels:["Crypto","Khẩn cấp","Tiết kiệm"],
        datasets:[{
            data:[80,10,10],
            backgroundColor:["#00e676", "#12121e", "#555"], 
            hoverOffset: 8, 
            borderWidth: 3, 
            borderColor: '#1e1e2f' 
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true, 
                position: 'bottom',
                labels: {
                    padding: 15,
                    color: '#ccc', 
                    font: { size: 14 }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed !== null) { label += context.parsed + '%'; }
                        return label;
                    }
                }
            }
        },
        cutout: '70%', 
    }
});