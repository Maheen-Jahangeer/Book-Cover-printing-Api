import jwt from 'jsonwebtoken';

export const verifyToken =(req,res,next) => {
    const authHeader = req.headers.verifytoken
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token,process.env.JWTKEY,(err,user)=> {
            if(err){
                res.status(500).json('Json verification failed');
            }else{
                req.user = user
                next();
            }
        })
    }else{
        res.status(500).json("No token found");
    }
}

export const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.id === req.params.id || isAdmin){
            next()
        }else{
            res.status(500).json("Authorization failed");
        }
    })
}

export const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res, () => {
        if(req.user.isAdmin) {
            next()
        }else{
            res.status(500).json("This is not an admin")
        }
    })
}