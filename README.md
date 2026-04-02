# Restaurant App

Next.js restaurant management application with menu, cart, orders, and admin dashboard.

## What You Need

- Node.js 22+
- npm

## How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

#Envs

```

MONGODB_URI =
BASE_URL =
JWT_SECRET =
UPLOAD_DIR =

```

```

Open [http://localhost:3000](http://localhost:3000)

## Production Images

Menu uploads are stored at runtime instead of relying on `public/uploads` being
present in the repo. In Docker, mount `/app/data/uploads` to persistent
storage so uploaded images survive container restarts and redeploys.

## Screenshots

### Home Page

![Home Page](images/Screenshot%202026-04-01%20130928.png)

### Menu Page

![Menu Page](images/Screenshot%202026-04-01%20131001.png)

### Cart

![Cart](images/Screenshot%202026-04-01%20131012.png)

### Admin Dashboard

![Admin Dashboard](images/Screenshot%202026-04-01%20131027.png)
