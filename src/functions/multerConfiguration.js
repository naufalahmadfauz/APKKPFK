const path = require("path")
const util = require("util")
const fs = require("fs")
const multer = require("multer")
const randomString = require("randomstring")

//this function check if directory exists,if not, then create one. it returns promise
const storageFolder = async () => {
    const pathtopic = path.join(__dirname, '../../public/storage/picture')
    try {
        const statsFolderPromisified = util.promisify(fs.stat)
        await statsFolderPromisified(pathtopic)
        return ('Folder exists')
    } catch (e) {
        return fs.mkdir(pathtopic, {recursive: true}, (err) => {
            if (err) throw err
        })
    }
}
const ktpjknUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/storage/picture')
        },
        filename: function (req, file, cb) {
            const extfilename = path.extname(file.originalname)
            cb(null, randomString.generate({length: 6}) + extfilename)
        }
    }),
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File Must an image'))
        }
        cb(null, true)
    }
})


module.exports = {ktpjknUpload,storageFolder}