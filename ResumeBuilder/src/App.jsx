import { useState } from "react"
import axios from 'axios'
function App() {
  const [input, setInput] = useState({
    firstname: '',
    lastname: '',
    cityStateZip: '',
    phoneNumber: '',
    emailAddress: '',
    objective: '',
    skills: []
  })
  const [URL, setURL] = useState("")
  const [newSkill, setNewSkill] = useState([]);
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      setInput({ ...input, skills: [...input.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstname: input.firstname,
      lastname: input.lastname,
      cityStateZip: input.cityStateZip,
      phoneNumber: input.phoneNumber,
      emailAddress: input.emailAddress,
      objective: input.objective,
      skills: input.skills
    }
    try {
      const response = await axios.post('http://localhost:3000/getData', data,
        {
          responseType: 'arraybuffer'
        })
      console.log(response.data)
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      window.open(pdfUrl)
      setURL(pdfUrl)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Resume Form</h1>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-gray-700">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={input.firstname}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={input.lastname}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="cityStateZip" className="block text-gray-700">City, State, Zip</label>
              <input
                type="text"
                id="cityStateZip"
                name="cityStateZip"
                value={input.cityStateZip}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="emailAddress" className="block text-gray-700">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={input.emailAddress}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="skills" className="block text-gray-700">Skills</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={newSkill}
                onChange={handleSkillChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Add Skill
              </button>

              <ul className="list-disc pl-4">
                {input.skills && input.skills.map((skill, index) => (
                  <li key={index} className="mb-1 text-blue-900">{skill}</li>
                ))}
              </ul>


            </div>
            <div>
              <label htmlFor="objective" className="block text-gray-700">Objective</label>
              <textarea
                id="objective"
                name="objective"
                value={input.objective}
                onChange={handleChange}
                rows="4"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      {URL && <iframe src={URL} height="100%" width="50%" >File</iframe>}


    </>
  )
}

export default App
