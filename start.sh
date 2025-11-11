#!/bin/sh

# Start Python script in the background
python3 scripts/app.py &

# Start Next.js in the foreground
npx prisma generate
npm start