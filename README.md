### 📚 db.aolbeam.com – The Open Source Database Directory  

A **comprehensive** open-source directory of databases from around the world.  
🚀 "AOLBEAM" = **Access to Open Learning, Beam into the world of databases.**  

🔗 **Live Project**: [db.aolbeam.com](#)  
⭐ **Star this repo** to support the project → [GitHub Repo](#)  

---

## 🔍 About the Project  

**db.aolbeam.com** is an **open-source, community-driven** platform that provides detailed information on databases, including:  
✅ Features & capabilities  
✅ Use cases & best practices  
✅ Performance comparisons  
✅ Licensing details  

Whether you're a **developer, data engineer, or CTO**, this directory helps you pick the right database for your project.  

---

## Feature Development Plan

### 🗃️ 1. Database Details Now Stored as Markdown Files

We’re transitioning from using Supabase for storing database entries to a more **transparent and decentralized** approach:

- All submitted forms are saved in `.md` files at:  
./src/database/[db-name]/[entry-name].md

- No external database is required — all data lives within the repo.
- New edits append or update structured Markdown blocks.
- Comments and ratings will also be saved in the same `.md` files (GitHub username required).
- Anyone can read and contribute directly via GitHub — **no login required on the site**.

This change ensures full **version control**, **openness**, and easier **collaboration**.
### ✅ Feature 1: Store Database Details as Markdown in Repo

**Goal**: Move all database information from Supabase to local Markdown files for better accessibility, version control, and transparency.

#### Steps:

1. **Form Submission Handling**
   - On add/edit, the form data will be saved **locally** in the repo.
   - The data will be stored in **Markdown format** (`.md`) — not in Supabase or any external DB.

2. **Storage Path Format**
   - Files will be organized as:
     ```
     ./src/database/[db-name]/[entry-name].md
     ```

3. **Structured Markdown Format**
   - Each file will follow a structured format.
   - New edits will **append** or **update** content appropriately.

4. **Enhanced Form Fields**
   - We will add more metadata fields in the form to ensure each entry is **technology-agnostic** and informative.

5. **Usage of Markdown Files**
   - These files will power:
     - Display of DB info
     - Ratings and comments (GitHub username required for identification)
     - Other in-app functionalities

6. **Open Data Philosophy**
   - Anyone can view or use these files **directly from the GitHub repo**.
   - No need to visit the website or replicate our database.

---


---

### 🤖 2. AI Tool for Database Recommendation

We are also building an **AI-powered assistant** to help users choose the right database for their projects based on technical and business requirements.

- Users input system specs, expected load, and project goals.
- Our AI analyzes and suggests:
- Database types (SQL, NoSQL, etc.)
- Recommended architectures
- Scaling strategies and technologies
- Outputs a **strategic blueprint** to help you get started.

Stay tuned — this will be a game-changer for startups and solo devs alike!

### 🤖 Feature 2: AI-Based Database Recommendation Tool

**Goal**: Help users discover the ideal database setup for their system based on technical and business requirements.

#### Steps:

1. **User Input**
   - Users provide:
     - System specs (RAM, CPU, etc.)
     - Traffic/load expectations
     - Project use case and priorities

2. **AI-Powered Recommendation**
   - Based on inputs, the AI will:
     - Analyze data requirements
     - Suggest suitable database types (SQL/NoSQL, etc.)
     - Recommend architecture and scaling strategies

3. **Knowledge Source**
   - Recommendations will be based on:
     - Our internal markdown files (from Feature 1)
     - Verified public data sources when needed

4. **Strategic Output**
   - The tool will generate a **recommendation blueprint**.
   - Users can optionally export it as a Markdown spec for documentation.

---

## 🤝 Contributing  

We **welcome** community contributions! Here’s how you can help:  

🔹 **Add New Databases** → Contribute missing databases with key details  
🔹 **Update & Improve** → Keep database information fresh and relevant  
🔹 **Enhance UI/UX** → Improve the look, feel, and functionality of the site  
🔹 **Fix Bugs & Issues** → Help troubleshoot and refine features  
🔹 **Write Articles** → Share knowledge and database insights  

🔗 **[Contribution Guide](CONTRIBUTING.md)** – Start contributing today!  

---

## 🛠 Getting Started  

### 📌 Prerequisites  
- Install **Node.js & npm** → [Guide](https://github.com/nvm-sh/nvm#installing-and-updating)  

### 🚀 Local Development  

```sh
# Clone the repository
git clone https://github.com/sinhaKAN-ra/Access-of-Database-Learning.git

# Navigate to the project folder
cd db-directory

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 🌎 Environment Variables  
Create a `.env` file and add:  

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ⚙️ Tech Stack  

🔹 **Vite** – Fast build tool  
🔹 **TypeScript** – Safer JavaScript  
🔹 **React** – UI framework  
🔹 **shadcn-ui** – UI components  
🔹 **Tailwind CSS** – Styling  
🔹 **Supabase** – Backend & database  

---

## 🚀 Deployment  

You can deploy this project on:  
🔹 **Vercel**  
🔹 **Netlify**  
🔹 **GitHub Pages**  

---

## 📜 License  

🔹 Code: **MIT License** ([LICENSE](LICENSE))  
🔹 Database Information: **CC BY-SA 4.0** ([More Info](https://creativecommons.org/licenses/by-sa/4.0/))  

---

## 🙌 Acknowledgments  

Thanks to **all contributors** and the **open-source community** for making this project possible!  

💬 Join the discussion in **[GitHub Issues](#)** or follow us on **[Twitter](#)**!  
