## О проекте

Данный репозиторий содержит проект, который позволяет назначать задачи между отделами в рамках одной организации. Проект реализован на стеке React + Node.js + SQLite3.

## Демо приложение

Демо-приложение представляет собой простой непубличный (требуется вход) менеджер задач. Учетная запись администратора: admin, пароль для входа: 0091. Пользователи должны быть зарегистрированы в системе. После этого администратор назначает для них департамент, подразделение, отдел и должность. Администратор также может создавать структурные подразделения, департаменты и должности. Для обновления данных и уведомления пользователей используется socket.io. В качестве бэкенда используется сервер Node.js (запускается отдельно).

## Установка и запуск

Серверная часть:
```
$ cd bk
$ npm i
$ node server.js
```
Фронтенд часть:
```
$ cd fr
$ npm i
$ npm start
```
По умолчанию демо доступно по адресу (http://localhost:3000). Адрес сервера API по умолчанию настроен на (http://localhost:3070).

## Основные идеи

Идея создания такого приложения возникла из реальной задачи в рамках холдинга. Для управляющей компании требовалось назначать задачи дочерним структурам. Однако в связи с большой текучестью кадров и отсутствием доступа у штатных сотрудников, кроме руководства, к приложению, было решено, что назначение задач между подразделениями будет осуществляться только ответственной службой подразделения. После получения задачи руководитель службы выбирает ответственный отдел в рамках своей службы.

Сотрудникам управляющей компании доступны все подразделения для назначения задач. Руководителям служб подразделений доступны только отделы, входящие в состав их службы.

Сотрудник создает задачу, указывает подразделение. Руководитель подразделения согласовывает задачу. Руководитель подразделения назначает ответственного за исполнение задачи. После исполнения задачи руководителем ответственного подразделения ставится отметка о выполнении, и задача направляется на проверку назначенному лицу. После подтверждения выполнения задача закрывается.

## Система уведомлений

Уведомления происходят при изменении статуса задачи. Уведомляются все пользователи, участвующие в задаче, кроме пользователя, который изменил статус.
Так же если пользователь отсутсвовал в системе на момент получения уведомления сиситема делат запись в базе данных. Проверка происходит на основании пользователй подключеных через сокетное соединение.

## Безопасность

### Аутентификация и авторизация
- Функция `protectRouteTkPl` обеспечивает безопасную аутентификацию пользователей, проверяя наличие и валидность JWT токена.
- Перед предоставлением доступа к защищенным маршрутам происходит проверка наличия пользователя в базе данных и соответствия токена.

### Защита от уязвимостей
- Конфиденциальные данные, такие как секретный ключ, хранятся в переменной среды `process.env.KEY_TOKEN` и не раскрываются в открытом коде.
- Для безопасного хранения конфиденциальных данных рекомендуется использовать `.env` файл, который исключен из репозитория.

### Логирование и обработка ошибок

#### Логгер на основе Winston

- Данный логгер на основе пакета Winston предоставляет гибкую настройку уровней логирования и цветовую кодировку для различных типов сообщений.
- Осуществляет логирование в консоль и в различные файлы в зависимости от уровня сообщения.
- Дополнительно предоставляет кастомные методы для логирования сообщений аутентификации.

#### Логгер для событий сокетов

- Данный логгер предназначен для логирования событий, связанных с подключением и отключением пользователей через сокеты.
- Записывает информацию о действиях пользователей, таких как подключение и отключение, в файл socket_logs.txt.
- Включает дополнительную логику при подключении и отключении пользователей через сокеты.

## Загрузка графических файлов

Вся обработка графических файлов происходит на сервере. Для работы с графическими файлами используется библиотека sharp. Также доступно превью файла, удаление и добавление новых графических файлов к задачам.

## Технологический стек

- React используется для создания клиентской части приложения, обеспечивая интерактивный пользовательский интерфейс.
- Node.js выступает в роли сервера, обрабатывая запросы от клиента, взаимодействуя с базой данных SQLite3 и возвращая данные обратно клиенту.
- SQLite3 используется для хранения данных приложения, таких как информация о пользователях, задачах и структуре организации, обеспечивая доступ к данным из серверной части приложения.