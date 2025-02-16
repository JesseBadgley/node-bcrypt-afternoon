const bcrypt = require("bcryptjs");

register = async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const db = await req.app.get("db");
    const result = await db.check_existing_user([username]);
    const existingUser = await result[0]
    if(existingUser) {
        res.status(409).json("Username taken.")
    } else {
        const salt = await bcrypt.genSaltSync(10)
        const hash = await bcrypt.hashSync(password, salt);
        const registeredUser = await db.register_user([isAdmin, username, hash]);
        const user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            username: user.username,
            id: user.id
        }
        res.status(201).json(req.session.user);
    }
};

login = async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await req.app.get('db').get_user([username]);
    const user = foundUser[0];
    if (!user) {
        return res.status(401).json("User not found");
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
        return res.status(403).json("Incorrect username or password")
    }
    req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username};
    return res.json(req.session.user);
};

logout = (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
}

module.exports = {
    register,
    login,
    logout
}