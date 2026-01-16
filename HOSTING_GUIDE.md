# How to Host HabitOS Website for Free

You have a few excellent options to host this static website for free.

## Option 1: Netlify Drop (Easiest - No Sign-up required for simple test)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Open your file explorer to `D:\HabitOS website`.
3. Drag and drop the **entire folder** into the "Drop your site folder here" box on the webpage.
4. Your site will be live instantly! You can claim it creating an account later if you want to keep the URL.

## Option 2: Vercel (Professional & Fast)
1. Go to [https://vercel.com](https://vercel.com) and sign up (or login).
2. Install Vercel CLI by running this command in your terminal:
   ```bash
   npm i -g vercel
   ```
3. Run the valid command in this folder:
   ```bash
   vercel
   ```
4. Follow the prompts (Keep pressing Enter for defaults).
5. You will get a production URL (e.g., `https://habitos-website.vercel.app`).

## Option 3: GitHub Pages (Best for Version Control)
1. Create a new repository on GitHub named `habitos-website`.
2. Push this folder to that repository using these commands:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/habitos-website.git
   git push -u origin main
   ```
3. Go to Repository Settings -> Pages.
4. Set "Source" to `main` branch.
5. Your site will be live at `https://YOUR_USERNAME.github.io/habitos-website`.
