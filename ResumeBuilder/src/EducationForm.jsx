import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types'

    function EducationForm({ index, education, handleEducationChange, handleDateChange }) {
        return (
            <div key={index}>
                <label htmlFor={`institiute${index}`} className="block text-gray-700">
                    Institute Name
                </label>
                <input
                    type="text"
                    id={`institiute${index}`}
                    name="institiute"
                    value={education.institiute}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
                <label htmlFor={`grade${index}`} className="block text-gray-700">
                    Grade
                </label>
                <input
                    type="text"
                    id={`grade${index}`}
                    name="grade"
                    value={education.grade}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
                <label htmlFor={`state${index}`} className="block text-gray-700">
                    State
                </label>
                <input
                    type="text"
                    id={`state${index}`}
                    name="state"
                    value={education.state}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
                <label htmlFor={`city${index}`} className="block text-gray-700">
                    City
                </label>
                <input
                    type="text"
                    id={`city${index}`}
                    name="city"
                    value={education.city}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
                <label htmlFor={`degree${index}`} className="block text-gray-700">
                    Degree
                </label>
                <input
                    type="text"
                    id={`degree${index}`}
                    name="degree"
                    value={education.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
                <label htmlFor={`startDate${index}`} className="block text-gray-700">
                    Start Date
                </label>
                <DatePicker
                    id={`startDate${index}`}
                    selected={education.startDate}
                    onChange={(date) => handleDateChange(index, 'startDate', date)}
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
                <label htmlFor={`endDate${index}`} className="block text-gray-700">
                    End Date
                </label>
                <DatePicker
                    id={`endDate${index}`}
                    selected={education.endDate}
                    onChange={(date) => handleDateChange(index, 'endDate', date)}
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
            </div>
        )
    }
EducationForm.propTypes = {
    index: PropTypes.number.isRequired,
    education: PropTypes.shape({
        institiute: PropTypes.string,
        grade: PropTypes.string,
        state: PropTypes.string,
        city: PropTypes.string,
        degree: PropTypes.string,
        startDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date),
    }).isRequired,
    handleEducationChange: PropTypes.func.isRequired,
    handleDateChange: PropTypes.func.isRequired,
}

export default EducationForm; 