import { format } from 'winston';

const { printf } = format;

export const customFormatLogger = printf((data) => {
  const {
    label = 'HTTP',
    level,
    message,
    ms,
    service,
    stack,
    timestamp,
  } = data;

  return (
    `[${timestamp}] [${service}] [${label}] [${level.toUpperCase()}]: ${message} ${ms}` +
    (stack ? `\n${stack}` : '')
  );
});
