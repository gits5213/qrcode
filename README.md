# Personal QR Code Generator

A beautiful React application that generates QR codes containing your personal information. Perfect for sharing your contact details, websites, and professional links in a convenient QR code format.

## Features

- 📝 Input form for personal information:
  - Full Name
  - Phone Number
  - WhatsApp Number
  - Personal Website
  - Training Website
  - Educational Website
  - Portfolio Website
- 🎨 Modern and responsive UI design
- 📱 QR code generation in vCard format (compatible with contact scanners)
- 💾 Download QR code as PNG image
- ⚡ Built with React and Vite for fast development

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

3. Fill in your personal information in the form

4. Your QR code will be generated automatically as you type

5. Click "Download QR Code" to save it as a PNG image

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

### Setup Instructions:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Push your code** to the `main` branch:
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

3. **The workflow will automatically**:
   - Build your React app
   - Deploy it to GitHub Pages
   - Run on every push to `main` branch

4. **Access your deployed site** at:
   - `https://yourusername.github.io/qrcode/`
   - (Replace `yourusername` with your GitHub username and `qrcode` with your repository name)

### Customizing the Base Path

If your repository name is different or you want to deploy to a custom domain:
- Edit `vite.config.js` and change the `base` variable
- For root deployment (username.github.io), change to `base: '/'`
- For a different repository name, change `/qrcode/` to `/[your-repo-name]/`

## Technologies Used

- React 18
- Vite
- qrcode.react
- CSS3 (with modern gradients and animations)

## License

MIT

