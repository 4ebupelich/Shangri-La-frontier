// ========================================
// ПРАКТИЧЕСКАЯ РАБОТА №3, №4
// JavaScript для галереи и контактов
// ========================================

// ---------- УСТАНОВКА ТЕКУЩЕГО ГОДА В ФУТЕРЕ ----------
document.addEventListener('DOMContentLoaded', function() {
    // Текущий год
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    console.log('✅ Сайт "Рубеж Шангри-Ла" загружен!');
    
    // Инициализация галереи (если есть на странице)
    if (document.getElementById('image-gallery')) {
        initGallery();
    }
    
    // Инициализация формы контактов (если есть)
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
});

// ---------- ГАЛЕРЕЯ ----------
function initGallery() {
    // Подсчёт изображений
    updateImageCounter();
    
    // Настройка лайков
    setupLikes();
    
    // Переключение между сеткой и списком
    setupViewToggle();
    
    // Настройка фильтров
    setupFilters();
}

// Подсчёт изображений
function updateImageCounter() {
    const images = document.querySelectorAll('.image-card');
    const counter = document.getElementById('image-counter');
    if (counter) {
        counter.textContent = images.length;
    }
    console.log(`📸 Найдено изображений: ${images.length}`);
}

// Система лайков
function setupLikes() {
    const likeButtons = document.querySelectorAll('.like-btn');
    let totalLikesElement = document.getElementById('total-likes');
    let totalLikes = 0;
    
    // Загрузка сохранённых лайков из localStorage
    const savedLikes = JSON.parse(localStorage.getItem('shangriLikes') || '{}');
    
    likeButtons.forEach(button => {
        const id = button.getAttribute('data-id');
        const likeCountSpan = button.querySelector('.like-count');
        
        // Восстановление сохранённого состояния
        if (savedLikes[id]) {
            button.classList.add('liked');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
            likeCountSpan.textContent = savedLikes[id];
            totalLikes += savedLikes[id];
        }
        
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            let currentLikes = parseInt(likeCountSpan.textContent);
            
            if (this.classList.contains('liked')) {
                // Убираем лайк
                currentLikes--;
                totalLikes--;
                this.classList.remove('liked');
                this.querySelector('i').classList.remove('fas');
                this.querySelector('i').classList.add('far');
            } else {
                // Добавляем лайк
                currentLikes++;
                totalLikes++;
                this.classList.add('liked');
                this.querySelector('i').classList.remove('far');
                this.querySelector('i').classList.add('fas');
            }
            
            // Обновляем счётчик
            likeCountSpan.textContent = currentLikes;
            if (totalLikesElement) {
                totalLikesElement.textContent = totalLikes;
            }
            
            // Сохраняем в localStorage
            savedLikes[id] = currentLikes;
            localStorage.setItem('shangriLikes', JSON.stringify(savedLikes));
            
            // Анимация
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            console.log(`❤️ Лайков всего: ${totalLikes}`);
        });
    });
    
    if (totalLikesElement) {
        totalLikesElement.textContent = totalLikes;
    }
}

// Переключение между сеткой и списком
function setupViewToggle() {
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (gridBtn && listBtn && galleryGrid) {
        gridBtn.addEventListener('click', () => {
            galleryGrid.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });
        
        listBtn.addEventListener('click', () => {
            galleryGrid.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }
}

// Фильтрация изображений
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.image-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Обновляем активную кнопку
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            
            console.log(`🔍 Фильтр: ${filter}`);
        });
    });
}

// Модальное окно для увеличения изображения
function openModal(btn) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const img = btn.closest('.image-card').querySelector('.gallery-img');
    
    if (modal && modalImg && img) {
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
    }
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Закрытие модального окна по клику вне изображения
window.onclick = function(event) {
    const modal = document.getElementById('image-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// ---------- ФОРМА КОНТАКТОВ (ПР №4) ----------
function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const consent = document.getElementById('consent');
            
            // Очистка предыдущих сообщений об ошибках
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            if (!name.value.trim()) {
                showError(name, 'Введите ваше имя');
                isValid = false;
            }
            
            if (!email.value.trim()) {
                showError(email, 'Введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Введите корректный email');
                isValid = false;
            }
            
            if (!message.value.trim()) {
                showError(message, 'Введите сообщение');
                isValid = false;
            }
            
            if (!consent.checked) {
                showError(consent, 'Необходимо согласие на обработку данных');
                isValid = false;
            }
            
            if (isValid) {
                // Имитация отправки
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                statusDiv.style.color = '#00ffcc';
                
                setTimeout(() => {
                    statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.';
                    statusDiv.style.color = '#0fff50';
                    form.reset();
                    
                    setTimeout(() => {
                        statusDiv.innerHTML = '';
                    }, 5000);
                }, 1500);
            }
        });
        
        // Валидация в реальном времени
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    showError(this, 'Это поле обязательно для заполнения');
                } else {
                    clearError(this);
                }
            });
        });
    }
}

function showError(element, message) {
    const errorSpan = element.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.color = '#ff4757';
        errorSpan.style.fontSize = '12px';
    }
    element.style.borderColor = '#ff4757';
}

function clearError(element) {
    const errorSpan = element.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = '';
    }
    element.style.borderColor = '#00ffcc';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ---------- АНИМАЦИЯ ПРИ ПРОКРУТКЕ ----------
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.image-card, .reason-card, .faq-item');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Установка начальной прозрачности для анимации
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.image-card, .reason-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
    });
    
    // Триггер скролла для показа элементов
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});
