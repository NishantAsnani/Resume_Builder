import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Achievements({ index, achievement, handleFieldChange, handleDateChange }) {
    return (
        <div key={index}>
            <label htmlFor={`institute${index}`} className="block text-gray-700">
                Institute Name
            </label>
            <input
                type="text"
                id={`institute${index}`}
                name="institute"
                value={achievement.institute}
                onChange={(e) => handleFieldChange(index, e.target.name, e.target.value, 'achievements')}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`jitle${index}`} className="block text-gray-700">
                Certificate-Title
            </label>
            <input
                type="text"
                id={`Title${index}`}
                name="Title"
                value={achievement.Title}
                onChange={(e) => handleFieldChange(index, e.target.name, e.target.value, 'achievements')}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`state${index}`} className="block text-gray-700">
                State
            </label>
            <input
                type="text"
                id={`state${index}`}
                name="state"
                value={achievement.state}
                onChange={(e) => handleFieldChange(index, e.target.name, e.target.value, 'achievements')}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`city${index}`} className="block text-gray-700">
                City
            </label>
            <input
                type="text"
                id={`city${index}`}
                name="city"
                value={achievement.city}
                onChange={(e) => handleFieldChange(index, e.target.name, e.target.value, "achievements")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`responsibilities${index}`} className="block text-gray-700">
                Responsibility
            </label>
            <input
                type="text"
                id={`responsibilities${index}`}
                name="responsibilities"
                value={achievement.responsibilities}
                onChange={(e) => handleFieldChange(index, e.target.name, e.target.value, "achievements")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
            <label htmlFor={`startDate${index}`} className="block text-gray-700">
                Start Date
            </label>
            <DatePicker
                id={`startDate${index}`}
                selected={achievement.startDate}
                onChange={(date) => handleDateChange(index, 'startDate', date, "achievements")}
                name="achievementStartDate"
                dateFormat="yyyy/MM/dd"
                placeholderText="yyyy/MM/dd"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />

        </div>
    );
}

Achievements.propTypes = {
    index: PropTypes.number.isRequired,
    achievement: PropTypes.shape({
        institute: PropTypes.string,
        Title: PropTypes.string.isRequired,
        state: PropTypes.string,
        city: PropTypes.string,
        responsibilities: PropTypes.string.isRequired,
        startDate: PropTypes.instanceOf(Date),
    }).isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    handleDateChange: PropTypes.func.isRequired,
};

export default Achievements;