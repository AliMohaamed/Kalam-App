import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function initializePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        // --- Strategy Options ---
        // Our app's credentials, loaded from the .env file.
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      // --- Verify Callback ---
      // This function is called after the user successfully logs in with Google.
      async (accessToken, refreshToken, profile, done) => {
        console.log('Google profile:', profile);
        // The 'profile' object contains the user's information from Google.
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        };

        try {
          // 1. Find a user in our database who has the same Google ID.
          let user = await prisma.user.findUnique({
            where: { googleId: profile.id },
          });

          if (user) {
            // 2. If the user already exists, call 'done' with that user object.
            return done(null, user);
          } else {
            // 3. If the user does not exist, create a new user in our database.
            user = await prisma.user.create({ data: newUser });
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  // --- Session Management ---
  // These functions are required to persist the user's login session.

  // 'serializeUser' determines which data of the user object should be stored in the session.
  // We only store the user's ID.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 'deserializeUser' retrieves the full user object from the database using the ID stored in the session.
  // This makes the user object available on `req.user`.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default initializePassport;