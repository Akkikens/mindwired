# One-time Instagram Reels API setup (~15 min, then it's automated forever)

Goal: `python3 scripts/post_reel.py --video ... --caption ...` posts straight
to Instagram Reels (kickoffdaily90). Do these steps once, yourself — they
involve logins and account settings that only you should touch.

## 1. Make the Instagram account Professional
Instagram app → Settings → Account type → **Switch to Professional → Creator**
(free, takes 30 seconds). The API only publishes to Professional accounts.

## 2. Create a Meta app
1. Go to https://developers.facebook.com → My Apps → **Create App**.
2. Use case: **"Other"** → type **Business**. Name it e.g. `kickoff-poster`.
3. In the app dashboard, add the product **"Instagram"** → choose
   **"Instagram API with Instagram Login"** (this variant does NOT need a
   Facebook Page).

## 3. Get your token + user id
1. In the app's Instagram product settings, under **API setup with Instagram
   login**, click **Add account** and log into kickoffdaily90.
2. Generate a token for that account. Grant scopes:
   `instagram_business_basic`, `instagram_business_content_publish`.
3. Copy the **access token** and the **Instagram user ID** shown next to the
   account.
4. Exchange for a long-lived token (60 days) — run:
   ```
   curl -s "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=APP_SECRET&access_token=SHORT_TOKEN"
   ```
   (APP_SECRET is in App settings → Basic.)

## 4. Add to mindwired/.env
```
IG_USER_ID=1784...
IG_ACCESS_TOKEN=IGAA...
```

## 5. Done — usage
```
python3 scripts/post_reel.py \
  --video out/kickoffdaily90_short_finaldisguise.mp4 \
  --caption "Portugal vs Spain is a FINAL in disguise 😤 Full breakdown on YouTube → kickoffdaily90 #WorldCup2026 #PortugalVsSpain #Reels"
```

Notes:
- Reels captions: reuse the YouTube Short description, swap "#Shorts" for
  "#Reels", and add "Full breakdown on YouTube → kickoffdaily90" (Reels can't
  link, so the funnel is the channel name).
- Token expires every 60 days — rerun the exchange in step 3.4 (Claude can
  remind/refresh if you keep APP_SECRET in .env as IG_APP_SECRET).
- Rate limit: 100 API-published posts per 24h — far above our volume.
- For mindwired's space Reels later: same setup with the mindwired IG account,
  store as IG_USER_ID_MINDWIRED / IG_ACCESS_TOKEN_MINDWIRED.
