import jwt from 'jsonwebtoken';

// This function handles the logic after Google successfully authenticates.
export const googleCallback = (req, res) => {
  console.log("######################### Google Callback Function Called #########################");
  // 1. Create the JWT Payload from the user object provided by Passport
  const payload = {
    id: req.user.id,
    displayName: req.user.displayName,
    image: req.user.image,
  };

  // 2. Sign the token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  // 3. Redirect to the frontend, passing the token in the URL
  res.redirect(`${process.env.CLIENT_URL_AUTH}/?token=${token}`);
};

// This function handles user logout.
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Redirect to the client's home page after logout.
    res.redirect(process.env.CLIENT_URL_AUTH);
  });
};