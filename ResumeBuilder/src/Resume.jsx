// Resume.js


function Resume() {
  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">John Doe</h1>
      <p className="text-gray-700 text-sm mb-6">Web Developer | Experienced in HTML, CSS, JavaScript</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <ul className="list-disc pl-4">
          <li className="mb-2">Email: john.doe@example.com</li>
          <li className="mb-2">Phone: +1 (123) 456-7890</li>
          <li className="mb-2">Address: 123 Main St, City, Country</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        <div className="mb-2">
          <h3 className="font-semibold text-blue-600">Bachelor of Science in Computer Science</h3>
          <p className="text-sm text-gray-700">University Name, Year - Year</p>
        </div>
        <div>
          <h3 className="font-semibold text-blue-600">High School Diploma</h3>
          <p className="text-sm text-gray-700">High School Name, Year - Year</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        <div className="mb-4">
          <h3 className="font-semibold text-blue-600">Web Developer</h3>
          <p className="text-sm text-gray-700">Company Name, Year - Present</p>
          <ul className="list-disc ml-8">
            <li>Developed and maintained web applications using HTML, CSS, and JavaScript.</li>
            <li>Collaborated with team members to design and implement new features.</li>
            <li>Ensured cross-browser compatibility and responsive design.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-blue-600">Intern</h3>
          <p className="text-sm text-gray-700">Company Name, Year - Year</p>
          <ul className="list-disc ml-8">
            <li>Assisted senior developers with front-end and back-end tasks.</li>
            <li>Participated in code reviews and debugging sessions.</li>
            <li>Gained practical experience in software development methodologies.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Resume;
