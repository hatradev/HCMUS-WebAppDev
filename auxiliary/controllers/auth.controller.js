const express = require('express');
const router = express.Router();

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

module.exports = (oauth2Client) => {
  router.get('/google', (req, res) => {
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true
    });
    res.redirect(authorizationUrl);
  });

  router.get('/google/callback', async (req, res) => {
    try {
      const {tokens} = await oauth2Client.getToken(req.query.code);
      oauth2Client.setCredentials(tokens);
      res.render('success');
    } catch (error) {
      res.send('Authentication failed!');
    }
  });

  return router;
};