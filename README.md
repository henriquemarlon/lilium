<br>
<p align="center">
    <img src="https://github.com/Mugen-Builders/.github/assets/153661799/7ed08d4c-89f4-4bde-a635-0b332affbd5d" align="center" width="20%">
</p>
<br>
<div align="center">
    <i>An EVM Linux-powered coprocessor as an tree image detector</i>
</div>
<div align="center">
<b>Tree image detector YOLOv8 based model powered by EigenLayer cryptoeconomic security</b>
</div>
<br>
<p align="center">
	<img src="https://img.shields.io/github/license/henriquemarlon/lilium?style=default&logo=opensourceinitiative&logoColor=white&color=79F7FA" alt="license">
	<img src="https://img.shields.io/github/last-commit/henriquemarlon/lilium?style=default&logo=git&logoColor=white&color=868380" alt="last-commit">
</p>

##  Table of Contents

- [Prerequisites](#prerequisites)
- [Running](#running)
- [Demo](#demo)

###  Prerequisites

1. [Install Docker Desktop for your operating system](https://www.docker.com/products/docker-desktop/).

    To install Docker RISC-V support without using Docker Desktop, run the following command:
    
   ```shell
    docker run --privileged --rm tonistiigi/binfmt --install all
   ```

2. [Download and install the latest version of Node.js](https://nodejs.org/en/download)

3. Cartesi CLI is an easy-to-use tool to build and deploy your dApps. To install it, run:

   ```shell
   npm i -g @cartesi/cli
   ```

4. [Install the Cartesi Coprocessor CLI](https://docs.mugen.builders/cartesi-co-processor-tutorial/installation)

###  Running

1. Start the devnet coprocessor infrastructure:

```bash
cartesi-coprocessor start-devnet
```

2. Build and Publish the application:

```sh
cd coprocessor
cartesi-coprocessor publish --network devnet
```

3. Deploy `TreeDetector.sol` and `Token.sol` contract:

> [!NOTE]
> The following step requires some extra information provided by the command bellow on `/coprocessor`:
> ```bash
> cartesi-coprocessor address-book
> ```
> Output sample:
> ```bash
> Machine Hash         0xdb1d7833f57f79c379e01b97ac5a398da31df195b1901746523be0bc348ccc88
> Devnet_task_issuer   0x95401dc811bb5740090279Ba06cfA8fcF6113778
> Testnet_task_issuer  0xff35E413F5e22A9e1Cc02F92dcb78a5076c1aaf3
> payment_token        0xc5a5C42992dECbae36851359345FE25997F5C42d
> ```
   
```sh
make setup
make detector
```

Output sample:

```bash
[⠊] Compiling...
No files changed, compilation skipped
Enter Coprocessor address: <devnet_task_issuer>
Enter Machine Hash: <machine_hash>
```

4. Run the frontend:

> [!WARNING]
> Before run the frontend, please update the `.env.local` file with the Token and TreeDetector ( CoprocessorAdapter ) addresses deployed:
> ```bash
> NEXT_PUBLIC_PROJECT_ID="e47c5026ed6cf8c2b219df99a94f60f4"
> NEXT_PUBLIC_TOKEN_CONTRACT=""
> NEXT_PUBLIC_COPROCESSOR_ADAPTER=""
> ```

```sh
make frontend
```

### Demo

https://github.com/user-attachments/assets/7b6d68a8-c37c-4890-a7e1-f1d0a8e0216e
