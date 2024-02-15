FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS install
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN corepack install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter "./lib/**" build
RUN pnpm deploy --filter=@dybdahl-iot/device-management dev/device-management

FROM base AS device-management
COPY --from=install /usr/src/app/dev/device-management /services/device-management
WORKDIR /services/device-management
