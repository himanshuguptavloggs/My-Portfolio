# Portfolio Customization Checklist

Quick reference for updating your portfolio with your own information.

## 📝 Content Updates

### 1. Hero Section (`index.html`)
- [ ] Change name from "Sagar Rathore" to your name
- [ ] Update subtitle/role
- [ ] Update hero description
- [ ] Add your social media links (GitHub, LinkedIn, Twitter)
- [ ] Update profile image path

### 2. About Section
- [ ] Update your bio/introduction
- [ ] Change statistics (Projects, Years, Clients)
- [ ] Replace placeholder image with your photo
- [ ] Update experience details

### 3. Skills Section
- [ ] Customize skill categories if needed
- [ ] Update skill names
- [ ] Adjust skill percentages based on your expertise
- [ ] Modify tech stack icons/labels

### 4. Projects Section
- [ ] Add your 6 best projects
- [ ] Add project titles and descriptions
- [ ] Update technology tags for each project
- [ ] Add links to live demos and GitHub repos
- [ ] Update project icons/images

### 5. Services Section
- [ ] Customize 6 services you offer
- [ ] Update service descriptions
- [ ] Modify service icons
- [ ] Update service features

### 6. Contact Section
- [ ] Update email address
- [ ] Update phone number
- [ ] Update WhatsApp link (use your actual number)
- [ ] Update location
- [ ] Add correct social media links
- [ ] Set up form backend integration

### 7. Navigation
- [ ] Verify all nav links work correctly
- [ ] Test mobile menu

---

## 🎨 Style Updates

### Change Color Scheme
Edit `css/styles.css` `:root` section:

```css
:root {
    --primary-color: #6366f1;      /* Change primary blue */
    --secondary-color: #8b5cf6;    /* Change secondary purple */
    --accent-color: #ec4899;       /* Change accent pink */
    --dark-bg: #0f172a;            /* Adjust dark background */
    --text-primary: #f1f5f9;       /* Text color */
}
```

### Popular Color Combinations

**Blue/Purple (Current)**
- Primary: #6366f1
- Secondary: #8b5cf6
- Accent: #ec4899

**Teal/Cyan**
- Primary: #14b8a6
- Secondary: #06b6d4
- Accent: #0891b2

**Green/Lime**
- Primary: #10b981
- Secondary: #34d399
- Accent: #6ee7b7

**Orange/Red**
- Primary: #f97316
- Secondary: #fb923c
- Accent: #ff6b6b

**Pink/Magenta**
- Primary: #d946ef
- Secondary: #e879f9
- Accent: #f472b6

---

## 🔗 Links to Update

### WhatsApp Link Format
```
https://wa.me/919876543210
(Replace 919876543210 with your number)
```

### Email Link Format
```
mailto:your.email@example.com
```

### Social Media Links Format
- GitHub: `https://github.com/your-username`
- LinkedIn: `https://linkedin.com/in/your-profile`
- Twitter: `https://twitter.com/your-handle`
- Instagram: `https://instagram.com/your-handle`

---

## 📸 Image Guidelines

### Image Sizes
- Profile Photo: 300x300px minimum
- Project Thumbnails: 800x600px minimum
- Social Icons: 32x32px (use Font Awesome instead)

### Image Compression
Use online tools:
- TinyPNG.com
- Compressor.io
- ImageOptim (Mac)

### Where to Add Images
1. Create `assets/images/` folder
2. Add your images there
3. Update paths in HTML

---

## 🔧 Advanced Customizations

### Add New Project
```html
<div class="project-card slide-up">
    <div class="project-image">
        <div class="image-placeholder">
            <i class="fas fa-icon-name"></i>
        </div>
        <div class="project-overlay">
            <div class="project-links">
                <a href="your-live-link" class="icon-btn">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="your-github-link" class="icon-btn">
                    <i class="fab fa-github"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="project-content">
        <h3>Project Title</h3>
        <p>Project description here.</p>
        <div class="project-tags">
            <span class="tag">Tech 1</span>
            <span class="tag">Tech 2</span>
        </div>
    </div>
</div>
```

### Add New Service
```html
<div class="service-card fade-in">
    <div class="service-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Service Title</h3>
    <p>Service description</p>
    <ul class="service-list">
        <li><i class="fas fa-check"></i> Feature 1</li>
        <li><i class="fas fa-check"></i> Feature 2</li>
        <li><i class="fas fa-check"></i> Feature 3</li>
    </ul>
</div>
```

### Change Typing Phrases
Edit in `js/script.js`:
```javascript
const phrases = [
    'Your Phrase 1',
    'Your Phrase 2',
    'Your Phrase 3',
    'Your Phrase 4'
];
```

### Modify Animation Duration
Edit in `css/styles.css`:
```css
@keyframes slideInUp {
    /* Change the 0.8s to adjust speed */
    animation: slideInUp 0.8s ease forwards;
}
```

---

## ✅ Testing Checklist

- [ ] All links work (internal and external)
- [ ] Contact form validation works
- [ ] Mobile responsive on phones/tablets
- [ ] Animations work smoothly
- [ ] Images load correctly
- [ ] Social links work
- [ ] WhatsApp link works on mobile
- [ ] Typing animation works
- [ ] Scroll animations trigger
- [ ] Mobile menu opens/closes
- [ ] No console errors

---

## 🚀 Deployment Checklist

- [ ] All images optimized
- [ ] Contact form backend configured
- [ ] Social links updated
- [ ] Email address verified
- [ ] Phone number correct
- [ ] Domain/URL ready
- [ ] SSL certificate configured
- [ ] 404 page setup (if needed)
- [ ] Analytics added (Google Analytics)
- [ ] Final testing on live URL

---

## 🎯 Performance Optimization

### Before Deployment:
1. Compress all images
2. Minify CSS/JS (optional, not huge impact)
3. Enable browser caching
4. Use CDN for resources (already using Font Awesome CDN)
5. Test load time with PageSpeed Insights

### Monitoring:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (Chrome DevTools)

---

## 📞 Common Updates

### Monthly
- Update project showcase if you complete new projects
- Update skill percentages
- Refresh social media links

### Quarterly
- Review and update about section
- Add new testimonials if using
- Update project statistics

### Yearly
- Major design refresh (optional)
- Update colors if trend changes
- Archive old projects

---

## 🔒 Security Reminders

- Never commit API keys to version control
- Use environment variables for sensitive data
- Validate all form inputs server-side
- Use HTTPS only
- Keep dependencies updated
- Monitor for broken links

---

## 📚 Useful Resources

### Design Tools
- Figma - Design mockups
- Adobe XD - UI design
- Canva - Quick graphics

### Hosting
- Vercel - Great for portfolios
- Netlify - Easy deployment
- GitHub Pages - Free option
- Firebase Hosting - Google solution

### Optimization
- TinyPNG - Image compression
- Google Fonts - Free fonts
- Font Awesome - Icons
- Unsplash/Pexels - Free images

### Testing
- Chrome DevTools - Built-in testing
- BrowserStack - Cross-browser testing
- GTmetrix - Performance analysis
- Lighthouse - Chrome audit tool

---

## 💡 Tips for Success

1. **Keep it Updated** - Update projects regularly
2. **Show Recent Work** - Highlight latest projects
3. **Tell Your Story** - Make about section engaging
4. **Responsive First** - Test on all devices
5. **Fast Loading** - Optimize images
6. **Call-to-Action** - Make it easy to contact
7. **Contact Info** - Make it prominent
8. **Social Proof** - Add testimonials later
9. **SEO Ready** - Add keywords naturally
10. **Mobile Focus** - Most visitors use mobile

---

Remember: Your portfolio is a living document. Update it regularly to reflect your growth and latest work!
