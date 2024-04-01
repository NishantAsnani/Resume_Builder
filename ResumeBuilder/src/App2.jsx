import { useState } from "react";
import axios from "axios";
import EducationForm from "./EducationForm";
import SkillObjective from "./SkillObjective"
import PersonalDetails from "./PersonalDetails";

function App2() {
    const [currentPage, setCurrentPage] = useState(1);
    const [input, setInput] = useState({
        firstname: "",
        lastname: "",
        cityStateZip: "",
        phoneNumber: "",
        emailAddress: "",
        objective: "",
        skills: [],
        education: []
    });
    const [newSkill, setNewSkill] = useState("");
    const [URL, setURL] = useState("");

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleDateChange = (index, fieldName, date) => {
        const updatedEducation = [...input.education];
        updatedEducation[index][fieldName] = date;
        setInput({ ...input, education: updatedEducation });
    };

    const handleSkillChange = (e) => {
        setNewSkill(e.target.value);
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEducation = [...input.education];
        updatedEducation[index][name] = value;
        setInput({ ...input, education: updatedEducation });
    };

    const addEducationField = () => {
        setInput({
            ...input,
            education: [...input.education, { institiute: "", grade: "", state: "", city: "", Degree: "" }],
        });
    };

    const addSkill = () => {
        if (newSkill.trim() !== "") {
            setInput({ ...input, skills: [...input.skills, newSkill.trim()] });
            setNewSkill("");
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
            skills: input.skills,
            education: input.education
        };
        try {
            const response = await axios.post("http://localhost:3000/getData", data, {
                responseType: "arraybuffer",
            });
            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
            const pdfUrl = window.URL.createObjectURL(pdfBlob);
            setURL(pdfUrl);
            window.open(pdfUrl)
        } catch (err) {
            console.log(err);
        }
    };

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
                >
                    <h1 className="text-2xl font-semibold mb-4">Resume Form</h1>
                    {currentPage === 1 && (
                        <div className="grid grid-cols-1 gap-4">
                            <PersonalDetails
                                input={input}
                                change={handleChange}
                            />
                            <button onClick={nextPage}>Next</button>
                        </div>
                    )}
                    {currentPage === 2 && (
                        <div className="grid grid-cols-1 gap-4">
                            <SkillObjective
                                newSkill={newSkill}
                                handleSkillChange={handleSkillChange}
                                addSkill={addSkill}
                                input={input}
                                handleChange={handleChange}
                            />
                            <button onClick={prevPage}>Prev</button>
                            <button onClick={nextPage}>Next</button>
                        </div>
                    )}
                    {currentPage === 3 && (
                        <div className="grid grid-cols-1 gap-4">
                            {input.education && input.education.map((edu, index) => (
                                <EducationForm
                                    key={index}
                                    index={index}
                                    education={edu}
                                    handleEducationChange={handleEducationChange}
                                    handleDateChange={handleDateChange} />
                            ))}
                            <button
                                type="button"
                                onClick={addEducationField}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                                Add Education
                            </button>
                            <button onClick={prevPage}>Prev</button>
                            <button onClick={nextPage}>Next</button>
                        </div>
                    )}
                    {
                        currentPage == 3 ? <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button> : ""
                    }
                </form>
            </div>
            {URL && <iframe src={URL} height="100%" width="50%">File</iframe>}
        </>
    );
}

export default App2;
