const { ImgurClient } = require('imgur')
const { createReadStream } = require('fs')
const clientId = process.env.IMGUR_ID
const client = new ImgurClient({ clientId })
/**
 *
 * @param {object} file Object contains property path
 * @returns {string} URL of image
 */
async function uploadFile(file) {
  if (!file) return null
  const fileObject = {
    image: createReadStream(file.path),
    type: 'stream',
  }
  const uploadReturning = await client.upload(fileObject)
  return uploadReturning?.data?.link
}
