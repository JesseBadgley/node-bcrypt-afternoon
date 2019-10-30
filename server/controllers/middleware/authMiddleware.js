usersOnly = (req, res, next) => {
    if(!req.session.user) {
        return res.status(401).json('log in');
    }
    next();
}

adminsOnly = (req, res, next) => {
    if(!req.session.isAdmin) {
        return res.status(403).json('Not the Admin, try again.')
    }
    next();
}

module.exports = {
    usersOnly,
    adminsOnly
}