type LogLevel = "debug" | "info" | "warn" | "error";
type LogContext = Record<string, unknown>;

function serialize(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: process.env.NODE_ENV === "development" ? value.stack : undefined,
      cause: value.cause,
    };
  }

  return value;
}

function write(
  level: LogLevel,
  message: string,
  context: LogContext = {},
  defaults: LogContext = {},
) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...defaults,
    ...Object.fromEntries(
      Object.entries(context).map(([key, value]) => [key, serialize(value)]),
    ),
  };

  if (process.env.NODE_ENV === "production") {
    console[level === "debug" ? "log" : level](JSON.stringify(payload));
    return;
  }

  console[level === "debug" ? "log" : level](
    `[${payload.timestamp}] ${level.toUpperCase()} ${message}`,
    context,
  );
}

export function createLogger(defaultContext: LogContext = {}) {
  return {
    debug: (message: string, context?: LogContext) =>
      write("debug", message, context, defaultContext),
    info: (message: string, context?: LogContext) =>
      write("info", message, context, defaultContext),
    warn: (message: string, context?: LogContext) =>
      write("warn", message, context, defaultContext),
    error: (message: string, context?: LogContext) =>
      write("error", message, context, defaultContext),
    child: (context: LogContext) =>
      createLogger({ ...defaultContext, ...context }),
  };
}

export const logger = createLogger({ service: "ganipedia-nextjs-starter" });
