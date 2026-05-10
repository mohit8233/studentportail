import jwt from 'jsonwebtoken'
export const authMiddle = async (req,res,next)=>{
    try {
          const token = req.header('Authorization')?.replace('Bearer ', '');

         if(!token){
            return res.status(401).json({
                status: false,
                message:"Missing token, authorization denied"
            })
         }
         const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
         req.user = decoded;
        
         next()
         
    } catch (error) {
        return res.json({
            message:`Unauthorized token${error.message}`
        })
    }
}