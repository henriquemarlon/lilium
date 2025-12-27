# LOADING ENV FILE
-include ./contracts/.env

START_LOG = @echo "==================== START OF LOG ===================="
END_LOG = @echo "==================== END OF LOG ======================"

.PHONY: setup
setup: ./contracts/.env.tmpl
	@cd contracts; forge install; cp .env.tmpl .env
	@cd frontend; npm install

.PHONY: frontend
frontend:
	@echo "Starting frontend..."
	@cd frontend; npm run dev

.PHONY: detector
detector:
	@echo "Deploying detector..."
	$(START_LOG)
	@forge test --root ./contracts
	@forge script ./contracts/script/Deploy.s.sol \
			--root ./contracts \
			--rpc-url $(RPC_URL) \
			--private-key $(PRIVATE_KEY) \
			--broadcast \
			-vvv
	$(END_LOG)