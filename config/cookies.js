const refreshTokenMaxage = Number(process.env.REFRESH_TOKEN_MAXAGE ?? 50000)
const cookiesConfig = {
  refreshToken: {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    signed: true,
    maxAge: refreshTokenMaxage * 1000,
  },
}
module.exports = cookiesConfig
