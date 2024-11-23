const prisma = require('../../prisma');

// register user
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    if (!user) {
      res.status(400).json({ error: 'User not created' });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login user
export const loginUser = async (req, res) => {
  console.log(req.headers.authorization);
  const tokenId = req.headers.authorization;
  const ticket = await client.verifyIdToken({
    idToken: tokenId.slice(7),
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(payload);
  if (payload.aud != process.env.GOOGLE_CLIENT_ID)
    return res.send('Unauthorised');
  const { email, name } = payload;
  const authToken = jwt.sign({ email, name }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ authToken });
};

// verify user
export const verifyUser = async (req, res) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      return res.send('Unauthorised');
    }
    const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET);
  } catch (e) {
    return res.json({ data: 'NOT Authorised' });
  }
  res.json(user);
};
