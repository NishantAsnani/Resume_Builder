const express     = require('express');
const app         = express();
const PORT        = 3000;
const bodyParser  = require('body-parser');
const cors        = require('cors');
const path        = require('path');
const PDFDocument = require('pdfkit');
const fs          = require('fs');

app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next(); });

// ─── Font paths (Liberation Serif — metrically identical to Times New Roman) ──
const FONTS = {
  regular: path.join(__dirname, 'public', 'fonts', 'LiberationSerif-Regular.ttf'),
  bold: path.join(__dirname, 'public', 'fonts', 'LiberationSerif-Bold.ttf'),
  italic: path.join(__dirname, 'public', 'fonts', 'LiberationSerif-Italic.ttf'),
  boldItalic: path.join(__dirname, 'public', 'fonts', 'LiberationSerif-BoldItalic.ttf'),
};

// ─── Page geometry (Letter, ~2 cm margins — matching LaTeX template) ──────────
const PAGE_W      = 612;
const PAGE_H      = 792;
const MARGIN_X    = 57;
const MARGIN_Y    = 57;
const BODY_W      = PAGE_W - MARGIN_X * 2;
const BOTTOM_STOP = PAGE_H - MARGIN_Y;
const DATE_COL_W  = 128;
const TEXT_COL_W  = BODY_W - DATE_COL_W;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(val) {
  if (!val) return 'present';
  const [year, month] = val.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = parseInt(month, 10);
  if (isNaN(m) || m < 1 || m > 12) return val;
  return `${months[m - 1]} ${year}`;
}

// Strip protocol for clean display
function displayUrl(url) {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

// Split highlights textarea into bullet lines
function parseBullets(text) {
  if (!text) return [];
  return text
    .split('\n')
    .map(l => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

// ─── ResumeDoc class ──────────────────────────────────────────────────────────
class ResumeDoc {
  constructor(data) {
    this.data = data;
    this._doc = new PDFDocument({
      size:        'LETTER',
      margin:      0,
      bufferPages: true,
      info: {
        Title:  `${data.firstname} ${data.lastname} — Resume`,
        Author: `${data.firstname} ${data.lastname}`,
      },
    });
    this.y = MARGIN_Y;

    // Register all font variants once
    this._doc.registerFont('Serif',           FONTS.regular);
    this._doc.registerFont('Serif-Bold',      FONTS.bold);
    this._doc.registerFont('Serif-Italic',    FONTS.italic);
    this._doc.registerFont('Serif-BoldItalic',FONTS.boldItalic);
  }

  // ── Cursor / page helpers ──────────────────────────────────────────────────
  gap(pts)          { this.y += pts; }
  ensureSpace(needed) {
    if (this.y + needed > BOTTOM_STOP) {
      this._doc.addPage();
      this.y = MARGIN_Y;
    }
  }

  hRule(thickness = 0.8, color = '#1a1a1a') {
    this._doc.save()
      .moveTo(MARGIN_X, this.y)
      .lineTo(MARGIN_X + BODY_W, this.y)
      .lineWidth(thickness)
      .strokeColor(color)
      .stroke()
      .restore();
    this.y += 1;
  }

  // ── Section heading ────────────────────────────────────────────────────────
  sectionHeading(title) {
    this.gap(10);
    this.ensureSpace(32);

    this._doc
      .font('Serif-Bold')
      .fontSize(12)
      .fillColor('#000000')
      .text(title, MARGIN_X, this.y, { width: BODY_W });

    this.y = this._doc.y + 2;
    this.hRule(0.8);
    this.gap(5);
  }

  // ── Two-column row: leftFn draws the left side, dateStr goes right ─────────
  twoColHeader(leftFn, dateStr) {
    this.ensureSpace(18);
    const startY = this.y;

    // Right column date first (single line, right-aligned)
    this._doc
      .font('Serif-Italic')
      .fontSize(10)
      .fillColor('#444444')
      .text(dateStr, MARGIN_X + TEXT_COL_W, startY, {
        width: DATE_COL_W,
        align: 'right',
      });

    // Left column content
    this._doc.y = startY;
    leftFn(MARGIN_X, startY, TEXT_COL_W - 6);

    this.y = Math.max(this._doc.y, startY + 14);
  }

  // ── Bullet list ────────────────────────────────────────────────────────────
  drawBullets(bullets) {
    if (!bullets || bullets.length === 0) return;
    const BULLET_X = MARGIN_X + 10;
    const INDENT   = 10;
    const BW       = BODY_W - 10 - INDENT;

    bullets.forEach(line => {
      if (!line.trim()) return;
      this._doc.font('Serif').fontSize(10);
      const h = this._doc.heightOfString(line, { width: BW });
      this.ensureSpace(h + 4);

      const bY = this.y;
      this._doc.font('Serif').fontSize(10).fillColor('#000000')
        .text('•', BULLET_X, bY, { width: INDENT, lineBreak: false });
      this._doc.font('Serif').fontSize(10).fillColor('#000000')
        .text(line, BULLET_X + INDENT, bY, { width: BW, lineGap: 1.5 });

      this.y = this._doc.y + 2;
    });
  }

  // ── Draw a small GitHub "octocat-silhouette" icon using vector drawing ─────
  // Draws a simple circle with a cat-face silhouette at (cx, cy), radius r
  drawGithubIcon(cx, cy, r) {
    const doc = this._doc;
    doc.save();

    // Outer circle
    doc.circle(cx, cy, r)
      .lineWidth(1)
      .strokeColor('#000000')
      .stroke();

    // Inner silhouette: simplified cat head shape
    // head circle (smaller, inside)
    doc.circle(cx, cy - r * 0.08, r * 0.42)
      .lineWidth(0.6)
      .strokeColor('#000000')
      .stroke();

    // left ear
    doc.save()
      .moveTo(cx - r * 0.28, cy - r * 0.35)
      .lineTo(cx - r * 0.42, cy - r * 0.58)
      .lineTo(cx - r * 0.14, cy - r * 0.46)
      .closePath()
      .fillColor('#000000')
      .fill()
      .restore();

    // right ear
    doc.save()
      .moveTo(cx + r * 0.28, cy - r * 0.35)
      .lineTo(cx + r * 0.42, cy - r * 0.58)
      .lineTo(cx + r * 0.14, cy - r * 0.46)
      .closePath()
      .fillColor('#000000')
      .fill()
      .restore();

    // body / tentacles hint: two small curved bumps at bottom
    doc.save()
      .moveTo(cx - r * 0.35, cy + r * 0.32)
      .bezierCurveTo(cx - r * 0.48, cy + r * 0.58, cx - r * 0.52, cy + r * 0.72, cx - r * 0.38, cy + r * 0.80)
      .lineWidth(0.8)
      .strokeColor('#000000')
      .stroke()
      .restore();

    doc.save()
      .moveTo(cx + r * 0.35, cy + r * 0.32)
      .bezierCurveTo(cx + r * 0.48, cy + r * 0.58, cx + r * 0.52, cy + r * 0.72, cx + r * 0.38, cy + r * 0.80)
      .lineWidth(0.8)
      .strokeColor('#000000')
      .stroke()
      .restore();

    // tail curving right
    doc.save()
      .moveTo(cx + r * 0.38, cy + r * 0.80)
      .bezierCurveTo(cx + r * 0.65, cy + r * 0.90, cx + r * 0.75, cy + r * 0.60, cx + r * 0.60, cy + r * 0.42)
      .lineWidth(0.8)
      .strokeColor('#000000')
      .stroke()
      .restore();

    doc.restore();
  }

  // ── HEADER ─────────────────────────────────────────────────────────────────
  buildHeader() {
    const d   = this.data;
    const doc = this._doc;

    // Name — 24pt bold, centered
    doc.font('Serif-Bold')
      .fontSize(24)
      .fillColor('#000000')
      .text(`${d.firstname} ${d.lastname}`, MARGIN_X, this.y, {
        width: BODY_W,
        align: 'center',
      });
    this.y = doc.y + 5;

    // ── Contact line with | separators
    // Build items array; github gets special icon treatment
    const textItems = [];
    if (d.location)     textItems.push({ text: d.location });
    if (d.emailAddress) textItems.push({ text: d.emailAddress, link: `mailto:${d.emailAddress}` });
    if (d.phoneNumber)  textItems.push({ text: d.phoneNumber });
    if (d.website)      textItems.push({ text: displayUrl(d.website), link: d.website });
    if (d.linkedin)     textItems.push({ text: displayUrl(d.linkedin), link: d.linkedin });

    // Draw normal contact items centered
    if (textItems.length > 0) {
      const SEP = '   |   ';
      doc.font('Serif').fontSize(10);
      const fullLine = textItems.map(i => i.text).join(SEP);
      const lineW    = doc.widthOfString(fullLine) + doc.widthOfString(SEP) * (textItems.length - 1) * 0 ; // already included in join
      const startX   = Math.max(MARGIN_X, (PAGE_W - doc.widthOfString(fullLine)) / 2);

      let cx = startX;
      const lineY = this.y;

      textItems.forEach((item, idx) => {
        const tw = doc.widthOfString(item.text);
        doc.font('Serif').fontSize(10).fillColor('#000000')
          .text(item.text, cx, lineY, {
            width:     tw + 2,
            lineBreak: false,
            link:      item.link || null,
            underline: !!item.link,
            continued: false,
          });
        cx += tw;

        if (idx < textItems.length - 1) {
          const sw = doc.widthOfString(SEP);
          doc.font('Serif').fontSize(10).fillColor('#888888')
            .text(SEP, cx, lineY, { lineBreak: false, width: sw + 2, continued: false });
          cx += sw;
        }
      });

      // If github exists, append separator + icon + username after the text row
      if (d.github) {
        // Add separator
        if (textItems.length > 0) {
          const sw = doc.widthOfString(SEP);
          doc.font('Serif').fontSize(10).fillColor('#888888')
            .text(SEP, cx, lineY, { lineBreak: false, width: sw + 2, continued: false });
          cx += sw;
        }

        // Draw GitHub icon (small circle icon)
        const iconR  = 5;
        const iconCX = cx + iconR + 1;
        const iconCY = lineY + 7; // vertically center with text
        this.drawGithubIcon(iconCX, iconCY, iconR);

        // Username as clickable link right after icon
        const ghDisplay = displayUrl(d.github).replace(/^github\.com\//, '');
        const ghX       = iconCX + iconR + 4;
        doc.font('Serif').fontSize(10).fillColor('#000000')
          .text(ghDisplay, ghX, lineY, {
            link:      d.github,
            underline: true,
            lineBreak: false,
            width:     doc.widthOfString(ghDisplay) + 2,
          });
      }

      this.y = lineY + 16;
    }

    this.gap(3);
  }

  // ── EDUCATION ──────────────────────────────────────────────────────────────
  buildEducation() {
    const { education } = this.data;
    if (!education || education.length === 0) return;

    this.sectionHeading('Education');

    education.forEach((edu, i) => {
      this.ensureSpace(40);
      const dateStr = `${fmtDate(edu.startDate)} – ${fmtDate(edu.endDate)}`;

      this.twoColHeader((x, y, w) => {
        const degreeLabel = `${edu.degree}${edu.field ? ' in ' + edu.field : ''}`;
        // Bold institution, normal degree
        this._doc.font('Serif-Bold').fontSize(10).fillColor('#000000')
          .text(edu.institution, x, y, { width: w, lineBreak: false, continued: true });
        this._doc.font('Serif').fontSize(10).fillColor('#000000')
          .text(`, ${degreeLabel}`, { lineBreak: false, continued: false, width: w });
      }, dateStr);

      const subBullets = [];
      if (edu.gpa)        subBullets.push(`GPA: ${edu.gpa}`);
      if (edu.coursework) subBullets.push(`Coursework: ${edu.coursework}`);

      if (subBullets.length > 0) {
        this.gap(3);
        this.drawBullets(subBullets);
      }

      if (i < education.length - 1) this.gap(7);
    });
  }

  // ── EXPERIENCE ─────────────────────────────────────────────────────────────
  buildExperience() {
    const { experience } = this.data;
    if (!experience || experience.length === 0) return; // fully optional

    this.sectionHeading('Experience');

    experience.forEach((exp, i) => {
      const bullets = parseBullets(exp.highlights);
      this.ensureSpace(20 + bullets.length * 14);

      const dateStr = `${fmtDate(exp.startDate)} – ${fmtDate(exp.endDate)}`;

      this.twoColHeader((x, y, w) => {
        const company = exp.location
          ? `${exp.company} -- ${exp.location}`
          : exp.company;
        this._doc.font('Serif-Bold').fontSize(10).fillColor('#000000')
          .text(exp.role, x, y, { width: w, lineBreak: false, continued: true });
        this._doc.font('Serif').fontSize(10).fillColor('#000000')
          .text(`, ${company}`, { lineBreak: false, continued: false, width: w });
      }, dateStr);

      if (bullets.length > 0) {
        this.gap(3);
        this.drawBullets(bullets);
      }

      if (i < experience.length - 1) this.gap(8);
    });
  }

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  buildProjects() {
    const { projects } = this.data;
    if (!projects || projects.length === 0) return;

    this.sectionHeading('Projects');

    projects.forEach((proj, i) => {
      const bullets = parseBullets(proj.highlights);
      this.ensureSpace(20 + bullets.length * 14);

      // Right column: GitHub icon + short repo name (if URL provided), else empty
      const hasGithub = proj.url && proj.url.includes('github.com');
      const hasUrl    = !!proj.url;

      // Draw the two-col header
      // Right side: we'll draw manually (icon + text) after the header call
      const rightPlaceholder = ''; // we'll draw right side manually

      const startY = this.y;
      this.ensureSpace(18);

      // LEFT: project name bold
      this._doc.font('Serif-Bold').fontSize(10).fillColor('#000000')
        .text(proj.name, MARGIN_X, startY, { width: TEXT_COL_W - 6 });
      const afterLeftY = this._doc.y;

      // RIGHT: icon + repo name
      if (hasUrl) {
        const iconR  = 4.5;
        const iconCX = MARGIN_X + TEXT_COL_W + iconR + 2;
        const iconCY = startY + 7;

        if (hasGithub) {
          this.drawGithubIcon(iconCX, iconCY, iconR);

          // Extract "user/repo" from github URL
          const repoPath = proj.url.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
          const repoX    = iconCX + iconR + 4;
          const repoW    = DATE_COL_W - iconR * 2 - 10;
          this._doc.font('Serif-Italic').fontSize(9).fillColor('#000000')
            .text(repoPath, repoX, startY + 1, {
              width:     repoW,
              link:      proj.url,
              underline: true,
              lineBreak: false,
            });
        } else {
          // Non-GitHub URL: just show domain
          const disp = displayUrl(proj.url);
          this._doc.font('Serif-Italic').fontSize(9).fillColor('#000000')
            .text(disp, MARGIN_X + TEXT_COL_W, startY + 1, {
              width:     DATE_COL_W,
              align:     'right',
              link:      proj.url,
              underline: true,
              lineBreak: false,
            });
        }
      }

      this.y = Math.max(afterLeftY, startY + 14);

      if (bullets.length > 0) {
        this.gap(3);
        this.drawBullets(bullets);
      }

      if (i < projects.length - 1) this.gap(8);
    });
  }

  // ── TECHNOLOGIES ───────────────────────────────────────────────────────────
  // Renders exactly two clearly separated lines:
  //   Languages:     C++, Java, Python, ...
  //   Technologies:  React, Docker, AWS, ...
  buildTechnologies() {
    const { languages, technologies } = this.data;
    if (!languages && !technologies) return;

    this.sectionHeading('Technologies');

    if (languages && languages.trim()) {
      this.ensureSpace(18);
      const ly = this.y;

      // Measure bold label width so we can start value right after it
      this._doc.font('Serif-Bold').fontSize(10);
      const labelW = this._doc.widthOfString('Languages: ');

      this._doc.font('Serif-Bold').fontSize(10).fillColor('#000000')
        .text('Languages: ', MARGIN_X, ly, {
          lineBreak: false,
          continued: false,
          width: labelW + 2,
        });

      this._doc.font('Serif').fontSize(10).fillColor('#000000')
        .text(languages.trim(), MARGIN_X + labelW, ly, {
          width: BODY_W - labelW,
          lineGap: 1,
        });

      this.y = this._doc.y + 7;
    }

    if (technologies && technologies.trim()) {
      this.ensureSpace(18);
      const ty = this.y;

      this._doc.font('Serif-Bold').fontSize(10);
      const labelW = this._doc.widthOfString('Technologies: ');

      this._doc.font('Serif-Bold').fontSize(10).fillColor('#000000')
        .text('Technologies: ', MARGIN_X, ty, {
          lineBreak: false,
          continued: false,
          width: labelW + 2,
        });

      this._doc.font('Serif').fontSize(10).fillColor('#000000')
        .text(technologies.trim(), MARGIN_X + labelW, ty, {
          width: BODY_W - labelW,
          lineGap: 1,
        });

      this.y = this._doc.y + 7;
    }
  }

  // ── Build & return the PDFDocument ────────────────────────────────────────
  build() {
    this.buildHeader();
    this.buildEducation();
    this.buildExperience();
    this.buildProjects();
    this.buildTechnologies();
    this._doc.end();
    return this._doc;
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────
app.post('/getData', (req, res) => {
  const {
    firstname    = '',
    lastname     = '',
    location     = '',
    emailAddress = '',
    phoneNumber  = '',
    website      = '',
    linkedin     = '',
    github       = '',
    education    = [],
    experience   = [],   // optional
    projects     = [],
    languages    = '',
    technologies = '',
  } = req.body;

  // Validate required fields
  if (!firstname || !lastname) {
    return res.status(400).json({ error: 'firstname and lastname are required' });
  }

  const data = {
    firstname, lastname, location, emailAddress, phoneNumber,
    website, linkedin, github,
    education, experience, projects,
    languages, technologies,
  };

  const safeName = `${firstname}_${lastname}`.replace(/[^a-zA-Z0-9_]/g, '_');
  const fileName = `${safeName}_Resume.pdf`;
  const filePath = path.join(__dirname, fileName);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  try {
    const resume      = new ResumeDoc(data);
    const doc         = resume.build();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    writeStream.on('finish', () => {
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          console.error('Error reading PDF:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.send(fileData);
        fs.unlink(filePath, () => {});
      });
    });

    writeStream.on('error', err => {
      console.error('Write stream error:', err);
      if (!res.headersSent) res.status(500).send('PDF generation failed');
    });

  } catch (err) {
    console.error('PDF build error:', err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅  Resume server running on http://localhost:${PORT}`));