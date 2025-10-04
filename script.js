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

// --- Music Toggle (Giữ nguyên) ---
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");

function startMusicAutoplay() {
    const playPromise = music.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicBtn.classList.add('music-toggle-spinning', 'music-playing');
        }).catch(error => {
            console.log("Autoplay bị chặn. Yêu cầu người dùng tương tác.");
            music.pause();
            musicBtn.innerHTML = '<i class="fas fa-play"></i>';
            musicBtn.classList.remove('music-toggle-spinning', 'music-playing');
        });
    }
}
startMusicAutoplay();

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

// Chart (Giữ nguyên)
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
// ==================================================================
// ==================================================================
// ## HIỆU ỨNG PHÁO HOA BÙNG NỔ CHẬM (CẬP NHẬT ĐỘ RÕ)
// ==================================================================
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const center = { x: canvas.width / 2, y: canvas.height / 2 };
const GRAVITY = 0.02; 
const FIREWORK_COLORS = [
    '#00e676', // Màu neon xanh lá cây (chủ đạo)
    '#FF6347', // Đỏ cam
    '#6A5ACD', // Xanh tím than
    '#FFD700', // Vàng
    '#ADFF2F', // Xanh lá chanh
    '#1E90FF', // Xanh dương
    '#FF1493'  // Hồng
];
const MAX_PARTICLES_PER_EXPLOSION = 80; // Tăng lên 80 hạt

function random(min, max) {
    return Math.random() * (max - min) + min;
}

let fireworks = [];
let particles = []; 
let stars = [];
let shootingStars = [];

// Hàm tạo pháo hoa mới
function createFirework(targetX, targetY) {
    const startX = random(canvas.width * 0.1, canvas.width * 0.9); 
    fireworks.push(new Firework(startX, targetX, targetY));
}


// Lớp Particle (Tàn dư pháo hoa sau khi nổ)
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = random(0.5, 1.5);
        this.alpha = 1; 
        this.decay = random(0.005, 0.015); 
        
        const angle = random(0, Math.PI * 2);
        const speed = random(1, 3);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.drag = 0.98; 
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10; 
        
        ctx.fill();
        ctx.closePath();
        
        ctx.restore();
        ctx.shadowBlur = 0; 
    }

    update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += GRAVITY;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.decay;
        
        this.draw();
    }
}


// Lớp Firework (Tên lửa bay lên)
class Firework {
    constructor(startX, endX, endY) {
        this.x = startX;
        this.y = canvas.height; 
        this.endX = endX;
        this.endY = endY;
        this.color = FIREWORK_COLORS[Math.floor(random(0, FIREWORK_COLORS.length))];
        this.rocketColor = '#FFFFFF'; 
        
        this.speed = random(5, 7); 
        const angle = Math.atan2(endY - canvas.height, endX - startX);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = 1;
        
        // Vẽ vệt sáng/khói phía sau tên lửa
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 1.5, this.y - this.vy * 1.5); 
        ctx.strokeStyle = `rgba(255, 255, 255, ${random(0.3, 0.6)})`; 
        ctx.lineWidth = random(2, 4); // Tăng độ dày
        ctx.stroke();
        
        // Vẽ thân tên lửa (hình tròn lớn hơn)
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2, false); // Tăng kích thước từ 1.5 lên 2.5
        ctx.fillStyle = this.rocketColor;
        
        ctx.shadowColor = this.rocketColor;
        ctx.shadowBlur = 15;
        
        ctx.fill();
        ctx.closePath();
        
        ctx.restore();
    }
    
    update() {
        this.vy += GRAVITY * 0.5; 
        this.x += this.vx;
        this.y += this.vy;
        
        // Nổ khi bay qua đích hoặc đạt gần đích
        if (this.y <= this.endY || this.vy > 0) { 
            this.explode();
            return true; // Báo hiệu đã nổ
        }
        
        this.draw();
        return false;
    }
    
    explode() {
        for (let i = 0; i < MAX_PARTICLES_PER_EXPLOSION; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
        }
    }
}

// Lớp Star (sao tĩnh) (Giữ nguyên)
class Star {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Lớp ShootingStar (sao băng) (Giữ nguyên)
class ShootingStar {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.trailLength = random(20, 50); 
        this.trailColor = 'rgba(255, 255, 255, 0.6)';
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        for (let i = 0; i < this.trailLength; i++) {
            const opacity = (1 - i / this.trailLength) * this.alpha;
            ctx.beginPath();
            ctx.arc(
                this.x - this.velocity.x * i * 0.5, 
                this.y - this.velocity.y * i * 0.5, 
                this.radius * (1 - i / this.trailLength * 0.5), 
                0, Math.PI * 2, false
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        ctx.restore();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02; 
    }
}

// Khởi tạo tất cả
function init() {
    fireworks = [];
    particles = [];
    stars = [];
    shootingStars = [];
    
    for (let i = 0; i < 300; i++) { 
        const radius = random(0.2, 1.8);
        const x = random(0, canvas.width);
        const y = random(0, canvas.height);
        stars.push(new Star(x, y, radius, 'white'));
    }

    // BẮN PHÁO HOA ĐẦU TIÊN KHI TẢI TRANG
    createFirework(center.x, canvas.height * 0.3);
}

function animate() {
    requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(10, 10, 25, 0.08)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.draw();
    });
    
    for (let i = fireworks.length - 1; i >= 0; i--) {
        if (fireworks[i].update()) {
            fireworks.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= particles[i].decay) {
            particles.splice(i, 1);
        }
    }

    shootingStars.forEach((ss, index) => {
        ss.update();
        if (ss.alpha <= 0) {
            shootingStars.splice(index, 1);
        }
    });
}

// TẠO PHÁO HOA KHI NHẤP CHUỘT
canvas.addEventListener('click', (event) => {
    const targetX = event.clientX;
    const targetY = event.clientY;

    const distToCenter = Math.hypot(targetX - center.x, targetY - center.y);
    if (distToCenter > center.x / 4) { // Kích hoạt nếu nhấp chuột ngoài vùng 1/4 trung tâm
        createFirework(targetX, targetY);
    }
});

// TỰ ĐỘNG BẮN PHÁO HOA
setInterval(() => {
    let targetX = random(0, canvas.width);
    let targetY = random(0, canvas.height * 0.7); 

    const distToCenter = Math.hypot(targetX - center.x, targetY - center.y);
    if (distToCenter > center.x / 4) { 
        createFirework(targetX, targetY);
    }
}, random(100, 300)); 


// Tạo sao băng ngẫu nhiên (Giữ nguyên logic)
setInterval(() => {
    const radius = random(1.5, 3); 
    const startEdge = Math.floor(random(0, 4)); 
    let x, y, velX, velY;

    switch (startEdge) {
        case 0: 
            x = random(0, canvas.width);
            y = -radius;
            velX = random(-1, 1);
            velY = random(2, 4);
            break;
        case 1: 
            x = canvas.width + radius;
            y = random(0, canvas.height);
            velX = random(-4, -2);
            velY = random(-1, 1);
            break;
        case 2: 
            x = random(0, canvas.width);
            y = canvas.height + radius;
            velX = random(-1, 1);
            velY = random(-4, -2);
            break;
        case 3: 
            x = -radius;
            y = random(0, canvas.height);
            velX = random(2, 4);
            velY = random(-1, 1);
            break;
    }
    
    shootingStars.push(new ShootingStar(x, y, radius, 'white', { x: velX, y: velY }));
}, 500); 

// Cập nhật lại canvas khi thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center.x = canvas.width / 2;
    center.y = canvas.height / 2;
    init(); 
});

// Chạy khởi tạo và vòng lặp animate
init(); 
animate();
// ==================================================================
// ==================================================================
// ... (Giữ nguyên các logic Typing, Music, Chart, Planets, Stars, Fireworks) ...

// ==================================================================
// ## HIỆU ỨNG NỀN QUÉT DỮ LIỆU CCCD (SCANNING DATA LINES)
// ==================================================================
// ... (các code khác giữ nguyên)

// ==================================================================
// ## HIỆU ỨNG NỀN QUÉT DỮ LIỆU CCCD (SCANNING DATA LINES)
// ==================================================================
const cccdCanvas = document.getElementById('cccd-background-canvas');

if (cccdCanvas) {
    const gctx = cccdCanvas.getContext('2d');
    let scanOffset = 0;
    const SCAN_SPEED = 0.8; // Tốc độ quét (0.5 -> 0.8)
    const LINE_WIDTH = 3; // Độ dày của thanh quét (2 -> 3)

    function resizeCCCDScan() {
        const parentSection = document.getElementById('personal-info');
        if (!parentSection) return;

        cccdCanvas.width = parentSection.clientWidth;
        cccdCanvas.height = parentSection.clientHeight;
    }

    function drawCCCDScan() {
        gctx.clearRect(0, 0, cccdCanvas.width, cccdCanvas.height);
        
        // Cập nhật vị trí quét (dịch chuyển theo chiều dọc)
        scanOffset += SCAN_SPEED;
        if (scanOffset > cccdCanvas.height * 2) {
            scanOffset = 0; // Quay lại đầu
        }

        // Vẽ các thanh quét dữ liệu
        for (let i = 0; i < 5; i++) {
            // Tính toán vị trí Y của thanh quét
            const y = (scanOffset - i * cccdCanvas.height / 3) % (cccdCanvas.height * 2);
            if (y > cccdCanvas.height + LINE_WIDTH) continue;

            // Tính toán độ mờ (alpha) và chiều rộng thanh quét ngẫu nhiên
            const alpha = 0.08 * (5 - i); // TĂNG ALPHA (0.05 -> 0.08)
            
            gctx.save();
            gctx.globalAlpha = alpha;
            gctx.fillStyle = '#00ff88'; // Thay đổi màu neon sáng hơn
            
            // Vẽ thanh quét (hình chữ nhật)
            gctx.fillRect(0, y, cccdCanvas.width, LINE_WIDTH);

            // Thêm hiệu ứng Glow cho thanh đầu tiên
            if (i === 0) {
                gctx.shadowColor = '#00e676';
                gctx.shadowBlur = 15; // TĂNG BLUR (10 -> 15)
                gctx.fillRect(0, y, cccdCanvas.width, LINE_WIDTH + 1);
            }

            gctx.restore();
        }

        requestAnimationFrame(drawCCCDScan);
    }

    // ... (Giữ nguyên các hàm khởi tạo và resize) ...
}
// ------------------------------------------------------------------
    // Bắt sự kiện resize
    window.addEventListener('resize', resizeCCCDScan);

    // Chạy khởi tạo và vẽ
    resizeCCCDScan();
    drawCCCDScan();

// ------------------------------------------------------------------

// ... (Giữ nguyên phần khởi tạo init().then(() => { animate(); }); ở cuối file) ...
// script.js

// ... (Các code hiện có, bao gồm cả hiệu ứng CCCD Scanning) ...

// ==================================================================
// ## HIỆU ỨNG NỀN MẠCH ĐIỆN TỬ (ELECTRIC CIRCUIT LINES)
// script.js

// ... (Giữ nguyên các code khác, bao gồm cả hiệu ứng CCCD Scanning) ...

// ==================================================================
// script.js

// ... (Giữ nguyên các code khác, bao gồm cả hiệu ứng CCCD Scanning) ...

// ==================================================================
// ## HIỆU ỨNG NỀN MẠNG LƯỚI HẠT TƯƠNG TÁC (INTERACTIVE PARTICLE NETWORK)
// ## Dành cho Section Education (Bắt mắt hơn)
// ==================================================================
const particleCanvas = document.getElementById('particle-network-canvas');

if (particleCanvas) {
    const pctx = particleCanvas.getContext('2d');
    let width, height;
    const particles = [];
    const NUM_PARTICLES = 100; // Số lượng hạt (có thể tăng lên 150-200 nếu muốn dày đặc hơn)
    const PARTICLE_SIZE = 2;   // Kích thước hạt
    const LINE_DISTANCE = 120; // Khoảng cách tối đa để các hạt nối với nhau bằng đường
    const MOUSE_RADIUS = 150;  // Bán kính tương tác với chuột

    let mouse = { x: null, y: null, active: false };

    // Lớp mô tả một hạt
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.speedX = (Math.random() - 0.5) * 1.5; // Tốc độ di chuyển ngẫu nhiên
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.size = PARTICLE_SIZE;
            this.color = '#00ff88'; // Màu xanh neon
        }

        // Cập nhật vị trí hạt
        update() {
            // Xử lý khi hạt chạm biên
            if (this.x + this.size > width || this.x - this.size < 0) {
                this.speedX *= -1;
            }
            if (this.y + this.size > height || this.y - this.size < 0) {
                this.speedY *= -1;
            }

            this.x += this.speedX;
            this.y += this.speedY;
        }

        // Vẽ hạt
        draw() {
            pctx.beginPath();
            pctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pctx.fillStyle = this.color;
            
            // Thêm chút glow cho hạt
            pctx.shadowColor = '#00e676';
            pctx.shadowBlur = 5; 

            pctx.fill();
            pctx.shadowBlur = 0; // Reset shadow để không ảnh hưởng đến đường nối
        }
    }

    // Hàm thay đổi kích thước canvas
    function resizeParticleNetwork() {
        const parentSection = document.getElementById('education');
        if (!parentSection) return;

        width = particleCanvas.width = parentSection.clientWidth;
        height = particleCanvas.height = parentSection.clientHeight;

        // Khởi tạo lại các hạt nếu canvas resize (hoặc lần đầu)
        particles.length = 0; // Xóa hạt cũ
        for (let i = 0; i < NUM_PARTICLES; i++) {
            particles.push(new Particle());
        }
    }

    // Hàm nối các hạt bằng đường
    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                // Tính khoảng cách giữa hai hạt
                const dist = Math.sqrt(
                    (particles[a].x - particles[b].x) ** 2 + 
                    (particles[a].y - particles[b].y) ** 2
                );

                if (dist < LINE_DISTANCE) {
                    pctx.beginPath();
                    pctx.strokeStyle = `rgba(0, 230, 118, ${1 - (dist / LINE_DISTANCE)})`; // Độ trong suốt giảm dần
                    pctx.lineWidth = 1;
                    pctx.moveTo(particles[a].x, particles[a].y);
                    pctx.lineTo(particles[b].x, particles[b].y);
                    pctx.stroke();
                }
            }
        }
        
        // Nối hạt với chuột (nếu chuột đang hoạt động)
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
            for (let i = 0; i < particles.length; i++) {
                const distToMouse = Math.sqrt(
                    (particles[i].x - mouse.x) ** 2 + 
                    (particles[i].y - mouse.y) ** 2
                );
                
                if (distToMouse < MOUSE_RADIUS) {
                    pctx.beginPath();
                    pctx.strokeStyle = `rgba(0, 230, 118, ${1 - (distToMouse / MOUSE_RADIUS) * 0.8})`; 
                    pctx.lineWidth = 1;
                    pctx.moveTo(particles[i].x, particles[i].y);
                    pctx.lineTo(mouse.x, mouse.y);
                    pctx.stroke();
                }
            }
        }
    }

    // Hàm vẽ chính
    function animateParticles() {
        pctx.clearRect(0, 0, width, height); // Xóa toàn bộ canvas mỗi frame
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles(); // Vẽ đường nối giữa các hạt

        requestAnimationFrame(animateParticles);
    }

    // Xử lý sự kiện chuột để tương tác
    particleCanvas.addEventListener('mousemove', (event) => {
        const rect = particleCanvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        mouse.active = true;
    });

    particleCanvas.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    // Lắng nghe sự kiện resize và khởi tạo
    window.addEventListener('resize', resizeParticleNetwork);
    resizeParticleNetwork();
    animateParticles();
}
// ------------------------------------------------------------------