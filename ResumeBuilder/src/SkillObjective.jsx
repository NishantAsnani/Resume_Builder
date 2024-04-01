import PropTypes from 'prop-types'

function SkillObjective( {newSkill, handleSkillChange, addSkill, input, handleChange}){
    return(
        <>
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
</>
    )
}
SkillObjective.propTypes = {
    newSkill: PropTypes.string.isRequired,
    handleSkillChange: PropTypes.func.isRequired,
    addSkill: PropTypes.func.isRequired,
    input: PropTypes.shape({
        skills: PropTypes.arrayOf(PropTypes.string),
        objective: PropTypes.string,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
};


export default SkillObjective