import { useState } from "react";
import axios from "axios";
import EducationForm from "./EducationForm";
import SkillObjective from "./SkillObjective"
import PersonalDetails from "./PersonalDetails";
import Experience from "./Experience";
import Achievements from "./Achievements";


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
        education: [],
        Language: [],
        Hobby: [],
        experience: [],
        achievements: []
    });
    const [newSkill, setNewSkill] = useState("");
    const [newLanguage, setNewLanguage] = useState("");
    const [newHobby, setNewHobby] = useState("");
    const [URL, setURL] = useState("");

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };


    const handleDateChange = (index, fieldName, date, parentName) => {
        const updatedData = { ...input };

        if (parentName) {
            updatedData[parentName] = updatedData[parentName].map((item, i) => {
                if (i === index) {
                    return { ...item, [fieldName]: date };
                }
                return item;
            });
        }

        setInput(updatedData);
    };

    const handleSkillChange = (e) => {
        setNewSkill(e.target.value);
    };
    const handleLanguageChange = (e) => {
        setNewLanguage(e.target.value);
    };

    const handleHobbiesChange = (e) => {
        setNewHobby(e.target.value);
    };


    const handleFieldChange = (index, field, value, category) => {
        const updatedCategory = [...input[category]];
        updatedCategory[index][field] = value;
        setInput({ ...input, [category]: updatedCategory });
    };
    

    const addEducationField = () => {
        setInput({
            ...input,
            education: [...input.education, { institiute: "", grade: "", state: "", city: "", Degree: "" }],
        });
    };

    const addExperienceField = () => {
        setInput({
            ...input,
            experience: [...input.experience, { company: "", jobTitle: "", state: "", city: "", responsibilities: "" }],
        });
    }


    const addAchievementField = () => {
        setInput({
            ...input,
            achievements: [...input.achievements, {institiute: "", Title: "", state: "", city: "", responsibilities: "" }],
        });
    }

    const addSkill = () => {
        if (newSkill.trim() !== "") {
            setInput({ ...input, skills: [...input.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const addLanguage = () => {
        if (newLanguage.trim() !== "") {
            setInput({ ...input, Language: [...input.Language, newLanguage.trim()] });
            setNewLanguage("");
        }
    };

    const addHobby = () => {
        if (newHobby.trim() !== "") {
            setInput({ ...input, Hobby: [...input.Hobby, newHobby.trim()] });
            setNewHobby("");
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
            education: input.education,
            Language: input.Language,
            Hobby: input.Hobby,
            experience: input.experience,
            achievement:input.achievements
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
                                newLanguage={newLanguage}
                                newHobby={newHobby}
                                handleSkillChange={handleSkillChange}
                                addSkill={addSkill}
                                addLanguage={addLanguage}
                                addHobby={addHobby}
                                input={input}
                                handleChange={handleChange}
                                handleHobbiesChange={handleHobbiesChange}
                                handleLanguageChange={handleLanguageChange}
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
                                    handleFieldChange={handleFieldChange}
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
                    {currentPage === 4 && (<div className="grid grid-cols-1 gap-4">
                        {input.experience && input.experience.map((edu, index) => (
                            <Experience
                                key={index}
                                index={index}
                                experience={edu}
                                handleFieldChange={handleFieldChange}
                                handleDateChange={handleDateChange}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addExperienceField}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                            Add Experience
                        </button>
                        <button onClick={prevPage}>Prev</button>
                        <button onClick={nextPage}>Next</button>
                    </div>)}



                    {currentPage === 5 && (<div className="grid grid-cols-1 gap-4">
                        {input.achievements && input.achievements.map((edu, index) => (
                            <Achievements
                                key={index}
                                index={index}
                                achievement={edu}
                                handleFieldChange={handleFieldChange}
                                handleDateChange={handleDateChange}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addAchievementField}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                            Add Achievements
                        </button>
                        <button onClick={prevPage}>Prev</button>
                    </div>)}


                    {
                        currentPage == 5 ? <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button> : ""
                    }
                </form>
            </div>
            {URL && <iframe src={URL} height="100%" width="50%">File</iframe>}
            {URL && <a href={URL} download>Download Resume</a>}
        </>
    );
}

export default App2;