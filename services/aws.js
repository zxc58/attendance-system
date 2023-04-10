//
// const AWS = require('aws-sdk')
// const accessKeyId = process.env.AWS_IAM_ACCESS_KEY_ID
// const secretAccessKey = process.env.AWS_IAM_SECRET_ACCESS_KEY
// const s3 = new AWS.S3({ accessKeyId, secretAccessKey })
// const params = {
//   Bucket: process.env.AWS_S3_BUCKET,
//   Key: short.generate(),
//   Body: req.file.buffer,
//   ACL: 'public-read',
//   ContentType: req.file.mimetype,
// }
// s3.upload(params, async function (err, data) {
//   try {
//     if (err) {
//       const message = 'update avatar fail'
//       return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message })
//     }
//     employee.avatar = data.Location
//     await employee.save()
//     return res.json({ message: 'successfully', avatar: data.Location })
//   } catch (err) {
//     const message = 'Update avatar fail'
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message })
//   }
// })
