# Portfolio

This is a GitHub Pages portfolio site.

## Publish it with GitHub Pages

1. Create a new GitHub repository named `YOUR-USERNAME.github.io`.
   Do not add a README, `.gitignore`, or license when creating it, because this folder already has files.
2. Connect this local repository to GitHub:

   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git branch -M main
   git push -u origin main
   ```

3. In the GitHub repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/(root)`, then click **Save**.
6. Visit `https://YOUR-USERNAME.github.io` after GitHub finishes deploying.

The home page is `index.html` in the repository root. Edit it locally, commit, and push each update:

```powershell
git add .
git commit -m "Describe the change"
git push
```

GitHub Pages sites are public, so do not commit passwords, API keys, or other private information.
