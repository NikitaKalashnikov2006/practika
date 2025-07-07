// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Функция для установки данных пользователя
function setUserData() {
  const user = tg.initDataUnsafe.user;
  if (user) {
    // Устанавливаем аватар
    const avatarContainer = document.querySelector('.user-avatar');
    if (user.photo_url) {
      avatarContainer.src = user.photo_url;
    } else {
      // Заглушка, если фото нет
      avatarContainer.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }
    
    // Устанавливаем имя пользователя
    const userNameElement = document.querySelector('.userName');
    if (user.username) {
      userNameElement.textContent = `@${user.username}`;
    } else if (user.first_name || user.last_name) {
      userNameElement.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    } else {
      userNameElement.textContent = 'Пользователь';
    }
  }
}

// Обновляем функцию loadPage
async function loadPage(page) {
  try {
    const response = await fetch(`${page}.html`);
    const html = await response.text();
    const content = document.getElementById("content");
    
    // Анимация перехода
    content.style.opacity = 0;
    setTimeout(() => {
      content.innerHTML = html;
      content.style.opacity = 1;
      
      // Обновляем активную кнопку
      updateActiveButton(page);
      
      // Добавляем обработчики для элементов страницы
      addPageHandlers();
      
      // Устанавливаем данные пользователя для главной страницы
      if (page === 'home') {
        setUserData();
      }
    }, 150);
    
    // Обновляем URL
    history.pushState({ page }, "", `#${page}`);

  } catch (error) {
    console.error("Ошибка загрузки страницы:", error);
    document.getElementById("content").innerHTML = `
      <div class="page">
        <h2>Ошибка 404</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Функция для обновления активной кнопки
function updateActiveButton(page) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Функция для добавления обработчиков элементов страницы
function addPageHandlers() {
  // Обработчик кнопки "Пригласить друга"
  const inviteBtn = document.getElementById('inviteFriend');
  if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
      document.getElementById('inviteModal').style.display = 'flex';
    });
  }

  // Обработчики для модального окна
  const sendInviteBtn = document.getElementById('sendInviteBtn');
  if (sendInviteBtn) {
    sendInviteBtn.addEventListener('click', () => {
      document.getElementById('inviteModal').style.display = 'none';
      shareReferralLink();
    });
  }

  const copyInviteBtn = document.getElementById('copyInviteBtn');
  if (copyInviteBtn) {
    copyInviteBtn.addEventListener('click', copyReferralLink);
  }

  // Закрытие модального окна при клике вне его
  const modal = document.getElementById('inviteModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Загрузка списка рефералов
  loadReferralsList();

  // Обработчики для кнопок уроков
  document.querySelectorAll('.lesson-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lesson = this.dataset.lesson;
      loadLesson(lesson + '.html');
    });
  });

  // Обработчик кнопки "Назад" в уроках
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      loadPage('lessons');
    });
  }

 // Инициализация TonConnectUI
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://nikitakalashnikov2006.github.io/shop/manifest-tonconnect.json',
            buttonRootId: 'ton-connect',
            uiOptions: {
            twaReturnUrl: 'https://t.me/Business_shop_bot/App'
            }
        });

        // Элементы DOM
        const sendBtn = document.getElementById('send-btn');
        const amountInput = document.getElementById('amount');
        const amountError = document.getElementById('amount-error');

        // Функция проверки валидности числа
        function isValidNumber(value) {
            if (value === '' || value === '.') return false;
            
            // Проверяем, что это число и оно больше 0
            const num = parseFloat(value);
            return !isNaN(num) && isFinite(num) && num > 0;
        }

        // Функция обновления состояния кнопки
        function updateButtonState() {
            const isConnected = !!tonConnectUI.wallet;
            const isValid = isValidNumber(amountInput.value);
            
            sendBtn.disabled = !isConnected || !isValid;
        }

        // Обработчик ввода для форматирования и валидации
        amountInput.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Форматируем ввод
            value = value
                .replace(/[^0-9.,]/g, '') // Удаляем все кроме цифр и .,
                .replace(/,/g, '.'); // Заменяем запятые на точки
            
            // Удаляем лишние точки (оставляем только первую)
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            // Обновляем значение в поле ввода
            e.target.value = value;
            
            // Валидация
            if (isValidNumber(value)) {
                amountInput.classList.remove('error');
                amountError.style.display = 'none';
            } else {
                amountInput.classList.add('error');
                amountError.style.display = 'block';
            }
            
            updateButtonState();
        });

        // Подписываемся на изменения состояния подключения
        tonConnectUI.onStatusChange((wallet) => {
            updateButtonState();
        });

        // Обработчик клика по кнопке отправки
        sendBtn.addEventListener('click', async () => {
            const amount = parseFloat(amountInput.value);
            
            // Дополнительная проверка перед отправкой
            if (!isValidNumber(amountInput.value)) {
                amountInput.classList.add('error');
                amountError.style.display = 'block';
                return;
            }

            // Конвертируем TON в наноТоны (1 TON = 10^9 наноТонов)
            const nanotons = Math.round(amount * 1000000000).toString();

            try {
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 300, // 5 минут
                    messages: [
                        {
                            address: "0QD0LFy2lUH2LXI6y9-Xl9Ao6ZkEdgwpd-91V828VVFGrCzG",
                            amount: nanotons
                        }
                    ]
                };

                await tonConnectUI.sendTransaction(transaction);
            } catch (error) {
                console.error('Transaction error:', error);
            }
        });

        // Инициализация состояния при загрузке
        updateButtonState();
        amountInput.dispatchEvent(new Event('input'));

}

// Новая функция для загрузки уроков
async function loadLesson(lessonFile) {
  try {
    const response = await fetch(lessonFile);
    const html = await response.text();
    const content = document.getElementById("content");
    
    content.style.opacity = 0;
    setTimeout(() => {
      content.innerHTML = html;
      content.style.opacity = 1;
      addPageHandlers(); // Добавляем обработчики снова
    }, 150);
    
  } catch (error) {
    console.error("Ошибка загрузки урока:", error);
    document.getElementById("content").innerHTML = `
      <div class="page">
        <h2>Ошибка загрузки урока</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Функция для открытия диалога отправки приглашения
function shareReferralLink() {
  try {
    const tg = window.Telegram.WebApp;
    
    if (!tg?.openTelegramLink) {
      throw new Error('Telegram WebApp API не доступен');
    }

    const userId = tg.initDataUnsafe.user?.id || '0';
    const botUsername = 'Business_shop_bot';
    const appName = 'test';
    
    // Формируем две разные ссылки:
    const refLink = `https://t.me/${botUsername}/${appName}?startapp=ref_${userId}`;
    const shareText = `🚀 Присоединяйся к проекту!`;
    
    // Специальная ссылка для выбора чата
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(shareText)}`;
    
    console.log('Отправляем ссылку:', shareUrl);
    
    // Основной рабочий метод
    tg.openTelegramLink(shareUrl);
    
  } catch (error) {
    console.error('Ошибка:', error);
    tg.showAlert(`Скопируйте ссылку вручную:\nhttps://t.me/${botUsername}?start=ref_${userId}`);
  }
}

// Функция для копирования реферальной ссылки
function copyReferralLink() {
  try {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe.user?.id || '0';
    const botUsername = 'Business_shop_bot';
    const appName = 'test';
    const refLink = `https://t.me/${botUsername}/${appName}?startapp=ref_${userId}`;
    
    // Используем Clipboard API, если доступен
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refLink).then(() => {
        showCopiedNotification();
      }).catch(err => {
        console.error('Ошибка копирования:', err);
        fallbackCopy(refLink);
      });
    } else {
      fallbackCopy(refLink);
    }
    
    document.getElementById('inviteModal').style.display = 'none';
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// Фолбэк для копирования, если Clipboard API не доступен
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showCopiedNotification();
  } catch (err) {
    console.error('Ошибка при копировании:', err);
  }
  
  document.body.removeChild(textarea);
}

// Функция для показа уведомления "Скопировано!"
function showCopiedNotification() {
  const notification = document.createElement('div');
  notification.textContent = 'Скопировано!';
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = 'rgba(103, 181, 35, 0.9)';
  notification.style.color = 'black';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '20px';
  notification.style.zIndex = '1001';
  notification.style.fontWeight = 'bold';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  
  document.body.appendChild(notification);
  
  // Автоматическое скрытие через 2 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 2000);
}


// Функция для загрузки списка рефералов
function loadReferralsList() {
  const referralsContainer = document.getElementById('referralsContainer');
  if (!referralsContainer) return;

  // Здесь должен быть запрос к вашему бэкенду для получения списка рефералов
  // Пример статических данных для демонстрации:
  const referrals = [
    /*{ username: 'user1', profit: 15.50 },
    { username: 'user2', profit: 8.20 },
    { username: 'user3', profit: 3.75 },
    { username: 'user4', profit: 3.75 },
    { username: 'user5', profit: 3.75 },
    { username: 'user6', profit: 3.75 },
    { username: 'user7', profit: 3.75 },
    { username: 'user8', profit: 3.75 },
    { username: 'user9', profit: 3.75 },
    { username: 'user9', profit: 3.75 }*/
  ];

  // Очищаем контейнер
  referralsContainer.innerHTML = '';

  if (referrals.length === 0) {
    referralsContainer.innerHTML = '<div class="empty-list">Пока нет приглашённых друзей</div>';
    return;
  }

  // Добавляем рефералов в список
  referrals.forEach(ref => {
    const referralItem = document.createElement('div');
    referralItem.className = 'referral-item';
    referralItem.innerHTML = `
      <span class="referral-username">@${ref.username}</span>
      <span class="referral-profit">+${ref.profit.toFixed(2)}</span>
    `;
    referralsContainer.appendChild(referralItem);
  });

  // Обновляем статистику
  updateReferralStats(referrals);
}

// Функция для обновления статистики
function updateReferralStats(referrals) {
  const totalReferrals = referrals.length;
  const totalProfit = referrals.reduce((sum, ref) => sum + ref.profit, 0);
  
  const statItems = document.querySelectorAll('.stat-item .stat-value');
  if (statItems.length >= 2) {
    statItems[0].textContent = totalReferrals;
    statItems[1].textContent = totalProfit.toFixed(2);
  }
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
  // Развертываем WebApp на весь экран
  tg.expand();
  
  // Всегда загружаем главную страницу, независимо от хэша в URL
  loadPage("home");
  history.replaceState({ page: "home" }, "", "#home");

  // Обработчики для кнопок навигации
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      loadPage(page);
    });
  });
});

// Обработка кнопки "Назад"
window.addEventListener("popstate", (e) => {
  if (e.state?.page) {
    loadPage(e.state.page);
  }
});
