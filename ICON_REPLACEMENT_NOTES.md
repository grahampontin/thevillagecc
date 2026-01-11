# Font Awesome to Material Icons Migration

## Summary

This document describes the replacement of Font Awesome icons with Google Material Icons throughout the website.

## Changes Made

### 1. Font Awesome CSS Removed
- Removed `/fonts/fontawesome/css/all.css` from `UserControls/Styles.ascx`
- Removed `/fonts/fontawesome/css/all.css` from `index.html`

### 2. Icon Replacements

#### Navigation & Shopping Icons
| Original (Font Awesome) | Replaced With (Material Icons) | Location |
|------------------------|-------------------------------|----------|
| `fa-solid fa-basket-shopping` | `shopping_cart` | UserControls/Head.ascx |

#### Social Media Icons ⚠️
| Original | Replaced With | Location | Notes |
|----------|--------------|----------|-------|
| `fa-brands fa-twitter` | `chat_bubble_outline` | UserControls/Head.ascx, index.html | Generic icon - see recommendations below |
| `fa-brands fa-instagram` | `photo_camera` | UserControls/Head.ascx, index.html | Generic icon - see recommendations below |
| `fa-brands fa-github` | `code` | UserControls/Footer.ascx, index.html | Generic icon - see recommendations below |

#### Chart & Analytics Icons
| Original (Font Awesome) | Replaced With (Material Icons) | Location |
|------------------------|-------------------------------|----------|
| `fa-solid fa-chart-line` | `show_chart` | LiveScorecard.aspx |
| `fa-solid fa-dharmachakra` | `donut_large` | LiveScorecard.aspx |
| `fa-solid fa-chart-column` | `bar_chart` | LiveScorecard.aspx |
| `fa-solid fa-people-arrows-left-right` | `compare_arrows` | LiveScorecard.aspx |
| `fa-solid fa-record-vinyl` | `album` | LiveScorecard.aspx |

#### Navigation Chevrons
| Original (Font Awesome) | Replaced With (Material Icons) | Location |
|------------------------|-------------------------------|----------|
| `fas fa-chevron-up` | `expand_less` | Players.html |
| `fas fa-chevron-down` | `expand_more` | Players.html |

## Important Limitation: Social Media Brand Icons

⚠️ **Material Icons does not include branded social media logos** (Twitter, Instagram, GitHub, etc.)

The current implementation uses **generic Material Icons** as temporary alternatives:
- **Twitter** → `chat_bubble_outline` (represents communication)
- **Instagram** → `photo_camera` (represents photography/social)
- **GitHub** → `code` (represents development/coding)

### Recommended Solutions for Social Media Icons

#### Option 1: Simple Icons (Recommended)
Use [Simple Icons](https://simpleicons.org/) - A free collection of SVG brand icons.

**Advantages:**
- 2000+ brand icons including all major social platforms
- Free and open source
- SVG format (scalable, lightweight)
- Regularly updated

**Implementation:**
```html
<!-- Add to head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons.css">

<!-- Use in HTML -->
<i class="si si-twitter"></i>
<i class="si si-instagram"></i>
<i class="si si-github"></i>
```

Or use inline SVG:
```html
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
</svg>
```

#### Option 2: Bootstrap Icons
Use [Bootstrap Icons](https://icons.getbootstrap.com/) - includes some social icons.

**Advantages:**
- Already using Bootstrap in the project
- Consistent styling with Bootstrap framework
- 1,800+ icons including some social media

**Implementation:**
```html
<!-- Add to head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

<!-- Use in HTML -->
<i class="bi bi-twitter"></i>
<i class="bi bi-instagram"></i>
<i class="bi bi-github"></i>
```

#### Option 3: Feather Icons
Use [Feather Icons](https://feathericons.com/) - Simple, clean icon set.

**Advantages:**
- Clean, consistent design
- Open source
- Includes some social icons

**Disadvantages:**
- Limited brand icon coverage compared to Simple Icons

#### Option 4: Custom SVG Icons
Download official brand SVG logos and embed them directly.

**Advantages:**
- Official brand assets
- Complete control over styling
- No external dependencies

**Disadvantages:**
- Need to manage multiple SVG files
- More maintenance required
- May need to follow brand guidelines

## Files Modified

1. `/TheVillageCC/villagewebsite/UserControls/Styles.ascx` - Removed Font Awesome CSS
2. `/TheVillageCC/villagewebsite/index.html` - Removed Font Awesome CSS, updated icons
3. `/TheVillageCC/villagewebsite/UserControls/Head.ascx` - Updated navigation icons
4. `/TheVillageCC/villagewebsite/UserControls/Footer.ascx` - Updated GitHub icon
5. `/TheVillageCC/villagewebsite/LiveScorecard.aspx` - Updated chart icons
6. `/TheVillageCC/villagewebsite/Players.html` - Updated chevron icons

## Testing Recommendations

1. **Visual Testing**: Check all pages to ensure icons display correctly
2. **Responsive Testing**: Verify icons work on mobile/tablet views
3. **Accessibility**: Ensure screen readers can properly interpret icon meanings (add `aria-label` or `title` attributes)
4. **Browser Testing**: Test in Chrome, Firefox, Safari, Edge

## Next Steps

1. **Evaluate social media icon solutions** and choose one from the recommendations above
2. **Implement chosen solution** for Twitter, Instagram, and GitHub icons
3. **Remove Font Awesome files** from `/fonts/fontawesome/` directory if no longer needed
4. **Test thoroughly** across all pages and devices
5. **Update any documentation** that references Font Awesome usage

## Additional Notes

- Material Icons are already loaded in the project via `material_icons.css` and variants
- Icons use the `material-icons-outlined` class for a lighter, outlined style
- All icons include proper styling for size and alignment
- Title attributes added to social media icons for better accessibility
