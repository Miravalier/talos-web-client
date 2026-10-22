.DEFAULT_GOAL = dev


.PHONY: image
image:
	docker build -f Dockerfile -t talos-web-client .


.PHONY: dev
dev: image
	docker run --rm -it \
		--name talos-web-client \
		--env-file .env \
		-p 8080:8080 \
		talos-web-client


.PHONY: run
run: image
	docker compose up -d


.PHONY: stop
stop:
	docker compose down
