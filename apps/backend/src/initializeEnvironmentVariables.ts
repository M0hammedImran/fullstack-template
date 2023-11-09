import { z } from 'zod';

const envVariables = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).optional().default('development'),
    APP_PORT: z.string().transform(Number),

    DB_HOST: z.string(),
    DB_PORT: z.string().transform(Number),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    SESSION_SECRET: z.string(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().regex(/^\d+$/).optional().default('6379').transform(Number),
    REDIS_PASSWORD: z.string(),
    REDIS_TLS: z
        .enum(['true', 'false'])
        .optional()
        .default('false')
        .transform((arg) => (arg === 'true' ? true : false)),
    REDIS_DB: z.string().regex(/^\d+$/).transform(Number),

    CORS_URL: z
        .string()
        .optional()
        .default('*')
        .transform((arg) => {
            if (arg === '*') {
                return arg.split(',');
            }

            return arg.split(',');
        }),
});

export function init() {
    const env = envVariables.parse(process.env);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.env = env as unknown as any;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface ProcessEnv extends z.infer<typeof envVariables> {}
    }
}
