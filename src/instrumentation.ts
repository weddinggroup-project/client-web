export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@/lib/logger");
    logger.info("Server instrumentation initialized", {
      runtime: process.env.NEXT_RUNTIME,
    });
  }
}
