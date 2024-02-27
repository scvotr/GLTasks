const winston = require('winston');

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    infoAuth: 3,
    warnAuth: 4,
    errorAuth: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    infoAuth: 'blue',
    warnAuth: 'orange',
    errorAuth: 'magenta'
  }
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels, // Устанавливаем уровень логирования
  format: winston.format.combine(
    winston.format.colorize({all: true}),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      level: 'info'
    }), // Вывод в консоль
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Запись ошибок в файл error.log
    // new winston.transports.File({ filename: 'errorAuth.log', level: 'errorAuth' }), // Запись ошибок в файл error.log
    // new winston.transports.File({ filename: 'warnAuth.log', level: 'warnAuth' }), // Запись ошибок в файл error.log
    new winston.transports.File({ filename: 'combined.log' }) // Запись всех уровней в файл combined.log
  ]
});

// Добавление кастомных методов логирования
logger.infoAuth = function(message, meta) {
  this.log('infoAuth', message, meta);
};

logger.warnAuth = function(message, meta) {
  this.log('warnAuth', message, meta);
};

logger.errorAuth = function(message, meta) {
  this.log('errorAuth', message, meta);
};

module.exports = logger;

// Примеры записи сообщений различных уровней
// logger.error('Сообщение об ошибке');
// logger.warn('Предупреждение');
// logger.info('Информационное сообщение');
// logger.infoAuth('Информационное сообщение об аутентификации');
// logger.warnAuth('Предупреждение об аутентификации');
// logger.errorAuth('Ошибка аутентификации');