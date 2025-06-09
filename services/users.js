const bcrypt = require("bcrypt");
const User = require("../models/user");

const userService = {
  // Authentifier un utilisateur
  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      // Comparer le password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error("Mot de passe incorrect");
      }

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer tous les utilisateurs
  async getAllUsers(page, limit) {
    try {
      if (page && limit) {
        const skip = (page - 1) * limit;
        const users = await User.find()
          .select("-password")
          .skip(skip)
          .limit(limit);
        const total = await User.countDocuments();
        return {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      } else {
        const users = await User.find().select("-password");
        return { users };
      }
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un utilisateur par email
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Créer un utilisateur
  async createUser(userData) {
    try {
      const { username, email, password } = userData;

      // Vérifier si l'email existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
      }

      // Créer l'utilisateur
      const user = new User({
        username,
        email,
        password,
      });

      const savedUser = await user.save();

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = savedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(email, updateData) {
    try {
      const user = await User.findOneAndUpdate({ email }, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un utilisateur
  async deleteUser(email) {
    try {
      const user = await User.findOneAndDelete({ email }).select("-password");

      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      return { message: "Utilisateur supprimé avec succès", user };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userService;
