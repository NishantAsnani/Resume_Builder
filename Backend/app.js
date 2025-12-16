const express = require('express')
const app = express()
const PORT = 3000;
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const PDFdocument = require('pdfkit')
const fs = require('fs')
const resumeTemplate = require('./template')

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});



app.post('/getData', (req, res) => {

    const {
        firstname,
        lastname,
        addressLine1,
        addressLine2,
        cityStateZip,
        phoneNumber,
        emailAddress,
        objective,
    } = req.body

    const experience = {
        jobTitle: "Software Engineer",
        company: "ABC Company",
        location: "City, State",
        dateRange: "2014 - Present",
        responsibilities: [
            "Developed web applications using JavaScript frameworks.",
            "Collaborated with cross-functional teams to deliver projects on time."
        ]
    };

    //   = "123 Main Street";
    //   = "Apt 101";
    //   = "Anytown, USA 12345";
    //   = "555-555-5555";
    //   = "john.doe@example.com";

    // const objective = "Experienced software developer seeking new opportunities.";

    const education = {
        degree: "B.E",
        fieldOfStudy: "Computer Science",
        university: "University of XYZ",
        location: "City, State",
        dateRange: "2010 ~ 2014"
    };



    //     const resumeTemplate = `
    // ${firstname} ${lastname}
    // ${addressLine1}
    // ${addressLine2}
    // ${cityStateZip}
    // ${phoneNumber} | ${emailAddress}

    // Objective/Summary:
    // ${objective}

    // Education:
    // ${education.degree} in ${education.fieldOfStudy}, ${education.university}, ${education.location}
    // ${education.dateRange}

    // Experience:
    // ${experience.jobTitle}, ${experience.company}, ${experience.location}
    // ${experience.dateRange}
    // - ${experience.responsibilities.join("\n- ")}

    // Skills:
    // - JavaScript
    // - HTML/CSS
    // - ...

    // Certifications:
    // Certification Name, Issuing Organization, Date

    // Additional Information:
    // References (if applicable)
    // `;





    const doc = new PDFdocument()
    const fileName = 'output.pdf'; // Define the file name

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);


    const stream = doc.pipe(fs.createWriteStream('output.pdf'));
    const imageWidth = 24; // Adjust the width of the image as needed
    const pageWidth = doc.page.width - 50;
    const startX = pageWidth - imageWidth;

    doc.fontSize(30)
    doc.font('Courier');
    doc.text(`${firstname} ${lastname}`, { align: 'center' });


    doc.fontSize(18)
    doc.font('Helvetica-Bold').text(`Software Engineer`, { align: "center" });

    doc.fontSize(10)
    doc.font('Helvetica-Bold').text(`${emailAddress}`, { align: "center", underline: true, continued: true });
    doc.font('Helvetica-Bold').text(`+(91)-${phoneNumber}`, { align: "left", underline: false, continued: true });
    doc.font('Helvetica-Bold').text(`${cityStateZip}`, { align: "right", underline: false });

    doc.image('./public/linkedin.png', { align: 'center', valign: 'center', link: "https://www.google.com/" })

    doc.image('./public/github.png', startX, doc.y, { width: imageWidth, link: "https://www.google.com/" })

    doc.moveDown()
    doc.moveDown()
    doc.moveDown()
    doc.moveDown()


    doc.fontSize(17);
    doc.fillColor('darkviolet')
    doc.font('Arial.ttf').text(`Objective/Summary`)
    doc.moveDown(0.5)
    doc.fillColor('black')
    doc.fontSize(13);
    doc.font("Arial.ttf").text(`${objective}`);
    doc.moveDown()
    doc.moveDown()








    doc.moveDown()
    doc.moveDown()
    doc.moveDown()

    doc.fontSize(17).font('Courier').text('Experience');
    doc.font('Courier-Bold').text(experience.jobTitle);
    doc.text(`${experience.company}, ${experience.location}`);
    doc.text("         " + experience.dateRange);
    experience.responsibilities.forEach((responsibility) => {
        doc.text(`- ${responsibility}`);
    });



    doc.text(`Education:${education.degree} in ${education.fieldOfStudy}, ${education.university}, ${education.location}`, { continued: true })
    doc.text(`     -${education.dateRange}`)
    doc.text();


    doc.end();
    stream.on('finish', () => {
        fs.readFile('output.pdf', (err, data) => {
            if (err) {
                console.error('Error reading PDF file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.send(data);
        });
    });
});



app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})