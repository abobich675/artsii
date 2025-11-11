#!/bin/sh
npx prisma generate

# Start Python script in the background
python3 scripts/app.py &

# Start Next.js in the foreground
npm start