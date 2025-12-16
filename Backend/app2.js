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
        education,
        Language,
        Hobby,
        experience,
        achievement
    } = req.body;


    console.log(experience)
    console.log(achievement)

    // const experience =
    //     [{
    //         jobTitle: "Software Engineer",
    //         company: "ABC Company",
    //         location: "City, State",
    //         dateRange: "2014 - 2018",
    //         responsibilities: [
    //             "Developed web applications using JavaScript frameworks.",
    //             "Collaborated with cross-functional teams to deliver projects on time."
    //         ]
    //     },
    //     {
    //         jobTitle: "Senior Software Engineer",
    //         company: "DEF Company",
    //         location: "City, State",
    //         dateRange: "2018 - Present",
    //         responsibilities: [
    //             "Developed web applications using JavaScript frameworks.",
    //             "Collaborated with cross-functional teams to deliver projects on time."
    //         ]
    //     }
    //     ]

    // const achievements =
    //     [{
    //         Title: "Incoming Global Talent Intern",
    //         institute: "AIESEC India",
    //         location: "Surat, Gujarat ",
    //         dateRange: " Jan 2022 - Jul 2022",
    //         responsibilities: [
    //             "Helped the incoming global Talent from various countries have internship opportunities in India(Surat)"
    //         ]
    //     },
    //     {
    //         Title: "NGO Intern",
    //         institute: "Innovate4India",
    //         location: "Surat, Gujarat ",
    //         dateRange: "Sept 2022 - Oct 2022",
    //         responsibilities: [
    //             "As a part of the Clean India movement helped spread awareness regarding the separation of dry and wet waste and conducted door-to-door surveys regarding the same.",
    //         ]
    //     }
    //     ]

    const doc = new PDFDocument();
    const fileName = 'resume.pdf'; // Define the file name
    const imageWidth = 24; // Adjust the width of the image as needed
    const pageWidth = doc.page.width - 50;
    const totalImageWidth = imageWidth * 2;
    const startX = (pageWidth - totalImageWidth) / 2;


    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Basic personal details
    doc.font("Helvetica-Bold").fontSize(22).text(`${firstname} ${lastname}`, { align: 'center' });
    doc.font("Helvetica").fontSize(12).text(`${phoneNumber} | ${emailAddress} | ${cityStateZip}`, { align: 'center' });





    doc.image('./public/images/linkedin.png', startX, doc.y, { width: imageWidth, link: "https://www.linkedin.com/in/nishant-asnani-aa6093208/" });


    doc.image('./public/images/github.png', startX + 1.1 * imageWidth, doc.y, { width: imageWidth, link: "https://github.com/NishantAsnani" });

    doc.image('./public/images/website.png', startX + 2.2 * imageWidth, doc.y, { width: imageWidth, link: "https://portfolio-k67q.vercel.app/" });


    

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
        const startDate = new Date(edu?.startDate.slice(0, 10))
        const endDate = new Date(edu.endDate.slice(0, 10))
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' }).slice(0, 3);
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' }).slice(0, 3);
        doc.font("Helvetica-Bold").fontSize(12).text(`${edu.institiute} | ${edu.state},${edu.city}`, { continued: true });
        doc.text(`${startMonth} ${startDate.getFullYear()} -  ${endMonth} ${endDate.getFullYear()}`, { align: "right" });
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
    doc.font("Helvetica").fontSize(12).text(Language.join(', '), { indent: 10, underline: false });

    doc.moveDown(0.5);
    // Certifications
    doc.font("Helvetica-Bold").fontSize(12).text('Intrests/Hobbies:', { continued: true });
    doc.font("Helvetica").fontSize(12).text(Hobby.join(', '), { indent: 10, underline: false });


    doc.moveDown();


    // Experience
    doc.font("Helvetica-Bold").fontSize(14).text('Experience:', { underline: true });

    experience.forEach((exp) => {

        const startDate = new Date(exp.startDate.slice(0, 10))
        const endDate = new Date(exp.endDate.slice(0, 10))
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' }).slice(0, 3);
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' }).slice(0, 3);


        doc.font("Helvetica-Bold").fontSize(12).text(`${exp.jobTitle}, ${exp.company} | ${exp.state},${exp.city}`, { continued: true });

        doc.font("Helvetica-Bold").text(`${startMonth} ${startDate.getFullYear()} -  ${endMonth} ${endDate.getFullYear()}`, { align: 'right' });

        doc.font("Helvetica").text(`- ${exp.responsibilities}`);

        doc.moveDown()
    })


    // Leadership or Activities
    doc.font("Helvetica-Bold").fontSize(14).text('Achievements:', { underline: true });

    achievement.forEach((exp) => {
        const startDate = new Date(exp.startDate.slice(0, 10))
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' }).slice(0, 3);

        doc.font("Helvetica-Bold").fontSize(12).text(`${exp.Title}, ${exp.institute} | ${exp.state},${exp.city}`, { continued: true });

        doc.font("Helvetica-Bold").text(`${startMonth} ${startDate.getFullYear()}`, { align: 'right' });

        doc.font("Helvetica").text(`- ${exp.responsibilities}`, { align: "justify" });

        doc.moveDown()
    })

    // End PDF generation
    doc.end();
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
