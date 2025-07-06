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

// Функция для добавления обработчиков элементов страницы
// Функция для добавления обработчиков элементов страницы
function addPageHandlers() {
  // Обработчик кнопки "Пригласить друга"
  const inviteBtn = document.getElementById('inviteFriend');
  if (inviteBtn) {
    inviteBtn.addEventListener('click', shareReferralLink);
  }

  // Загрузка списка рефералов
  loadReferralsList();
}

// Функция для открытия диалога отправки приглашения
function shareReferralLink() {
  const tg = window.Telegram.WebApp;
  
  // Проверяем инициализацию WebApp
  if (!tg) {
    console.error('Telegram WebApp не инициализирован');
    alert('Ошибка: Telegram WebApp не инициализирован');
    return;
  }

  // Проверяем данные пользователя
  if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
    console.error('Данные пользователя не доступны');
    alert('Ошибка: данные пользователя не доступны');
    return;
  }

  const userId = tg.initDataUnsafe.user.id;
  const botUsername = 'Business_shop_bot'; // Ваш бот
  const appName = 'test'; // Название приложения
  
  // Формируем правильную реферальную ссылку для Telegram
  const referralLink = `https://t.me/${botUsername}?start=ref_${userId}`;
  
  const message = `🚀 Привет! Присоединяйся к моему проекту и начни зарабатывать!\n\nПерейди по ссылке: ${referralLink}`;
  
  console.log('Реферальная ссылка:', referralLink);
  
  try {
    // Пытаемся использовать Telegram-специфичные методы
    if (tg.isVersionAtLeast('6.0') && tg.shareMessage) {
      tg.shareMessage({
        text: message,
        url: referralLink
      });
    } else if (tg.openTelegramLink) {
      // Альтернативный метод для старых версий
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
      tg.openTelegramLink(shareUrl);
    } else {
      // Если методы Telegram недоступны (например, в тестовой среде)
      alert(`Ссылка для приглашения:\n${referralLink}\n\nСообщение:\n${message}`);
      console.log('Telegram методы недоступны, показано fallback-сообщение');
    }
  } catch (error) {
    console.error('Ошибка при отправке приглашения:', error);
    alert('Произошла ошибка при отправке приглашения. Пожалуйста, попробуйте позже.');
  }
}

// Функция для загрузки списка рефералов
function loadReferralsList() {
  const referralsContainer = document.getElementById('referralsContainer');
  if (!referralsContainer) return;

  // Здесь должен быть запрос к вашему бэкенду для получения списка рефералов
  // Пример статических данных для демонстрации:
  const referrals = [
    { username: 'user1', profit: 15.50 },
    { username: 'user2', profit: 8.20 },
    { username: 'user3', profit: 3.75 },
    { username: 'user4', profit: 3.75 },
    { username: 'user5', profit: 3.75 },
    { username: 'user6', profit: 3.75 },
    { username: 'user7', profit: 3.75 },
    { username: 'user8', profit: 3.75 },
    { username: 'user9', profit: 3.75 }
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
