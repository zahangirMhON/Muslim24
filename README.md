# 🌙 ইসলামিক লাইফ ২৪/৭ (Islamic Life 24/7)

২৪/৭ নিরবচ্ছিন্ন ইসলামিক রেডিও, নামাজের সময়সূচি, আজান, দোয়া, জিকির, অফলাইন PWA পঞ্জিকা ও এআই জ্ঞানকোষ।

---

## 🚀 GitHub থেকে Netlify তে ডিপ্লয় করার নিয়ম (Netlify Deployment Guide)

এই প্রোজেক্টটিতে Netlify-এর সকল কনফিগারেশন (`netlify.toml` এবং `_redirects`) ইতিমধ্যে সেটআপ করা রয়েছে। 

### ধাপ ১: GitHub এ আপলোড করুন
১. এই প্রোজেক্টটি আপনার GitHub অ্যাকাউন্টে একটি নতুন Repository তে Push করুন।

### ধাপ ২: Netlify তে কানেক্ট করুন
১. [Netlify](https://app.netlify.com/) এ লগইন করুন।
২. **"Add new site"** -> **"Import an existing project"** এ ক্লিক করুন।
৩. **"GitHub"** সিলেক্ট করুন এবং আপনার `Islamic-Life-247` রিপোজিটরিটি বেছে নিন।

### ধাপ ৩: Build Settings (স্বয়ংক্রিয়ভাবে লোড হবে)
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `20`

### ধাপ ৪: ডিপ্লয়
- **"Deploy site"** বাটনে ক্লিক করুন। মাত্র ১-২ মিনিটের মধ্যে আপনার ফ্রি লাইভ ডোমেইন লিংক (যেমন: `https://your-islamic-app.netlify.app`) চালু হয়ে যাবে!

---

## ✨ প্রধান বৈশিষ্ট্যসমূহ:
- 🔔 **টপ ফ্লোটিং ব্যানার পপ-আপ ও সুমধুর সাউন্ড চিম**
- 📱 **ডিভাইস নিজস্ব পুশ নোটিফিকেশন (Device Push Notifications)**
- 🕌 **নামাজের ওয়াক্তে অটো-আজান ও আজানের দোয়া**
- 📻 **২৪/৭ নিরবচ্ছিন্ন ইসলামিক তিলাওয়াত ও অডিও রেডিও**
- 📲 **১০০% অফলাইন সাপোর্টেড PWA (Progressive Web App)**
