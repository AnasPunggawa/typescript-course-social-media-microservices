import { format } from 'winston';
const { printf } = format;

export const customLoggerFormat = printf((data) => {
  const {
    message,
    level,
    service,
    timestamp,
    label = 'HTTP',
    ms,
    stack,
  } = data;

  return (
    `[${timestamp}] [${service}] [${label}] [${level.toUpperCase()}]: ${message} ${ms}` +
    (stack ? `\n${stack}` : '')
  );
});
