(function () {
  // Функция для логирования сообщений в консоль с заданными стилями
  const scriptLog = (message, prefix, groupLogs) => {
    const logArgs = [
      `%c${prefix ? prefix : '?'} %c[%cPortainer Proxy%c] %c${message}`,
      "color: orange; font-weight: bold;", // Стиль для префикса
      "color: gray; font-weight: bold;",   // Стиль для метки "[Portainer Proxy]"
      "color: cyan; font-weight: bold;",   // Стиль для текста "Portainer Proxy"
      "color: gray; font-weight: bold;",   // Стиль для текста сообщения
      "color: white; font-weight: normal;",// Стиль для основного текста сообщения
    ];

    // Если groupLogs задан, логируем в виде сгруппированного блока
    if (groupLogs) {
      console.groupCollapsed(...logArgs);
      groupLogs();
      console.groupEnd();
    } else {
      console.log(...logArgs);
    }
  };

  // Функция для применения динамических стилей на основе текущего URL
  const applyStyles = () => {
    const url = window.location.href;

    // Массив стилей, которые будут применяться в зависимости от паттернов URL
    const styles = [
      {
        // Общие стили, применяемые ко всем страницам
        pattern: /.*/,
        selectors: [
          "#sideview button:has(+ nav)",  // Кнопки с навигацией
          '#sideview nav[aria-label="Settings"] li[aria-label="Users"] li:has(a[href="#!/roles"])', // Роли в настройках
          '#sideview nav[aria-label="Settings"] li[aria-label="Authentication logs"]:has(a[href="#!/auth-logs"])', // Логирование аутентификации
          '#sideview li[aria-label="Cluster"] li[aria-label="Security constraints"]', // Ограничения безопасности в кластере
        ],
      },
      {
        // Страница с настройками конечных точек
        pattern: /.*\/#!\/wizard\/endpoints($|\/create\?.*$)/,
        selectors: [
          "#content-wrapper div.app-react-components-BoxSelector-BoxSelectorItem-module__business", // Стиль для создания новых конечных точек
        ],
      },
      {
        // Страница с доступом для конкретной конечной точки
        pattern: /.*\/#!\/endpoints\/[0-9]+\/access($|\?.*$)/,
        selectors: [
          "#content-wrapper div.form-group:has(be-feature-indicator)", // Стиль для групп, связанных с фичами
        ],
      },
      {
        // Страница с регистрами
        pattern: /.*\/#!\/registries.*/,
        selectors: ["#content-wrapper a.be-indicator"], // Скрытие индикаторов на странице с регистрами
      },
      {
        // Страница с настройками
        pattern: /.*\/#!\/settings.*/,
        selectors: [
          "#content-wrapper div.form-group:has(a.be-indicator)", // Скрытие групп с индикаторами
          "#content-wrapper div.be-indicator-container", // Контейнеры с индикаторами
          "#content-wrapper div.app-react-components-BoxSelector-BoxSelectorItem-module__business", // Боксы выбора
        ],
      },
      {
        // Страница с настройками аутентификации
        pattern: /.*\/#!\/settings\/auth.*/,
        selectors: [
          "#content-wrapper div.app-react-components-BoxSelector-BoxSelectorItem-module__business", // Настройки LDAP
          '#content-wrapper ldap-settings label[for="ldap_url"] button.limited-be', // Кнопка для настройки LDAP URL
          "#content-wrapper ldap-settings ldap-custom-user-search > div.form-group div.col-sm-12:has(be-feature-indicator)", // Пользовательский поиск в LDAP
          "#content-wrapper ldap-settings ldap-custom-group-search > rd-widget div.form-group:has(pr-icon[icon=\"'briefcase'\"])", // Группы пользователей в LDAP
          "#content-wrapper ldap-settings ldap-custom-group-search > div.form-group div.col-sm-12:has(be-feature-indicator)", // Поиск групп в LDAP
          "#content-wrapper ldap-settings ldap-custom-admin-group", // Группа администраторов в LDAP
          "#content-wrapper ldap-settings ldap-settings-test-login", // Тестирование входа LDAP
          "#content-wrapper oauth-settings div.form-group:has(a.be-indicator)", // OAuth настройки
        ],
      },
      {
        // Страница с настройками стека Docker
        pattern: /.*\/#!\/[0-9]+\/docker\/stacks\/newstack($|.*$)/,
        selectors: [
          "#content-wrapper div:has(> div.form-section-title a.be-indicator)", // Секции с индикаторами
          "#content-wrapper div > div.form-section-title:has(a.be-indicator)", // Заголовки секций с индикаторами
          "#content-wrapper tr:has(div.form-group a.be-indicator)", // Строки с индикаторами
        ],
      },
      {
        // Страница с созданием нового контейнера
        pattern: /.*\/#!\/[0-9]+\/docker\/containers\/new($|.*$)/,
        selectors: [
          "#content-wrapper div:has(> div.form-group a.be-indicator)", // Группы с индикаторами
        ],
      },
      {
        // Страница с контейнерами Docker
        pattern: /.*\/#!\/[0-9]+\/docker\/containers\/[0-9a-fA-F]{64}.*/,
        selectors: ["#content-wrapper tr:has(div.form-group a.be-indicator)"], // Строки с индикаторами
      },
      {
        // Страница с конфигурацией хоста Docker
        pattern: /.*\/#!\/[0-9]+\/docker\/host\/feat-config.*/,
        selectors: [
          "#content-wrapper div.form-group div.col-sm-12:has(a.be-indicator)", // Группы с индикаторами
          "#content-wrapper div.form-section-title:has(+ div.form-group div.col-sm-12:only-child a.be-indicator)", // Заголовки с индикаторами
        ],
      },
      {
        // Страница с регистрами хоста Docker
        pattern: /.*\/#!\/[0-9]+\/docker\/host\/registries.*/,
        selectors: ["#content-wrapper be-feature-indicator"], // Индикаторы фич
      },
      {
        // Страница с настройками пула Kubernetes
        pattern: /.*\/#!\/[0-9]+\/kubernetes\/pools\/new($|.*$)/,
        selectors: [
          "#content-wrapper div.form-group:has(label a.be-indicator)", // Группы с индикаторами
          "#content-wrapper div.form-section-title:has(+ div.form-group + div.form-section-title + storage-class-switch a.be-indicator)", // Заголовки с индикаторами
          "#content-wrapper div.form-section-title + div.form-group:has(+ div.form-section-title + storage-class-switch a.be-indicator)", // Заголовки секций
        ],
      },
      {
        // Страница с развертыванием Kubernetes
        pattern: /.*\/#!\/[0-9]+\/kubernetes\/deploy($|\?.*$)/,
        selectors: [
          "#content-wrapper div.form-group:has(label a.be-indicator)", // Группы с индикаторами
        ],
      },
      {
        // Страница с конфигурацией кластера Kubernetes
        pattern: /.*\/#!\/[0-9]+\/kubernetes\/cluster\/configure.*/,
        selectors: [
          "#content-wrapper div.form-section-title:has(+ div.form-group por-switch-field[name=\"'disableSysctlSettingForRegularUsers'\"] a.be-indicator)", // Настройки sysctl
          "#content-wrapper div.form-section-title + div.form-group:has(por-switch-field[name=\"'disableSysctlSettingForRegularUsers'\"] a.be-indicator)", // Заголовки секций
          "#content-wrapper div:has(> por-switch-field[name=\"'restrictStandardUserIngressW'\"] a.be-indicator)", // Переключатели конфигурации
          "#content-wrapper div:has(+ div > por-switch-field[name=\"'resource-over-commit-switch'\"] a.be-indicator)", // Переключатели ресурсов
        ],
      },
    ];

    const styleBlockId = "remove-be-style"; // ID блока стилей
    let styleBlock = document.getElementById(styleBlockId);

    // Если блок стилей не существует, создаем его
    if (!styleBlock) {
      styleBlock = document.createElement("style");
      styleBlock.id = styleBlockId;
      document.head.appendChild(styleBlock);
    }

    const cssRules = []; // Массив для хранения CSS правил

    // Применяем стили в зависимости от текущего URL
    styles.forEach((style) => {
      if (style.pattern.test(url)) {
        style.selectors.forEach((selector) => {
          cssRules.push(`${selector} { display: none !important; }`); // Скрытие элементов с помощью display: none
        });
      }
    });

    // Если есть правила для применения, выводим их в консоль
    if (cssRules.length) {
      scriptLog("Page state changed, applied dynamic styles", null, () => {
        console.log(cssRules.join("\n"));
      });
    } else {
      scriptLog("Page state changed, no styles to apply");
    }

    // Применяем сформированные CSS правила
    styleBlock.innerHTML = cssRules.join("\n");
  };

  // Создаем наблюдатель за изменениями DOM
  const observer = new MutationObserver(() => {
    applyStyles();
  });

  const config = {
    childList: true,
    subtree: true,
  };

  // Инициализация наблюдателя
  const initObserver = () => {
    observer.observe(document.body, config);
  };

  // Применяем стили после загрузки контента и на изменение состояния истории
  document.addEventListener("DOMContentLoaded", () => {
    applyStyles();
    initObserver();
  });

  window.addEventListener("popstate", applyStyles);
  window.addEventListener("pushState", applyStyles);
})();
