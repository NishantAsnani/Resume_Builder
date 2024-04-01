const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, '/public')));

console.log(path.join(__dirname, '/public'))
app.post('/getData', (req, res) => {
    const {
        firstname,
        lastname,
        cityStateZip,
        phoneNumber,
        emailAddress,
        objective,
        skills,
        education
    } = req.body;




    console.log(education)

    const experience =
        [{
            jobTitle: "Software Engineer",
            company: "ABC Company",
            location: "City, State",
            dateRange: "2014 - 2018",
            responsibilities: [
                "Developed web applications using JavaScript frameworks.",
                "Collaborated with cross-functional teams to deliver projects on time."
            ]
        },
        {
            jobTitle: "Senior Software Engineer",
            company: "DEF Company",
            location: "City, State",
            dateRange: "2018 - Present",
            responsibilities: [
                "Developed web applications using JavaScript frameworks.",
                "Collaborated with cross-functional teams to deliver projects on time."
            ]
        }
        ]

    // const education =
    //     [
    //         {
    //             degree: "H.S.C",
    //             fieldOfStudy: "PCM",
    //             institiute: "St Francis of Assisi Convent High School",
    //             location: "Navsari, GJ",
    //             dateRange: "2019 - 2020",
    //             grade: "74%"
    //         },
    //         {
    //             degree: "B.E",
    //             fieldOfStudy: "Computer Science",
    //             institiute: "Sarvajanik College of Engineering and Technology",
    //             location: "Surat, GJ",
    //             dateRange: "2020 - 2024",
    //             grade: "8.98"
    //         }
    //     ]


    const achievements =
        [{
            Title: "Incoming Global Talent Intern",
            institute: "AIESEC India",
            location: "Surat, Gujarat ",
            dateRange: " Jan 2022 - Jul 2022",
            responsibilities: [
                "Helped the incoming global Talent from various countries have internship opportunities in India(Surat)"
            ]
        },
        {
            Title: "NGO Intern",
            institute: "Innovate4India",
            location: "Surat, Gujarat ",
            dateRange: "Sept 2022 - Oct 2022",
            responsibilities: [
                "As a part of the Clean India movement helped spread awareness regarding the separation of dry and wet waste and conducted door-to-door surveys regarding the same.",
            ]
        }
        ]
    const Languages = ["English,Gujarati,Hindi,Sindhi"]
    const Intrests = [" Full Stack Web Dev, Watching Anime, Playing Video Games"]
    const doc = new PDFDocument();
    const fileName = 'resume.pdf'; // Define the file name
    const imageWidth = 24; // Adjust the width of the image as needed
    const pageWidth = doc.page.width - 50;
    const totalImageWidth = imageWidth * 2;
    const startX = (pageWidth - totalImageWidth) / 2;
    const start = new Date(education.startDate);
    const startmonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(start);
    const startyear = start.getFullYear();
    const end = new Date(education.endDate);
    const endmonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(end);
    const endyear = end.getFullYear();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    console.log(startmonth)
    console.log(startyear)

    console.log(endmonth)
    console.log(endyear)
    // Pipe PDF to response
    doc.pipe(res);

    // Basic personal details
    doc.font("Helvetica-Bold").fontSize(22).text(`${firstname} ${lastname}`, { align: 'center' });
    doc.font("Helvetica").fontSize(12).text(`${phoneNumber} | ${emailAddress} | ${cityStateZip}`, { align: 'center' });





    doc.image('./public/images/linkedin.png', startX, doc.y, { width: imageWidth, link: "https://www.linkedin.com/in/nishant-asnani-aa6093208/" });


    doc.image('./public/images/github.png', startX + 1.1 * imageWidth, doc.y, { width: imageWidth, link: "https://github.com/NishantAsnani" });

    doc.image('./public/images/website.png', startX + 2.2 * imageWidth, doc.y, { width: imageWidth, link: "https://portfolio-k67q.vercel.app/" });


    doc.image('./public/images/stackoverflow.png', startX + 3.3 * imageWidth, doc.y, { width: imageWidth, link: "https://www.google.com/" });

    doc.image('./public/images/leetcode.png', startX + 4.4 * imageWidth, doc.y, { width: imageWidth, link: "https://www.google.com/" });

    doc.moveDown()

    // Objective
    doc.moveDown();
    doc.moveDown();
    doc.font("Helvetica").fontSize(12).text(objective, { underline: false, align: "justify" });
    doc.moveDown()


    //Education Qualifications
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14).text('Education:', { underline: true });
    education.forEach((edu) => {
        doc.font("Helvetica-Bold").fontSize(12).text(`${edu.institiute} | ${edu.state},${edu.city}`, { continued: true });
        doc.text(`2014 - 2018`, { align: "right" });
        doc.font("Helvetica").text(`${edu.degree}, Grade:${edu.grade}`)
        doc.moveDown()
    })

    //Skills
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14).text('Skills:', { underline: true });
    // Field-Skills
    doc.font("Helvetica-Bold").fontSize(12).text('Field-skills:', { continued: true });
    doc.font("Helvetica").fontSize(12).text(skills.join(', '), { indent: 10, underline: false });

    doc.moveDown(0.5);
    // Languages
    doc.font("Helvetica-Bold").fontSize(12).text('Languages:', { continued: true });
    doc.font("Helvetica").fontSize(12).text(Languages, { indent: 10, underline: false });

    doc.moveDown(0.5);
    // Certifications
    doc.font("Helvetica-Bold").fontSize(12).text('Intrests/Hobbies:', { continued: true });
    doc.font("Helvetica").fontSize(12).text(Intrests, { indent: 10, underline: false });


    doc.moveDown();


    // Experience
    doc.font("Helvetica-Bold").fontSize(14).text('Experience:', { underline: true });

    experience.forEach((exp) => {
        doc.font("Helvetica-Bold").fontSize(12).text(`${exp.jobTitle}, ${exp.company}, ${exp.location}`, { continued: true });

        doc.font("Helvetica-Bold").text(exp.dateRange, { align: 'right' });
        exp.responsibilities.forEach((responsibility) => {
            doc.font("Helvetica").text(`- ${responsibility}`);
        });
        doc.moveDown()
    })


    // Leadership or Activities
    doc.font("Helvetica-Bold").fontSize(14).text('Activities:', { underline: true });

    achievements.forEach((exp) => {
        doc.font("Helvetica-Bold").fontSize(12).text(`${exp.Title}, ${exp.institute}, ${exp.location}`, { continued: true });

        doc.font("Helvetica-Bold").text(exp.dateRange, { align: 'right' });
        exp.responsibilities.forEach((responsibility) => {
            doc.font("Helvetica").text(`- ${responsibility}`, { align: "justify" });
        });
        doc.moveDown()
    })

    // End PDF generation
    doc.end();
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
