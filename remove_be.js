(function () {
  'use strict';

  // ==========================================
  // КОНФИГУРАЦИЯ
  // ==========================================

  const GLOBAL_SELECTORS = [
    '#portainerSidebar-userRelated > li:nth-of-type(3) .ng-isolate-scope > .col-sm-12',
    '#portainerSidebar-userRelated > li:nth-of-type(3) .col-sm-12',
    '#portainerSidebar-userRelated > .col-sm-12',

    // 1. Синий баннер "Upgrade" (по уникальным цветам фона)
    '[class*="023959"]',
    '[class*="343434"]',

    '[class*="col-sm-12"]:has([class*="be-indicator"])',

    '#portainer-settings > li:nth-of-type(4)',

    // 3. Пункты меню Logs (Kubernetes/Activity/Audit)
    '#k8sSidebar-logs',
    'li[class*="min-h-8"][class*="flex-col"][class*="text-gray-3"]:nth-of-type(4)',
    '#sideview li:has(a[href*="activity-logs"])',
    '#sideview li:has(a[href*="audit-logs"])',

    // --- ОБЩИЕ ПРАВИЛА ---
    '#sideview button:has(+ nav)',
    '#sideview nav[aria-label="Settings"] li[aria-label="Users"] li:has(a[href="#!/roles"])',
    '#sideview nav[aria-label="Settings"] li[aria-label="Authentication logs"]:has(a[href="#!/auth-logs"])',
    '#sideview li[aria-label="Cluster"] li[aria-label="Security constraints"]',
    
    // Рекламные виджеты и уведомления
    '[class*="app-react-components-BoxSelector-BoxSelectorItem-module__business"]',
    '[class*="widget-body.motd-body"]',
    '[class*="app-react-sidebar-Footer-UpdateNotifications-module_"]'
  ];

  // ==========================================
  // ДИНАМИЧЕСКИЕ ПРАВИЛА
  // ==========================================
  const DYNAMIC_STYLES = [
    {
      pattern: /\/#!\/wizard\/endpoints($|\/create\?.*$)/,
      selectors: ["#content-wrapper div.app-react-components-BoxSelector-BoxSelectorItem-module__business"],
    },
    {
      pattern: /\/#!\/endpoints\/[0-9]+\/access($|\?.*$)/,
      selectors: ["#content-wrapper div.form-group:has(be-feature-indicator)"],
    },
    {
      pattern: /\/#!\/registries.*/,
      selectors: ["#content-wrapper a.be-indicator"],
    },
    {
      pattern: /\/#!\/settings.*/,
      selectors: [
        "#content-wrapper div.form-group:has(a.be-indicator)",
        "#content-wrapper div.be-indicator-container",
        "#content-wrapper div.app-react-components-BoxSelector-BoxSelectorItem-module__business",
      ],
    },
    {
      pattern: /\/#!\/settings\/auth.*/,
      selectors: [
        "#content-wrapper div.app-react-components-BoxSelector-BoxSelectorItem-module__business",
        '#content-wrapper ldap-settings label[for="ldap_url"] button.limited-be',
        "#content-wrapper ldap-settings ldap-custom-user-search > div.form-group div.col-sm-12:has(be-feature-indicator)",
        "#content-wrapper ldap-settings ldap-custom-group-search > rd-widget div.form-group:has(pr-icon[icon=\"'briefcase'\"])",
        "#content-wrapper ldap-settings ldap-custom-group-search > div.form-group div.col-sm-12:has(be-feature-indicator)",
        "#content-wrapper ldap-settings ldap-custom-admin-group",
        "#content-wrapper ldap-settings ldap-settings-test-login",
        "#content-wrapper oauth-settings div.form-group:has(a.be-indicator)",
      ],
    },
    {
      pattern: /\/#!\/[0-9]+\/docker\/stacks\/newstack($|.*$)/,
      selectors: [
        "#content-wrapper div:has(> div.form-section-title a.be-indicator)",
        "#content-wrapper div > div.form-section-title:has(a.be-indicator)",
        "#content-wrapper tr:has(div.form-group a.be-indicator)",
      ],
    },
    {
      pattern: /\/#!\/[0-9]+\/docker\/containers\/new($|.*$)/,
      selectors: ["#content-wrapper div:has(> div.form-group a.be-indicator)"],
    },
    {
      pattern: /\/#!\/[0-9]+\/docker\/containers\/[0-9a-fA-F]{64}.*/,
      selectors: ["#content-wrapper tr:has(div.form-group a.be-indicator)"],
    },
    {
      pattern: /\/#!\/[0-9]+\/docker\/host\/feat-config.*/,
      selectors: [
        "#content-wrapper div.form-group div.col-sm-12:has(a.be-indicator)",
        "#content-wrapper div.form-section-title:has(+ div.form-group div.col-sm-12:only-child a.be-indicator)",
      ],
    },
    {
      pattern: /\/#!\/[0-9]+\/docker\/host\/registries.*/,
      selectors: ["#content-wrapper be-feature-indicator"],
    },
    {
      pattern: /\/#!\/[0-9]+\/kubernetes\/pools\/new($|.*$)/,
      selectors: [
        "#content-wrapper div.form-group:has(label a.be-indicator)",
        "#content-wrapper div.form-section-title:has(+ div.form-group + div.form-section-title + storage-class-switch a.be-indicator)",
        "#content-wrapper div.form-section-title + div.form-group:has(+ div.form-section-title + storage-class-switch a.be-indicator)",
      ],
    },
    {
      pattern: /\/#!\/[0-9]+\/kubernetes\/deploy($|\?.*$)/,
      selectors: ["#content-wrapper div.form-group:has(label a.be-indicator)"],
    },
    {
      pattern: /\/#!\/[0-9]+\/kubernetes\/cluster\/configure.*/,
      selectors: [
        "#content-wrapper div.form-section-title:has(+ div.form-group por-switch-field[name=\"'disableSysctlSettingForRegularUsers'\"] a.be-indicator)",
        "#content-wrapper div.form-section-title + div.form-group:has(por-switch-field[name=\"'disableSysctlSettingForRegularUsers'\"] a.be-indicator)",
        "#content-wrapper div:has(> por-switch-field[name=\"'restrictStandardUserIngressW'\"] a.be-indicator)",
        "#content-wrapper div:has(+ div > por-switch-field[name=\"'resource-over-commit-switch'\"] a.be-indicator)",
      ],
    },
  ];

  // ==========================================
  // ЛОГИКА
  // ==========================================

  let lastUrl = "";
  let debounceTimer = null;
  const STYLE_ID_GLOBAL = "portainer-cleaner-global";
  const STYLE_ID_DYNAMIC = "portainer-cleaner-dynamic";

  const getStyleTag = (id) => {
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      document.head.appendChild(tag);
    }
    return tag;
  };

  const applyGlobalStyles = () => {
    const tag = getStyleTag(STYLE_ID_GLOBAL);
    if (tag.innerHTML.length > 0) return; 
    const rules = GLOBAL_SELECTORS.map(s => `${s} { display: none !important; }`).join("\n");
    tag.innerHTML = rules;
  };

  const applyDynamicStyles = () => {
    const currentUrl = window.location.href;
    if (currentUrl === lastUrl) {
        forceRemoveStubbornElements();
        return; 
    }
    lastUrl = currentUrl;
    const activeRules = [];
    DYNAMIC_STYLES.forEach((entry) => {
      if (entry.pattern.test(currentUrl)) {
        entry.selectors.forEach((sel) => {
          activeRules.push(`${sel} { display: none !important; }`);
        });
      }
    });
    const tag = getStyleTag(STYLE_ID_DYNAMIC);
    const newCss = activeRules.join("\n");
    if (tag.innerHTML !== newCss) {
        tag.innerHTML = newCss;
    }
    forceRemoveStubbornElements();
  };

  const forceRemoveStubbornElements = () => {
     const selector = '[class*="app-react-components-BoxSelector-BoxSelectorItem-module__business"]';
     const elements = document.querySelectorAll(selector);
     if (elements.length) {
         elements.forEach(el => el.style.setProperty("display", "none", "important"));
     }
  };

  const handleUpdate = () => {
    applyGlobalStyles();
    applyDynamicStyles();
  };

  const debouncedUpdate = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleUpdate, 50);
  };

  const patchHistory = (type) => {
    const original = history[type];
    return function () {
      const result = original.apply(this, arguments);
      handleUpdate();
      return result;
    };
  };
  history.pushState = patchHistory('pushState');
  history.replaceState = patchHistory('replaceState');
  window.addEventListener('popstate', handleUpdate);

  const observer = new MutationObserver(() => {
    debouncedUpdate();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });

  if (document.readyState !== "loading") {
      handleUpdate();
  } else {
      document.addEventListener("DOMContentLoaded", handleUpdate);
  }
})();
