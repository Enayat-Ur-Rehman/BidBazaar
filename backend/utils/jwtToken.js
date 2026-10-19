export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  // Never send the password hash back to the client.
  const safeUser = user.toObject();
  delete safeUser.password;
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user: safeUser,
      token,
    });
};
