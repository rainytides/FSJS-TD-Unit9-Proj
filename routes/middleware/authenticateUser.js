
// Import necessary modules
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { User } = require('../../models'); // Corrected import for User model

// Middleware to authenticate the user
async function authenticateUser(req, res, next) {
    let message; // Variable to hold the error message, if any
    const credentials = auth(req); // Parse the Authorization header

    // If credentials are available, try to authenticate the user
    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });
        // If a user is found with the provided email address, verify the password
        if (user) {
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            if (authenticated) {
                // Log success and attach user to the request object
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                req.currentUser = user;
            } else {
                // Password mismatch error message
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            // User not found error message
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        // Authorization header not found error message
        message = 'Auth header not found';
    }

    // If there is an error message, log the warning and send a 401 response, otherwise proceed
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};

// Export the authenticateUser middleware
module.exports = authenticateUser;
