import PropTypes from 'prop-types'

function PersonalDetails({ input, change }) {
    return (
        <>
            <div>
                <label htmlFor="firstname" className="block text-gray-700">First Name</label>
                <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={input.firstname}
                    onChange={change}
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
                    onChange={change}
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
                    onChange={change}
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
                    onChange={change}
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
                    onChange={change}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
            </div>

        </>
    )
}

PersonalDetails.propTypes = {
    input: PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        cityStateZip: PropTypes.string,
        phoneNumber: PropTypes.string,
        emailAddress: PropTypes.string,
    }).isRequired,
    change: PropTypes.func.isRequired,
};
export default PersonalDetails;