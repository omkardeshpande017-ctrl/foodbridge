# FoodBridge — Final Full-Stack Project

FoodBridge is a food donation and delivery management platform for Donors, NGOs, Volunteers and Admins.

## Stack

- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB
- JWT authentication
- Recharts
- Lucide React

## Required software

- Node.js 18+
- npm
- Docker Desktop

## First-time setup

### Terminal 1 — MongoDB

```bash
docker run -d --name foodbridge-mongo -p 27017:27017 mongo:7
```

If the container already exists, use:

```bash
docker start foodbridge-mongo
```

### Terminal 2 — Backend

```bash
cd ~/Downloads/foodbridge-final/backend
npm install
npm run seed
npm run dev
```

Backend: http://localhost:5001
Health: http://localhost:5001/api/health

### Terminal 3 — Frontend

```bash
cd ~/Downloads/foodbridge-final/frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Every normal restart

You do NOT need `npm install` or `npm run seed` again.

### Terminal 1

```bash
cd ~/Downloads/foodbridge-final
docker start foodbridge-mongo
docker ps
```

### Terminal 2

```bash
cd ~/Downloads/foodbridge-final/backend
npm run dev
```

### Terminal 3

```bash
cd ~/Downloads/foodbridge-final/frontend
npm run dev
```

Then open http://localhost:5173

## Demo accounts

All seeded accounts use the password `password123`.

| Role | Email | Password |
|---|---|---|
| Admin | admin@foodbridge.app | password123 |
| Donor | donor@foodbridge.app | password123 |
| NGO | ngo@foodbridge.app | password123 |
| Volunteer | volunteer@foodbridge.app | password123 |

For Admin login select **Admin** as the role.

## If the database needs to be reset

Run this only when you intentionally want to recreate the demo data:

```bash
cd ~/Downloads/foodbridge-final/backend
npm run seed
```

## Stop the project

Press `Ctrl + C` in Terminal 2 and Terminal 3.

To stop MongoDB:

```bash
docker stop foodbridge-mongo
```

## Ports

- MongoDB: `27017`
- Backend API: `5001`
- Frontend: `5173`

## Important

Do not open the backend port in the browser as the main website. The website is:

http://localhost:5173

The backend health check is:

http://localhost:5001/api/health
