// Скрипт для функциональности помощи калькулятора, видео и хакерского фона
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы
    const howBtn = document.querySelector('.how-btn');
    const helpOverlay = document.getElementById('helpOverlay');
    const closeHelpBtn = document.getElementById('closeHelp');
    
    const meowBtn = document.querySelector('.meow-btn');
    const videoOverlay = document.getElementById('videoOverlay');
    const burgerVideo = document.getElementById('burgerVideo');
    
    // Звук клика
    const clickSound = new Audio('sounds/click.wav');
    
    // Функция воспроизведения звука
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }
    
    // Показать меню помощи
    function showHelp() {
        playClickSound();
        helpOverlay.style.display = 'flex';
    }
    
    // Скрыть меню помощи
    function hideHelp() {
        playClickSound();
        helpOverlay.style.display = 'none';
    }
    
    // Показать видео
    function showVideo() {
        playClickSound();
        videoOverlay.style.display = 'flex';
        burgerVideo.play();
    }
    
    // Скрыть видео
    function hideVideo() {
        videoOverlay.style.display = 'none';
        burgerVideo.pause();
        burgerVideo.currentTime = 0;
    }
    
    // Хакерский фон - динамическое обновление кода
    function updateHackerBackground() {
        const codeScroll = document.querySelector('.code-scroll');
        if (!codeScroll) return;
        
        const operations = ['+', '-', '*', '/', '^'];
        const errors = [
            '[ERROR] Division by zero detected!',
            '[ALERT] Buffer overflow in sector 0x0F3A',
            '[WARNING] Result exceeds INT32 limit!',
            '[CRITICAL] Unknown operation executed!',
            '[MATH_CORE] Infinity reached... aborting!',
            '[SYSTEM] Memory allocation failed',
            '[KERNEL] Stack overflow detected',
            '[PROCESS] Terminated due to fatal error'
        ];
        
        // Создаем случайные математические операции
        const a = Math.floor(Math.random() * 9999) + 1;
        const b = Math.floor(Math.random() * 9999) + 1;
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let result;
        try {
            switch(op) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = a / b; break;
                case '^': result = Math.pow(a, 2); break;
            }
        } catch (e) {
            result = 'ERROR';
        }
        
        // Создаем новую строку кода
        const newLine = document.createElement('div');
        newLine.className = 'code-line';
        newLine.textContent = `[CALC_TRACE] ${a} ${op} ${b} = ${result}`;
        newLine.style.color = '#00ff00';
        
        // Добавляем случайные ошибки
        if (Math.random() < 0.1) {
            const errorLine = document.createElement('div');
            errorLine.className = 'code-line';
            errorLine.textContent = errors[Math.floor(Math.random() * errors.length)];
            errorLine.style.color = '#ff0000';
            errorLine.style.textShadow = '0 0 5px #ff0000';
            codeScroll.appendChild(errorLine);
        }
        
        codeScroll.appendChild(newLine);
        
        // Удаляем старые строки для производительности
        if (codeScroll.children.length > 50) {
            codeScroll.removeChild(codeScroll.firstChild);
        }
    }
    
    // Запускаем обновление хакерского фона
    setInterval(updateHackerBackground, 200);
    
    // Добавляем обработчики событий
    if (howBtn) {
        howBtn.addEventListener('click', showHelp);
    }
    
    if (closeHelpBtn) {
        closeHelpBtn.addEventListener('click', hideHelp);
    }
    
    if (meowBtn) {
        meowBtn.addEventListener('click', showVideo);
    }
    
    // Закрытие по клику вне меню
    if (helpOverlay) {
        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                hideHelp();
            }
        });
    }
    
    // Закрытие видео по клику вне видео
    if (videoOverlay) {
        videoOverlay.addEventListener('click', (e) => {
            if (e.target === videoOverlay) {
                hideVideo();
            }
        });
    }
    
    // Автоматическое скрытие видео когда оно закончится
    if (burgerVideo) {
        burgerVideo.addEventListener('ended', hideVideo);
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (helpOverlay.style.display === 'flex') {
                hideHelp();
            }
            if (videoOverlay.style.display === 'flex') {
                hideVideo();
            }
        }
    });
});
