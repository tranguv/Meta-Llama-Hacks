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
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
