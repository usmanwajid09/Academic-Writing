# Deploying GlobeAcademics.com to Hostinger (Beginner Guide)

Your website is a **Node.js app** (it has a login/signup/orders backend). It must be
deployed as a **Node.js Application** on Hostinger — NOT as plain files. This is why
signup did not work before. Hostinger **Business** plan supports this.

You will upload one file: **`globeacademics-deploy.zip`** (already prepared for you in
this folder). Hostinger does the rest (installs everything and builds it).

---

## STEP 1 — Log in to Hostinger
1. Go to **https://hpanel.hostinger.com**
2. Log in with your account (`Swiftbus076@gmail.com`).

## STEP 2 — Create the Node.js application
1. In the left sidebar click **Websites**.
2. Click the **+ Add Website** button.
3. From the options choose **Node.js Apps** (sometimes shown as "Web Apps / Node.js").
4. When asked **how to add your code**, choose **"Upload your website files"**
   (the option to upload a `.zip`). *(Not the GitHub option.)*
5. Upload the file **`globeacademics-deploy.zip`** from this project folder.

## STEP 3 — Build settings
When Hostinger asks for settings, enter these **exactly**:

| Field | Value |
|-------|-------|
| Framework | **Other** (if asked) |
| Node.js version | **20.x** (or 22.x) |
| Build command | `npm run build` |
| Start / Entry file | `server.js` |
| Output directory | `dist` |
| Application root | leave default (the project root) |

> If you don't see a "Build command" box, that's OK — pick the entry file `server.js`
> and continue; the build runs automatically.

## STEP 4 — Environment variables (IMPORTANT — makes login secure)
Find the **Environment Variables** section (in the setup wizard or, after creating the
app, in the app's dashboard). Add these three:

| Name | Value |
|------|-------|
| `JWT_SECRET` | `a2e717366af130ccd25c3e5d0a46e8301acba1c79686493adeae6a726332a93f0282c7f95aa5d7721300078fefbb0cc3` |
| `CORS_ORIGIN` | `https://globeacademics.com,https://www.globeacademics.com` |
| `NODE_ENV` | `production` |

> Do NOT set a `PORT` variable — Hostinger sets the port automatically and the app reads it.

## STEP 5 — Deploy
Click **Deploy**. Wait for the build to finish (1–3 minutes). You should see a
"Deployment successful" message and a preview screenshot.

## STEP 6 — Connect your domain (GlobeAcademics.com)
1. In the Node.js app dashboard look for **Domains** or **Connect domain**.
2. Choose **GlobeAcademics.com** (your domain is already in this Hostinger account).
3. Also add **www.globeacademics.com** if offered.
4. Save. Hostinger will set up HTTPS (the padlock) automatically — this can take a few
   minutes up to an hour.

## STEP 7 — Test it
1. Open **https://globeacademics.com** in your browser.
2. Click **Sign Up**, create a test account — it should log you straight in.
3. Two ready-made staff logins exist for you to check the dashboard
   (password `password123`):
   - Admin: `admin@academic.com`
   - Writer: `writer@academic.com`
   - **Change these passwords later** by registering your own and asking your developer
     to update roles.

---

## If something goes wrong
- **Build failed:** open the deployment **Log** in the dashboard and send me the red
  error lines.
- **Page loads but signup says "Failed":** the `CORS_ORIGIN` value is likely wrong —
  make sure it matches your real domain exactly (with `https://`).
- **Site shows old version after a change:** in the dashboard click **Redeploy**.

## Updating the site later
When changes are made, you get a new `globeacademics-deploy.zip`. In the app dashboard
choose **Redeploy / Upload files**, upload the new zip, and click Deploy again.
