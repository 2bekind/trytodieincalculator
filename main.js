class CalculatorGame {
    constructor() {
        this.resetGame();
        this.initializeElements();
        this.initializeEventListeners();
        this.startInactivityTimer();
    }
    
    resetGame() {
        this.expression = '';
        this.result = '';
        this.equalsCount = 0;
        this.lastInputTime = Date.now();
        this.foundEndings = new Set();
        this.isGameOver = false;
        this.backspaceCount = 0; // Счетчик нажатий на backspace
        this.secretTriggered = false; // Флаг для секретной концовки
    }
    
    initializeElements() {
        this.expressionElement = document.querySelector('.expression');
        this.resultElement = document.querySelector('.result');
        this.endingOverlay = document.getElementById('endingOverlay');
        this.endingText = document.getElementById('endingText');
        this.finalOverlay = document.getElementById('finalOverlay');
        this.finalText = document.getElementById('finalText');
        
        // Элементы для секретной концовки
        this.secretOverlay = document.getElementById('secretOverlay');
        this.secretImage = document.getElementById('secretImage');
        this.secretText = document.getElementById('secretText');
        
        // Звуки
        this.clickSound = new Audio('sounds/click.wav');
        this.winSound = new Audio('sounds/win.wav');
        this.tellSound = new Audio('sounds/tell.wav');
    }
    
    initializeEventListeners() {
        // Кнопки с цифрами
        document.querySelectorAll('.btn.number').forEach(btn => {
            btn.addEventListener('click', () => this.handleNumber(btn.textContent));
        });
        
        // Операторы
        document.querySelectorAll('.btn.operator').forEach(btn => {
            btn.addEventListener('click', () => this.handleOperator(btn.textContent));
        });
        
        // Равно
        document.querySelector('.btn.equals').addEventListener('click', () => this.handleEquals());
        
        // Очистить
        document.querySelector('.btn.clear').addEventListener('click', () => this.handleClear());
        
        // Backspace
        document.querySelector('.btn.backspace').addEventListener('click', () => this.handleBackspace());
        
        // Десятичная точка
        document.querySelector('.btn.decimal').addEventListener('click', () => this.handleDecimal());
        
        // Клавиатура
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    playClickSound() {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});
    }
    
    playWinSound() {
        this.winSound.currentTime = 0;
        this.winSound.play().catch(() => {});
    }
    
    playTellSound() {
        this.tellSound.currentTime = 0;
        this.tellSound.play().catch(() => {});
    }
    
    handleNumber(num) {
        if (this.isGameOver) return;
        
        this.playClickSound();
        this.expression += num;
        this.updateDisplay();
        this.checkEnding4();
        this.lastInputTime = Date.now();
        
        // Сбрасываем счетчик backspace при вводе числа
        this.backspaceCount = 0;
    }
    
    handleOperator(op) {
        if (this.isGameOver) return;
        
        this.playClickSound();
        const symbol = op === '×' ? '*' : op === '÷' ? '/' : op;
        this.expression += symbol;
        this.updateDisplay();
        this.lastInputTime = Date.now();
        
        // Сбрасываем счетчик backspace при вводе оператора
        this.backspaceCount = 0;
    }
    
    handleEquals() {
        if (this.isGameOver) return;
        
        this.playClickSound();
        this.equalsCount++;
        
        if (this.equalsCount >= 10) {
            this.triggerEnding(3, "are you kidding me? ending 3/5");
            return;
        }
        
        try {
            // Проверяем деление на ноль
            if (this.expression.includes('/0')) {
                // Убираем пробелы для точного сравнения
                const cleanExpression = this.expression.replace(/\s/g, '');
                
                if (cleanExpression === '0/0') {
                    this.triggerEnding(1, "you win, ending 1/5");
                    return;
                } else if (cleanExpression.match(/^[1-9]\/0$/)) {
                    this.triggerEnding(2, "you win, ending 2/5");
                    return;
                }
            }
            
            // Заменяем символы для вычисления
            let evalExpression = this.expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/');
            
            this.result = eval(evalExpression).toString();
            this.updateDisplay();
            
        } catch (error) {
            this.result = 'Error';
            this.updateDisplay();
        }
        
        this.lastInputTime = Date.now();
    }
    
    handleClear() {
        if (this.isGameOver) return;
        
        this.playClickSound();
        this.expression = '';
        this.result = '';
        this.updateDisplay();
        this.lastInputTime = Date.now();
        
        // Сбрасываем счетчик backspace при очистке
        this.backspaceCount = 0;
    }
    
    handleBackspace() {
        if (this.isGameOver) return;
        
        this.playClickSound();
        this.expression = this.expression.slice(0, -1);
        this.updateDisplay();
        this.lastInputTime = Date.now();
        
        // Увеличиваем счетчик нажатий на backspace
        this.backspaceCount++;
        
        // Проверяем секретную концовку (15 нажатий)
        if (this.backspaceCount >= 15 && !this.secretTriggered) {
            this.triggerSecretEnding();
        }
    }
    
    handleDecimal() {
        if (this.isGameOver) return;
        
        this.playClickSound();
        if (!this.expression.includes('.') || this.expression.split(/[\+\-\*\/]/).pop().includes('.')) {
            this.expression += '.';
            this.updateDisplay();
        }
        this.lastInputTime = Date.now();
        
        // Сбрасываем счетчик backspace при вводе десятичной точки
        this.backspaceCount = 0;
    }
    
    handleKeydown(e) {
        if (this.isGameOver) return;
        
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.handleNumber(key);
        } else if (key === '+' || key === '-') {
            this.handleOperator(key);
        } else if (key === '*') {
            this.handleOperator('×');
        } else if (key === '/') {
            this.handleOperator('÷');
        } else if (key === 'Enter' || key === '=') {
            this.handleEquals();
        } else if (key === 'Escape') {
            this.handleClear();
        } else if (key === 'Backspace') {
            this.handleBackspace();
        } else if (key === '.') {
            this.handleDecimal();
        }
    }
    
    updateDisplay() {
        this.expressionElement.textContent = this.expression;
        this.resultElement.textContent = this.result;
    }
    
    checkEnding4() {
        // Проверяем на длинные повторяющиеся цифры
        const longNumbers = this.expression.match(/(\d)\1{7,}/g);
        if (longNumbers && longNumbers.length > 0) {
            this.triggerEnding(4, "?????? ending 4/5");
        }
    }
    
    startInactivityTimer() {
        setInterval(() => {
            if (this.isGameOver) return;
            
            const now = Date.now();
            if (now - this.lastInputTime >= 60000) { // 1 минута
                this.triggerEnding(5, "faster. ending 5/5");
            }
        }, 1000);
    }
    
    async triggerEnding(endingNumber, message) {
        if (this.foundEndings.has(endingNumber)) {
            // Показываем сообщение на калькуляторе
            this.expression = 'Already completed!';
            this.result = '';
            this.updateDisplay();
            return;
        }
        
        this.foundEndings.add(endingNumber);
        this.playWinSound();
        
        // Показываем концовку
        this.endingText.textContent = '';
        this.endingOverlay.style.display = 'flex';
        
        // Звук Undertale при появлении текста
        this.playTellSound();
        
        // Эффект печатной машинки
        await this.typewriterEffect(this.endingText, message);
        
        // Ждем 3 секунды
        await this.wait(3000);
        
        // Стираем текст
        await this.eraseEffect(this.endingText, message);
        
        // Скрываем оверлей
        this.endingOverlay.style.display = 'none';
        
        // Очищаем калькулятор после получения концовки
        this.expression = '';
        this.result = '';
        this.updateDisplay();
        
        // Проверяем, собраны ли все концовки
        if (this.foundEndings.size >= 5) {
            this.triggerFinalEnding();
        }
    }
    
    async triggerFinalEnding() {
        this.isGameOver = true;
        
        // Показываем финальный экран
        this.finalOverlay.style.display = 'flex';
        
        // Пишем "now."
        this.finalText.textContent = '';
        this.playTellSound(); // Звук Undertale
        await this.typewriterEffect(this.finalText, "now.");
        
        // Ждем 3 секунды
        await this.wait(3000);
        
        // Пишем "leave please."
        this.finalText.textContent = '';
        this.playTellSound(); // Звук Undertale
        await this.typewriterEffect(this.finalText, "leave please.");
    }
    
    async triggerSecretEnding() {
        if (this.secretTriggered) return;
        
        this.secretTriggered = true;
        this.isGameOver = true;
        
        // Скрываем все кнопки калькулятора
        const calculator = document.querySelector('.calculator');
        calculator.style.display = 'none';
        
        // Скрываем заголовок
        const title = document.querySelector('.calculator-title');
        title.style.display = 'none';
        
        // Скрываем фон с кодом
        const hackerBackground = document.querySelector('.hacker-background');
        hackerBackground.style.display = 'none';
        
        // Показываем секретный экран
        this.secretOverlay.style.display = 'flex';
        
        // Ждем 2 секунды
        await this.wait(2000);
        
        // Появляется текст "are u sure you want to delete me?" зеленым цветом
        this.secretText.textContent = '';
        this.secretText.style.color = '#00ff00';
        this.playTellSound(); // Звук Undertale
        await this.typewriterEffect(this.secretText, "are u sure you want to delete me?");
        
        // Ждем 3 секунды
        await this.wait(3000);
        
        // Пишем "now."
        this.secretText.textContent = '';
        this.playTellSound(); // Звук Undertale
        await this.typewriterEffect(this.secretText, "now.");
        
        // Ждем 2 секунды
        await this.wait(2000);
        
        // Пишем "i delete u."
        this.secretText.textContent = '';
        this.playTellSound(); // Звук Undertale
        await this.typewriterEffect(this.secretText, "i delete u.");
        
        // Ждем 2 секунды
        await this.wait(2000);
        
        // Просто скрываем текст, картинка остается на месте
        const text = this.secretText;
        text.style.opacity = '0';
        text.style.transition = 'opacity 0.5s ease';
        
        // Ждем пока текст исчезнет
        await this.wait(500);
        
        // Оставляем черный экран с картинкой навсегда
        // Чтобы убрать его, нужно перезагрузить страницу
        // Ничего не скрываем и не показываем обратно калькулятор
    }
    
    async typewriterEffect(element, text) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            
            // Проигрываем звук "tell" при каждом пробеле (новом слове)
            if (text[i] === ' ') {
                this.playTellSound();
            }
            
            await this.wait(100); // 100ms между символами
        }
    }
    
    async eraseEffect(element, text) {
        for (let i = text.length; i >= 0; i--) {
            element.textContent = text.substring(0, i);
            await this.wait(50); // 50ms между символами
        }
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Запускаем игру когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    new CalculatorGame();
});
