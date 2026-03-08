# 🚀 Anthony's Portfolio with AI Assistant

A stunning portfolio website featuring an **AI-powered personal secretary** that answers questions about Anthony 24/7.

**⚠️ THE AI ISN'T WORKING? READ [SETUP_GUIDE.md](SETUP_GUIDE.md) FOR COMPLETE STEP-BY-STEP INSTRUCTIONS!**

---

## ✨ Features

✅ **AI Personal Secretary** - Responds to visitor inquiries about Anthony  
✅ **Smart Icon** - Professional secretary icon with animated popup messages  
✅ **Admin Panel** - Easy dashboard to update your information (visit `/admin.html`)  
✅ **Serverless Backend** - Runs on Netlify Functions (no server needed)  
✅ **Safe & Secure** - All sensitive data stored securely  
✅ **Works Offline** - Portfolio works perfectly with or without AI  
✅ **Mobile Responsive** - Looks great on all devices  
✅ **Theme Toggle** - Light/Dark mode  

---

## 🚀 Quick Start

### The AI Isn't Working? Do This:

1. **Read [SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete step-by-step setup (5 minutes)
2. You need three free accounts:
   - Supabase (database)
   - OpenAI (AI)
   - Netlify (hosting)
3. Follow the guide - it walks you through everything!

---

## 📋 What You Need

- **Supabase Account** (free) - For storing your personal data
- **OpenAI Account** (free) - For AI responses
- **Netlify Account** (free) - For deploying the website
- **GitHub Account** (free) - For version control

---

## 💡 How It Works

1. **Visitor clicks the secretary icon** → Chat opens
2. **Visitor types a question** → "What does Anthony do?"
3. **AI pulls your data** → Looks up your skills, experience, etc.
4. **AI responds naturally** → "Anthony is a web developer with 3+ years..."
5. **You can update info anytime** → Visit `/admin.html` to add/edit data

---

## 🛠️ Setup Steps (Quick Version)

**For detailed instructions with step-by-step walkthroughs, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

### 1. Create Supabase Project & Database
```sql
CREATE TABLE personal_data (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

INSERT INTO personal_data (key, value) VALUES
  ('Name', 'Anthony'),
  ('Profession', 'Web Developer'),
  ('Skills', 'HTML, CSS, JavaScript, React');
```

### 2. Get API Keys
- Supabase: Project URL + anon key
- OpenAI: API key

### 3. Deploy to Netlify
1. Push code to GitHub
2. Connect GitHub to Netlify
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `ADMIN_PASSWORD`

---

## 🧪 Testing

1. Go to your Netlify domain
2. Click the secretary icon (bottom right)
3. Type: "Who is Anthony?"
4. Should get an AI response!

If it doesn't work → **Read [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## 📝 Update Your Information

Visit `/admin.html` and add information:

**Example:**
- Key: "Current Projects"
- Value: "Building an e-commerce site with React"
- Password: (your admin password)

The AI will now include this in responses!

---

## 🔐 Security

- API keys stored as **environment variables** (not in code)
- Admin password protects data updates
- Supabase has built-in security
- OpenAI API secured with key authentication

---

## 💰 Costs

- **Supabase**: FREE
- **OpenAI**: ~$0.002 per chat message (very cheap)
- **Netlify**: FREE
- **GitHub**: FREE

**Total: FREE or ~$5-10/month for high volume**

---

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Netlify Functions (serverless)
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5-turbo
- **Hosting**: Netlify
- **Icons**: Font Awesome

---

## ❓ Troubleshooting

**Q: "Sorry, I'm having trouble connecting"**  
A: See [SETUP_GUIDE.md](SETUP_GUIDE.md) - You haven't set up the environment variables yet

**Q: "Unauthorized" when updating info**  
A: Check your `ADMIN_PASSWORD` environment variable in Netlify

**Q: No data showing up**  
A: Make sure the `personal_data` table exists in Supabase

---

## 📚 For Complete Instructions

**[👉 READ SETUP_GUIDE.md 👈](SETUP_GUIDE.md)**

It has:
- Step-by-step screenshots
- Copy-paste SQL code
- Troubleshooting tips
- Example data to add
- Security best practices

---

## 🎉 You're All Set!

Once set up, your AI assistant will:
- ✅ Answer questions about you 24/7
- ✅ Learn new information as you add it
- ✅ Impress visitors with professionalism
- ✅ Never need human intervention

Enjoy! 🚀
