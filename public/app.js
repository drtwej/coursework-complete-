// Логика для входа
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token); // Сохраняем токен в localStorage
        window.location.href = 'dashboard.html';  // Переход на страницу после успешного входа
      } else {
        alert(data.message || 'Ошибка при входе');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Произошла ошибка. Попробуйте позже.');
    }
  });
}

// Логика для регистрации
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Регистрация прошла успешно');
        window.location.href = 'index.html';  // Переход на страницу входа после регистрации
      } else {
        alert(data.message || 'Ошибка при регистрации');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Произошла ошибка. Попробуйте позже.');
    }
  });
}

// Загрузка проектов на главную страницу
async function loadProjects() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'index.html';  // Если нет токена, перенаправляем на страницу входа
    return;
  }

  try {
    const response = await fetch('/api/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const projectsList = document.getElementById('projectsList');

    if (response.ok) {
      projectsList.innerHTML = ''; // Очищаем список перед добавлением новых проектов
      if (data.projects.length > 0) {
        data.projects.forEach(project => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('card', 'mb-3');
          projectItem.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${project.title}</h5>
              <p class="card-text">${project.description}</p>
              <p class="card-text"><strong>Срок завершения:</strong> ${new Date(project.dueDate).toLocaleDateString()}</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-warning btn-edit" data-id="${project._id}">Редактировать</button>
                <button class="btn btn-danger btn-delete" data-id="${project._id}">Удалить</button>
              </div>
            </div>
          `;
          projectsList.appendChild(projectItem);
        });
        attachProjectActions(); // Добавляем обработчики кнопок
      } else {
        projectsList.innerHTML = '<p>Нет созданных проектов.</p>';
      }
    } else {
      alert(data.message || 'Ошибка загрузки проектов');
    }
  } catch (err) {
    console.error('Ошибка:', err);
    alert('Произошла ошибка при загрузке проектов.');
  }
}

// Функция для добавления обработчиков редактирования и удаления
function attachProjectActions() {
  const editButtons = document.querySelectorAll('.btn-edit');
  const deleteButtons = document.querySelectorAll('.btn-delete');

  editButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const projectId = button.getAttribute('data-id');
      const newTitle = prompt('Введите новое название проекта:');
      const newDescription = prompt('Введите новое описание проекта:');

      if (newTitle && newDescription) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title: newTitle, description: newDescription }),
          });

          if (response.ok) {
            alert('Проект успешно обновлен!');
            loadProjects(); // Перезагружаем список проектов
          } else {
            const data = await response.json();
            alert(data.message || 'Ошибка при обновлении проекта');
          }
        } catch (err) {
          console.error('Ошибка:', err);
          alert('Произошла ошибка при обновлении проекта.');
        }
      }
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const projectId = button.getAttribute('data-id');
      const confirmDelete = confirm('Вы уверены, что хотите удалить этот проект?');

      if (confirmDelete) {
        try {
        

          if (response.ok) {
            alert('Проект успешно удален!');
            loadProjects(); // Перезагружаем список проектов
          } else {
            const data = await response.json();
            alert(data.message || 'Ошибка при удалении проекта');
          }
        } catch (err) {
          console.error('Ошибка:', err);
          alert('Произошла ошибка при удалении проекта.');
        }
      }
    });
  });
}

// Выход из системы
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authToken');  // Удаляем токен
    window.location.href = 'index.html';  // Перенаправляем на страницу входа
  });
}

// Проверка токена и редирект на страницу входа, если токен отсутствует
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');

  // На странице входа и регистрации токен не нужен
  if ((window.location.pathname !== '/index.html' && window.location.pathname !== '/register.html') && !token) {
    window.location.href = 'index.html';  // Если нет токена, редиректим на страницу входа
  }
});

// Вызываем функцию загрузки проектов при загрузке страницы
if (document.getElementById('projectsList')) {
  loadProjects();
}
