import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token) {
        try {
            //Декодуємо токен використовуючи ключ та виносимо з json об'єкту id
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();
        } catch (e) {
            return res.status(403).json({
                message: 'Нема доступу'
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нема доступу'
        });
    }
};