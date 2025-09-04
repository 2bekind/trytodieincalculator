// Скрипт для функциональности подсказок калькулятора
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы
    const howBtn = document.querySelector('.how-btn');
    const helpOverlay = document.getElementById('helpOverlay');
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    const hintOverlay = document.getElementById('hintOverlay');
    
    // Звук клика
    const clickSound = new Audio('sounds/click.wav');
    
    // Функция воспроизведения звука
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }
    
    // Показать меню помощи с подтверждением
    function showHelp() {
        playClickSound();
        helpOverlay.style.display = 'flex';
    }
    
    // Скрыть меню помощи
    function hideHelp() {
        playClickSound();
        helpOverlay.style.display = 'none';
    }
    
    // Показать подсказки
    function showHint() {
        playClickSound();
        helpOverlay.style.display = 'none';
        hintOverlay.style.display = 'flex';
    }
    
    // Скрыть подсказки
    function hideHint() {
        playClickSound();
        hintOverlay.style.display = 'none';
    }
    
    // Добавляем обработчики событий
    if (howBtn) {
        howBtn.addEventListener('click', showHelp);
    }
    
    if (yesBtn) {
        yesBtn.addEventListener('click', showHint);
    }
    
    if (noBtn) {
        noBtn.addEventListener('click', hideHelp);
    }
    
    // Закрытие по клику вне меню
    if (helpOverlay) {
        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                hideHelp();
            }
        });
    }
    
    // Закрытие подсказок по клику вне меню
    if (hintOverlay) {
        hintOverlay.addEventListener('click', (e) => {
            if (e.target === hintOverlay) {
                hideHint();
            }
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (helpOverlay.style.display === 'flex') {
                hideHelp();
            }
            if (hintOverlay.style.display === 'flex') {
                hideHint();
            }
        }
    });
});
