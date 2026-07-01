import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

let cachedApp: Promise<NestExpressApplication> | undefined;

/**
 * Creates (and caches) the Nest application instance.
 *
 * Caching is critical for serverless: every cold-start would otherwise
 * rebuild the DI graph, defeating Vercel's reuse. Warm invocations reuse
 * the same app across requests.
 */
export function getApp(): Promise<NestExpressApplication> {
  if (!cachedApp) {
    cachedApp = (async () => {
      const app = await NestFactory.create<NestExpressApplication>(AppModule);
      app.enableCors({ origin: true, credentials: true });
      await app.init();
      return app;
    })();
  }
  return cachedApp;
}