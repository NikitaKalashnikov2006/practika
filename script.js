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
function addPageHandlers() {
  // Здесь можно добавить обработчики для элементов конкретных страниц
}
