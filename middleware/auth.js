const {Akun} = require('../models/')

const auth = async (req, res, next) => {
    try {
        // const akun = await Akun.findOne({username: req.session.username})
        const akun = await Akun.findOne({
            where:
                {username: req.session.username
                }
        })
        if (!akun) {
            await req.session.destroy()
            return res.status(403).send({error: 'Silahkan masuk terlebih dahulu.'})
        } else {
            req.akun = akun
            next()
        }
    } catch (e) {
        return res.status(401).send({error: 'Masuk menggunakan akun'})
    }
}
module.exports = auth