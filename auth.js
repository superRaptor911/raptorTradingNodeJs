/* eslint-disable no-throw-literal */
const {verifyUserAuth} = require('./controller/users/Users');

const verifyUser = async (req, res) => {
  // User Auth
  try {
    const {username, password} = req.body;
    await verifyUserAuth(username, password);
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
    return false;
  }

  return true;
};

const verifyAdmin = (req, res) => {
  // Admin Auth
  try {
    const {password} = req.body;
    if (password !== process.env.PASS) {
      throw 'Wrong Admin Password';
    }
  } catch (e) {
    console.error('auth::', e);
    res.status(500).json({status: false, message: e});
    return false;
  }

  return true;
};

async function authorize(req, res, next) {
  let accessDenied = true;
  // Login and Get req does not require auth
  if (req.path === '/users/login' || req.method === 'GET') {
    accessDenied = false;
  } else if (req.path.split('/')[1] === 'wazirx') {
    // accessDenied = !(await verifyUser(req, res));
    accessDenied = true;
  } else {
    accessDenied = !verifyAdmin(req, res);
  }

  if (!accessDenied) {
    next();
  }
}

module.exports.authorize = authorize;
