# Remove Portainer BE branding

Некоторое время назад Portainer добавили рекламу Business Edition повсюду в бесплатной версии Community Edition, призывая к покупке и затемняя недоступные опции. Это очень раздражающее поведение для продукта с открытым исходным кодом, поэтому я решил это исправить. Решение основано на работе [JSH32](https://github.com/JSH32/portainer-remove-be-branding), но использует изменённый скрипт для поддержки динамического изменения кода страницы.

## Скриншоты

<table>
  <tr>
    <th>До применения скрипта</th>
    <th>После</th>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/LordArrin/portainer-remove-be-branding/main/.github/screenshots/with_branding.png" alt="1" width = 500px></td>
    <td><img src="https://raw.githubusercontent.com/LordArrin/portainer-remove-be-branding/main/.github/screenshots/no_branding.png" alt="2" width = 500px></td>
  </tr> 
</table>

## Как использовать?

_Самый простой и надёжный метод - добавить [этот](https://github.com/LordArrin/portainer-remove-be-branding/blob/main/nginx.conf.template) шаблон в свою конфигурацию nginx. 
Главное - не забыть заменить порты и пути на свои, а так же скопировать remove_be.js в выбранный вами локальный каталог.

Исправление работает с помощью функции `sub_filter` Nginx, которая способна редактировать страницы за прокси перед отправкой пользователю. Это означает, что скрипт будет работать даже при обновлении portainer.
