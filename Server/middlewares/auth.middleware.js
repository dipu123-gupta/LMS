const isLoginedIn = async (req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new AppError('Unauthenticated, please login again',400))
    }

    const paylods=await jwt.verify(token,process.env.JWT_SECRET);
    req.user=paylods;

next();
}
module