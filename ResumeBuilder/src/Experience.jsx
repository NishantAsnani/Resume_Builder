import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types'

function Experience({ index, experience, handleFieldChange, handleDateChange }) {
    return (
        <div key={index}>
            <label htmlFor={`company${index}`} className="block text-gray-700">
                Institute Name
            </label>
            <input
                type="text"
                id={`company${index}`}
                name="company"
                value={experience.company}
                onChange={(e) => handleFieldChange(index, e.target.name,e.target.value,"experience")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`jobTitle${index}`} className="block text-gray-700">
                jobTitle
            </label>
            <input
                type="text"
                id={`jobTitle${index}`}
                name="jobTitle"
                value={experience.jobTitle}
                onChange={(e) => handleFieldChange(index, e.target.name,e.target.value,"experience")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`state${index}`} className="block text-gray-700">
                State
            </label>
            <input
                type="text"
                id={`state${index}`}
                name="state"
                value={experience.state}
                onChange={(e) => handleFieldChange(index, e.target.name,e.target.value,"experience")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`city${index}`} className="block text-gray-700">
                City
            </label>
            <input
                type="text"
                id={`city${index}`}
                name="city"
                value={experience.city}
                onChange={(e) => handleFieldChange(index, e.target.name,e.target.value,"experience")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`responsibilities${index}`} className="block text-gray-700">
                Responsibility
            </label>
            <input
                type="text"
                id={`responsibilities${index}`}
                name="responsibilities"
                value={experience.responsibilities}
                onChange={(e) => handleFieldChange(index, e.target.name,e.target.value,"experience")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`startDate${index}`} className="block text-gray-700">
                Start Date
            </label>
            <DatePicker
                    id={`startDate${index}`}
                    selected={experience.startDate}
                    onChange={(date) => handleDateChange(index, 'startDate', date, "experience")}
                    name="experienceStartDate"
                    dateFormat="yyyy/MM/dd"
                    placeholderText="yyyy/MM/dd"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
                <label htmlFor={`endDate${index}`} className="block text-gray-700">
                    End Date
                </label>
                <DatePicker
                    id={`endDate${index}`}
                    selected={experience.endDate}
                    onChange={(date) => handleDateChange(index, 'endDate', date, "experience")}
                    name="experienceEndDate"
                    dateFormat="yyyy/MM/dd"
                    placeholderText="yyyy/MM/dd"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />

        </div>
    )
}

Experience.propTypes = {
    index: PropTypes.number.isRequired, // index should be a number and required
    experience: PropTypes.shape({
        company: PropTypes.string.isRequired, // company should be a string and required
        jobTitle: PropTypes.string.isRequired, // jobTitle should be a string and required
        responsibilities: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired, // state should be a string and required
        city: PropTypes.string.isRequired, // city should be a string and required
        startDate: PropTypes.instanceOf(Date), // startDate should be a Date instance and required
        endDate: PropTypes.instanceOf(Date) // endDate should be a Date instance and required
    }).isRequired,
    handleFieldChange: PropTypes.func.isRequired, // handleFieldChange should be a function and required
    handleDateChange: PropTypes.func.isRequired // handleDateChange should be a function and required
};

export default Experience;