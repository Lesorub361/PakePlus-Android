// --- НАЧАЛО: Код для создания и регистрации Service Worker ---

// Помещаем весь код нашего Service Worker в одну строку (шаблонную строку)
const swCode = `
    const CACHE_NAME = 'pake-cache-v1';

    // Активация Service Worker и удаление старых кэшей
    self.addEventListener('activate', event => {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== CACHE_NAME) {
                            console.log('Старый кэш удален:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
        );
    });

    // Перехват сетевых запросов
    self.addEventListener('fetch', event => {
        // Мы кэшируем только GET-запросы (страницы, стили, картинки и т.д.)
        if (event.request.method !== 'GET') {
            return;
        }

        event.respondWith(
            // 1. Сначала пытаемся получить данные из сети
            fetch(event.request)
                .then(networkResponse => {
                    // Если запрос успешен, клонируем ответ
                    const responseToCache = networkResponse.clone();
                    // Открываем наш кэш и сохраняем новый ответ
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                            console.log('Закешировано:', event.request.url);
                        });
                    // Возвращаем ответ браузеру
                    return networkResponse;
                })
                .catch(() => {
                    // 2. Если сети нет, пытаемся найти ответ в кэше
                    console.log('Нет сети, ищем в кэше:', event.request.url);
                    return caches.match(event.request);
                })
        );
    });
`;

// Создаем "виртуальный файл" (Blob) из нашего кода
const swBlob = new Blob([swCode], { type: 'application/javascript' });
// Создаем для него временный URL
const swUrl = URL.createObjectURL(swBlob);

// Регистрируем Service Worker, используя временный URL
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(swUrl)
            .then(registration => {
                console.log('Service Worker зарегистрирован из Blob успешно:', registration);
            })
            .catch(error => {
                console.log('Ошибка регистрации Service Worker из Blob:', error);
            });
    });
}

// --- КОНЕЦ: Код для Service Worker ---


// Ваш остальной код, который был ранее (он остается без изменений)
console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
);

// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a');
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    );
    console.log('origin', origin, isBaseTargetBlank);
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault();
        console.log('handle origin', origin);
        location.href = origin.href;
    } else {
        console.log('not handle origin', origin);
    }
};

window.open = function (url, target, features) {
    console.log('open', url, target, features);
    location.href = url;
};

document.addEventListener('click', hookClick, { capture: true });