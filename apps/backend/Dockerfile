# BUILD FOR PRODUCTION
FROM node:20-alpine As base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# PRODUCTION
FROM base
# Copy the bundled code from the build stage to the production image
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env.production ./.env

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main" ]
