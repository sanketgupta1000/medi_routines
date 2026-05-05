# Medi Routines

## Dev Architecture

```
┌─ Local Machine ───────────────────────────────────────────────┐
│                                                               │
│  ┌─ Browser ────────┐                                         │
│  │                  │                                         │
│  │  :X              │                                         │
│  └──┬────────┬──────┘                                         │
│     │        │                                                │
│     │ :8000  │ :5173                                          │
│     │ port   │ port                                           │
│     │ binding│ binding                                        │
│     │        |─────────                                       |
│  ┌────────────────────|──────Docker────────────────────────┐  │
│  │  |                 │                                    │  │
│  │  ▼───────────┐  ┌──▼───────────┐  ┌─────────────────┐   |  │
│  │  │           │  │              │  │                 │   │  │
│  │  │ Backend   │  │  Frontend    │  │  Database       │   │  │
│  │  │ :8000     │  │  :5173       │  │  :27017         │   │  │
│  │  │           │  │              │  │                 │   │  │
│  │  └─────┬─────┘  └──────────────┘  └─────────────────┘   │  │
│  │        │                                    ▲           │  │
│  │        └────────────────────────────────────┘           │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Prod Architecture

```
                         ┌─ Cloud VM ─────────────────────────────────────────────┐
                         │                                                        │
                         │  ┌─ Docker ─────────────────────────────────────────┐  │
                         │  │                                                  │  │
  Internet  ──:80 port───┼──▶  Nginx :80                                       │  │
               binding   │  │     │                                            │  │
                         │  │     ├── /api ──▶   ┌───────────┐                 │  │
                         │  │     │              │  Backend  │                 │  │
                         │  │     │              │  :8000    ├──▶ ┌──────────┐ │  │
                         │  │     │              └───────────┘    │ Database │ │  │
                         │  │     │                               │ :27017   │ │  │
                         │  │     └── /  ────▶  ┌───────────┐     └──────────┘ │  │
                         │  │                   │  Frontend │                  │  │
                         │  │                   │  :3000    │                  │  │
                         │  │                   └───────────┘                  │  │
                         │  └──────────────────────────────────────────────────┘  │
                         │                                                        │
                         └────────────────────────────────────────────────────────┘
```

Only port 80 is exposed publicly. Backend, frontend, and database communicate internally over Docker's network.

---

## Dev Environment Setup

The dev environment is fully Dockerized — no need to install Node, MongoDB, or any other dependencies locally. The only setup required is creating the environment files.

**Backend** — create `medi_routines_backend/.env`

**Frontend** — create `medi_routines_frontend/.env`

### Start Dev Server
```bash
docker compose -f compose.dev.yml -p dev watch
```

### Run tests
```bash
docker compose -f compose.test.yml -p test up --exit-code-from backend --build
```

---

## Deployment

### Current Setup

The app is deployed on a single cloud VM (Azure). Refer to the prod architecture above — all services run as Docker containers on the VM, with Nginx as the single public entry point on port 80.

### First Time / One-Time Setup

**1. SSH into the VM**
```bash
ssh azureuser@<vm-ip>
```

**2. Install Docker**
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

**3. Clone the repo**
```bash
git clone https://github.com/sanketgupta1000/medi_routines.git
cd medi_routines
```

**4. Exit the VM**
```bash
exit
```

**5. Create `.env.prod` locally** at `medi_routines_backend/.env.prod`:
```dotenv
JWT_SECRET=
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=
```

**6. Copy `.env.prod` to the VM**
```bash
scp ./medi_routines_backend/.env.prod azureuser@<vm-ip>:~/medi_routines/medi_routines_backend/.env.prod
```

**7. SSH back in and start the server**
```bash
ssh azureuser@<vm-ip>
cd medi_routines
docker compose -f compose.prod.yml -p prod up -d --build
```

---

### Subsequent Deploys

After updated code is merged into `main`, run from your local machine:

```bash
./deploy.sh
```