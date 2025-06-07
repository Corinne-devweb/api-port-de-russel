const User = require("../models/user");
const bcrypt = require("bcrypt");

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const userService = {
  async createUser({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error("Tous les champs sont requis");
    }

    if (!validateEmail(email)) {
      throw new Error("Format d'email invalide");
    }

    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      const message =
        existingUser.email === email.toLowerCase()
          ? "Un utilisateur avec cet email existe déjà"
          : "Un utilisateur avec ce nom d'utilisateur existe déjà";
      throw new Error(message);
    }

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const savedUser = await newUser.save();

    return {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    };
  },

  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalUsers = await User.countDocuments();

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page * limit < totalUsers,
        hasPrevPage: page > 1,
      },
    };
  },

  async getUserByEmail(email) {
    if (!validateEmail(email)) {
      throw new Error("Format d'email invalide");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );

    if (!user) throw new Error("Utilisateur non trouvé");

    return user;
  },

  async getUserById(userId) {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error("ID utilisateur invalide");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) throw new Error("Utilisateur non trouvé");

    return user;
  },

  async updateUser(email, { username, password }) {
    if (!validateEmail(email)) {
      throw new Error("Format d'email invalide");
    }

    if (!username && !password) {
      throw new Error(
        "Au moins un champ (username ou password) doit être fourni"
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("Utilisateur non trouvé");

    if (username) {
      if (username.trim().length < 2) {
        throw new Error(
          "Le nom d'utilisateur doit contenir au moins 2 caractères"
        );
      }

      const existingUsername = await User.findOne({
        username: username.trim(),
        _id: { $ne: user._id },
      });

      if (existingUsername)
        throw new Error("Ce nom d'utilisateur est déjà pris");

      user.username = username.trim();
    }

    if (password) {
      if (password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }
      user.password = password; // will be hashed by pre('save')
    }

    user.updatedAt = new Date();
    await user.save();

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      updatedAt: user.updatedAt,
    };
  },

  async deleteUser(email) {
    if (!validateEmail(email)) {
      throw new Error("Format d'email invalide");
    }

    const user = await User.findOneAndDelete({ email: email.toLowerCase() });
    if (!user) throw new Error("Utilisateur non trouvé");

    return {
      id: user._id,
      username: user.username,
      email: user.email,
    };
  },

  async userExists(email) {
    return !!(await User.findOne({ email: email.toLowerCase() }));
  },

  async authenticateUser(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) throw new Error("Email ou mot de passe incorrect");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Email ou mot de passe incorrect");

    return {
      id: user._id,
      username: user.username,
      email: user.email,
    };
  },
};

module.exports = userService;
