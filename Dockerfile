FROM denoland/deno:alpine-2.2.3 AS build
USER deno
WORKDIR /app
COPY . .
RUN deno cache --lock ./deno.lock main.ts && \
	rm ./deno.lock

FROM denoland/deno:alpine-2.2.3
USER deno
WORKDIR /app
COPY --from=build /app .
CMD [ "deno", "run", "prod" ]
