// import jwt from "jsonwebtoken";

// const finalise = (req, res) => {
//   let user = req.user;
//   user = JSON.parse(JSON.stringify(user));
//   user = sanitizeInternalFields(user);

//   const collections = req.payload.collections;
//   const userCollection = collections[req.payload.config.admin.user];
//   const collectionConfig = userCollection.config;

//   const fieldsToSign = getFieldsToSign(collectionConfig, user);

//   const token = jwt.sign(fieldsToSign, req.payload.secret, {
//     expiresIn: collectionConfig.auth.tokenExpiration,
//   });

//   const cookieOptions = {
//     path: "/",
//     httpOnly: true,
//     expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),
//     secure: collectionConfig.auth.cookies.secure,
//     sameSite: collectionConfig.auth.cookies.sameSite,
//     domain: undefined,
//   };

//   if (collectionConfig.auth.cookies.domain) {
//     cookieOptions.domain = collectionConfig.auth.cookies.domain;
//   }

//   res.cookie(`payload-token`, token, cookieOptions);

//   req.user = user;

//   return { req, res, token };
// };

// export default finalise;