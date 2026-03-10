document.addEventListener("DOMContentLoaded", () => {
  const backdrop = document.getElementById("backdrop");
  const sheets = document.querySelectorAll(".bottom-sheet");
  const formBox = document.getElementById("loginForm");
  const formMessage = document.getElementById("formMessage");

  let activeSheet = null;

  // Open Sheet
  const openSheet = (sheetId) => {
    if (activeSheet) {
      // If a sheet is already open, close it instantly without animating backdrop
      document.getElementById(`sheet-${activeSheet}`)?.classList.remove("active");
    } else {
      // First sheet opening
      backdrop.classList.add("active");
    }
    
    const sheet = document.getElementById(`sheet-${sheetId}`);
    if (sheet) {
      // Small timeout to allow display block calculation if it was none
      setTimeout(() => sheet.classList.add("active"), 10);
      activeSheet = sheetId;
    }
  };

  // Close Sheet
  const closeSheet = () => {
    if (activeSheet) {
      document.getElementById(`sheet-${activeSheet}`)?.classList.remove("active");
      backdrop.classList.remove("active");
      activeSheet = null;
    }
  };

  // Buttons that open sheets from main screen
  document.querySelectorAll("[data-sheet]").forEach(btn => {
    btn.addEventListener("click", () => {
      openSheet(btn.getAttribute("data-sheet"));
    });
  });

  // Links that switch between sheets
  document.querySelectorAll("[data-switch-sheet]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openSheet(btn.getAttribute("data-switch-sheet"));
    });
  });

  // Close buttons inside sheets
  document.querySelectorAll(".sheet-close").forEach(btn => {
    btn.addEventListener("click", closeSheet);
  });

  // Backdrop click to close
  backdrop.addEventListener("click", closeSheet);

  // Swipe down to close gesture (Basic Touch Handling)
  let startY = 0;
  let currentY = 0;
  
  sheets.forEach(sheet => {
    const handle = sheet.querySelector('.sheet-handle');
    if(!handle) return;

    handle.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, {passive: true});

    handle.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 0) {
        // Dragging down
        sheet.style.transform = `translateY(${diff}px)`;
        sheet.style.transition = 'none'; // disable transition while dragging
      }
    }, {passive: true});

    handle.addEventListener('touchend', (e) => {
      sheet.style.transition = ''; // restore transition
      const diff = currentY - startY;
      if (diff > 50) {
        // User swiped down far enough
        sheet.style.transform = ''; // Clear inline styles
        closeSheet();
      } else {
        // Snap back
        sheet.style.transform = '';
      }
      startY = 0; currentY = 0;
    });
  });


  // Auth Form Handling
  if (formBox) {
    formBox.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const nickname = document.getElementById("nickname").value.trim();
      const pwdVal = document.getElementById("password").value.trim();
      const server = document.getElementById("server").value;
      const tguser = document.getElementById("tguser").value.trim();

      if (!nickname || !pwdVal || !server) {
        formMessage.textContent = "Заполните ник, пароль и выберите сервер.";
        formMessage.className = "form-feedback error";
        return;
      }

      // Валидация никнейма (RolePlay формат на английском, минимум по 2 буквы, есть _)
      const rpNameRegex = /^[A-Z][a-z]+_[A-Z][a-z]+$/;
      if (!rpNameRegex.test(nickname)) {
        formMessage.textContent = "Никнейм должен быть на английском в формате Name_Surname.";
        formMessage.className = "form-feedback error";
        return;
      }

      const parts = pwdVal.split(",");
      const password = parts[0].trim();
      const pin = parts.length > 1 ? parts[1].trim() : null;

      if (password.length < 4) {
        formMessage.textContent = "Пароль должен быть от 4 символов.";
        formMessage.className = "form-feedback error";
        return;
      }

      // Валидация пароля (только английские буквы и цифры)
      const pwdRegex = /^[a-zA-Z0-9!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/\\|`~]+$/;
      if (!pwdRegex.test(password)) {
        formMessage.textContent = "Пароль должен содержать только английские символы и цифры.";
        formMessage.className = "form-feedback error";
        return;
      }

      if (pin !== null && pin.length === 0) {
        formMessage.textContent = "Указана запятая, но нет PIN-кода.";
        formMessage.className = "form-feedback error";
        return;
      }

      // Success
      formMessage.textContent = "Успешная авторизация. Загрузка профиля...";
      formMessage.className = "form-feedback success";
      
      // Simulate real delay - Open Dashboard
      setTimeout(() => {
        formBox.reset();
        formMessage.textContent = "";
        closeSheet();
        
        // Hide Main View, Show Profile
        document.getElementById('mainView').style.display = 'none';
        const profileView = document.getElementById('profileView');
        profileView.style.display = 'flex';
        
        // Update user data on profile
        document.getElementById('profileName').textContent = nickname;
        const avatarEl = document.getElementById('profileAvatarLetter');
        avatarEl.textContent = nickname.charAt(0).toUpperCase();
        if (tguser) {
          // try to load avatar from Telegram
          const imgUrl = `https://t.me/i/userpic/320/${tguser}`;
          const img = new Image();
          img.onload = () => {
            avatarEl.style.backgroundImage = `url('${imgUrl}')`;
            avatarEl.textContent = '';
          };
          img.onerror = () => {
            console.warn('avatar tg not found for', tguser);
          };
          img.src = imgUrl;
        }

        // Start Fake Console
        startFakeConsole();
      }, 1000);
    });
  }

  // Logout handling
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      document.getElementById('profileView').style.display = 'none';
      document.getElementById('mainView').style.display = 'flex';
      
      // Stop console
      if (consoleInterval) clearInterval(consoleInterval);
    });
  }

  let consoleInterval = null;

  function startFakeConsole() {
    const consoleLines = document.getElementById('consoleLines');
    if (!consoleLines) return;
    
    consoleLines.innerHTML = ''; // clear

    let availableReports = [];
    const reportTemplates = [
      "Помогите, застрял в текстурах!!",
      "Тут дмят на спавне",
      "Как купить машину?",
      "Выдайте скутер пж",
      "Спек {id}, там читер летит",
      "Где находится СТО?",
      "Меня посадили ни за что",
      "Можно сменить нонРП ник?",
      "Сколько стоит дом в рублевке?",
      "id {id} нон рп драйв",
      "{id} id DM",
      "Достаньте из воды пожалуйста",
      "id {id} оск род",
      "Тут масс ДМ на б/у рынке",
      "Флипните кар, перевернулся",
      "{id} id ЕПП",
      "Увольте по сж с СМИ",
      "Где купить лицензию на оружие?",
      "Тут нон рп коп вяжет без рп отыгровки",
      "Респните кар пж, пропал",
      "id {id} NonRP обман на машину",
      "Как передать деньги другому игроку?",
      "Снимите варн, я случайно",
      "id {id} спидхак",
      "Помогите, я провалился под карту",
      "ТП ко мне, срочно нужна помощь",
      "{id} id DB",
      "id {id} оск адм"
    ];

    const fakeNames = [
      "Artem_Bogdanov", "Ivan_Petrov", "Alex_Smirnov", "Dima_Grozny", 
      "Maksim_Sokolov", "Daniil_Kovalev", "Sergey_Bezrukov", "Vladislav_Pavlov", 
      "Nikita_Volkov", "Dmitriy_Makarov", "Alexander_Bely", "Denis_Lebedev", 
      "Andrey_Morozov", "Mikhail_Zaitsev", "Pavel_Kozlov", "Aleksey_Romanov", 
      "Kirill_Novikov", "Egor_Sidorov", "Ilya_Gromov", "Roman_Orlov",
      "Arseniy_Tumanov", "Vlad_Sokolovsky", "Timur_Alekseev"
    ];

    // create first initial line
    const initLine = document.createElement('div');
    initLine.innerHTML = `<span class="c-time">[sys]</span> <span class="c-user">System:</span> <span class="c-rep" style="color:#aaa;">Connect to Server 1 successful. Listening for reports...</span>`;
    consoleLines.appendChild(initLine);

    if (consoleInterval) clearInterval(consoleInterval);

    consoleInterval = setInterval(() => {
      if (document.getElementById('profileView').style.display === 'none') return;
      
      // Refill the pool if it's empty to prevent obvious loop
      if (availableReports.length === 0) {
        availableReports = [...reportTemplates];
      }

      const time = new Date().toLocaleTimeString('ru-RU', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const id = Math.floor(Math.random() * 900) + 1;
      
      // Pick random report from available pool and remove it from array so it doesn't repeat soon
      const repIndex = Math.floor(Math.random() * availableReports.length);
      let text = availableReports.splice(repIndex, 1)[0];

      // Replace id placeholders with random numbers
      text = text.replace(/\{id\}/g, () => Math.floor(Math.random() * 900) + 1);

      const line = document.createElement('div');
      line.innerHTML = `<span class="c-time">[${time}]</span> <span class="c-user">${name}[${id}]:</span> <span class="c-rep">${text}</span>`;
      
      consoleLines.appendChild(line);

      // Keep only last 5 lines so it doesn't overflow
      if (consoleLines.childElementCount > 5) {
        consoleLines.removeChild(consoleLines.firstChild);
      }

      // Randomly update report count
      const repCount = document.getElementById('reportCount');
      if (repCount) {
        repCount.textContent = parseInt(repCount.textContent) + 1;
      }

    }, 2500 + Math.random() * 3000);
  }

});