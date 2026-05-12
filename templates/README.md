# Content Templates

Copy the right template, fill it in, save with the correct filename, drop in the right folder.

---

## File Naming

| Type    | Folder               | Filename pattern                        |
|---------|----------------------|-----------------------------------------|
| News    | `content/news/`      | `YYYY-MM-DD-short-slug.md`              |
| Review  | `content/reviews/`   | `game-title.md` (no date)               |
| Opinion | `content/opinion/`   | `YYYY-MM-DD-short-slug.md`              |

**Examples:**
- `content/news/2026-05-19-forza-horizon-6-launch.md`
- `content/reviews/forza-horizon-6.md`
- `content/opinion/2026-05-20-open-world-fatigue.md`

---

## Images

| Type    | Folder                    | Filename                  |
|---------|---------------------------|---------------------------|
| News    | `public/images/news/`     | matches the news slug      |
| Review  | `public/images/reviews/`  | matches the review slug    |
| Opinion | `public/images/opinion/`  | matches the opinion slug   |

**Image path in frontmatter always starts with `/images/` — not `public/`.**

Good: `image: /images/news/forza-horizon-6-launch.jpg`  
Bad:  `image: /images/forza-horizon-6-launch.jpg`  
Bad:  `image: public/images/news/forza-horizon-6-launch.jpg`

---

## Quick Field Reference

### News
| Field      | Required | Notes                                         |
|------------|----------|-----------------------------------------------|
| `title`    | ✅       | Full headline in quotes                       |
| `blurb`    | ✅       | 1–2 sentence summary                          |
| `category` | ✅       | Industry · Update · Reveal · Rumor · Poll     |
| `date`     | ✅       | `YYYY-MM-DD`                                  |
| `author`   | ✅       | `Romello Morris`                              |
| `image`    | ○        | `/images/news/slug.jpg` — blank = fallback    |
| `video`    | ○        | MP4 path or YouTube URL                       |

### Review
| Field       | Required | Notes                                          |
|-------------|----------|------------------------------------------------|
| `title`     | ✅       | `"Game Name Review — Verdict Headline"`        |
| `studio`    | ✅       | Developer name in quotes                       |
| `platforms` | ✅       | Array: `[PS5, "Xbox Series X\|S", PC]`         |
| `score`     | ✅       | Number out of 10, one decimal: `8.5`           |
| `pull`      | ✅       | Pull quote shown under score — NOT `verdict`   |
| `hours`     | ✅       | Number only — NOT `hours_played`: `22`         |
| `hot`       | ✅       | `true` or `false` — red score for big releases |
| `date`      | ✅       | `YYYY-MM-DD`                                  |
| `author`    | ✅       | `Romello Morris`                              |
| `issue`     | ✅       | Current issue number in quotes: `"047"`        |
| `image`     | ✅       | `/images/reviews/game-slug.jpg`               |
| `video`     | ○        | MP4 path or YouTube URL                       |

### Opinion
| Field      | Required | Notes                                          |
|------------|----------|------------------------------------------------|
| `title`    | ✅       | Full headline in quotes                        |
| `blurb`    | ✅       | 1–2 sentence summary of your argument         |
| `category` | ✅       | `Opinion`                                     |
| `date`     | ✅       | `YYYY-MM-DD`                                  |
| `author`   | ✅       | `Romello Morris`                              |
| `image`    | ○        | `/images/opinion/slug.jpg` — blank = fallback |
| `video`    | ○        | MP4 path or YouTube URL                       |

---

## Common Mistakes

❌ `verdict:` → ✅ `pull:`  
❌ `hours_played: 22` → ✅ `hours: 22`  
❌ `image: /images/game.jpg` → ✅ `image: /images/reviews/game.jpg`  
❌ `platforms: [PS5, Xbox Series X|S]` → ✅ `platforms: [PS5, "Xbox Series X|S"]`  
❌ `author: The Gamer Scene` → ✅ `author: Romello Morris`  
❌ `score: 9` → ✅ `score: 9.0`
