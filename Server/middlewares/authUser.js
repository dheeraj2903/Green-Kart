// import jwt from 'jsonwebtoken'

// const authUser = async (req, res, next)=>{
//     const {token} = req.cookies

//     if(!token){
//         return res.json({ success: false, message: 'Not Authorized'})
//     }

//     try {
//         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
//         if(tokenDecode.id){
//             //req.user = { _id: tokenDecode.id };
//             req.userId = tokenDecode.id;

//         }else{
//             return res.json({success: false, message: 'Not Authorized'})
//         }
//         next();

//     } catch (error) {
//         return res.json({success: false, message: error.message})
//     }
// }

// export default authUser


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenDecode.id);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    req.user = user;        // Full user object → AppContext expects this
    req.userId = user._id;  // Convenience for queries

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
