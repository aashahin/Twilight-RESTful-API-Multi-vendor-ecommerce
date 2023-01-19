// Used to reduce the size of requests and protect
exports.sanitizeUser = function(user) {
    return {
        id: user._id,
        fullName: user.name,
        email: user.email
    };
};