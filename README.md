# ✂️ J-CUTZ v2 — Premium Barber Salon Website
### Frontend Only · WhatsApp Redirect Booking · No Backend Required

---

## 🗂️ Project Structure

```
j-cutz-v2/
├── index.html          ← Full website
├── css/
│   └── style.css       ← All styles (Red, White, Black theme)
├── js/
│   └── script.js       ← All JavaScript logic
└── assets/
    ├── images/         ← Add your own photos here (optional)
    └── icons/
```

---

## 🚀 How to Run Locally

**Option A — VS Code Live Server (recommended)**
1. Open the folder in VS Code
2. Install the "Live Server" extension
3. Right-click `index.html` → Open with Live Server
4. Opens at `http://localhost:5500`

**Option B — Direct browser**
1. Just double-click `index.html`
2. Opens directly in your browser

> No Node.js, no npm, no backend needed!

---

## 📱 How the WhatsApp Booking Works

1. Customer fills in the booking form
2. Clicks **"Confirm Booking via WhatsApp"**
3. Form validates all fields
4. A loading animation plays for ~1.4 seconds
5. A success modal appears with their booking summary
6. A **3-second countdown** begins
7. WhatsApp opens automatically with the pre-filled message
8. Customer just hits **Send** — done!

The salon receives a beautifully formatted message like:
```
✂️ NEW J-CUTZ BOOKING
━━━━━━━━━━━━━━━━━━━━━

👤 Name: John Adewale
📞 Phone: 08012345678
💈 Service: VIP Grooming
📅 Date: May 20, 2026
⏰ Time: 4:00 PM
📝 Notes: Skin fade + beard shaping

━━━━━━━━━━━━━━━━━━━━━
_Sent from J-Cutz website_
```

---

## ⚙️ Changing the WhatsApp Number

Open `js/script.js` and change **line 12**:

```js
const WHATSAPP_NUMBER = '2349124528495'; // ← Change this
```

Format: country code + number, **no spaces, no +, no dashes**
- Nigeria: `2348012345678`
- UK: `447911123456`

---

## ☁️ Deployment (No Backend Needed!)

### Netlify (Drag & Drop — Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag your `j-cutz-v2` folder into the deploy area
3. Done! Live in seconds. Free.

### Vercel
```bash
npx vercel
# Follow the prompts — select the j-cutz-v2 folder
```

### GitHub Pages
1. Push folder to a GitHub repo
2. Go to Settings → Pages → Deploy from branch
3. Select `main` / `root` → Save
4. Live at `https://yourusername.github.io/repo-name`

---

## 🎨 Customization

### Colors
Edit `css/style.css` top variables:
```css
:root {
  --red:      #C8102E;  /* Main brand red */
  --red-dark: #9E0C24;  /* Hover state */
}
```

### Business Details
Search and replace in `index.html`:
- `Victoria Island, Lagos` → your address
- `+234 912 452 8495` → your phone
- `hello@jcutz.com` → your email

### Service Prices
All prices are in the services section in `index.html` — just update the text.

---

## 📦 Tech Stack

| What | How |
|------|-----|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, grid, flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Images | Unsplash (free, no attribution required) |
| Icons | Font Awesome 6 |
| Fonts | Bebas Neue · Playfair Display · DM Sans |
| Booking | WhatsApp redirect (`wa.me` link) |
