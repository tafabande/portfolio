'use strict';
const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET /api/auth/status — return link status
router.get('/status', (req, res) => {
  const auth = db.githubAuth.get();
  const token = auth.access_token || process.env.GITHUB_PERSONAL_TOKEN;
  res.json({
    linked: Boolean(token || auth.username),
    username: auth.username || process.env.GITHUB_REPO_OWNER || 'tafabande',
    avatarUrl: auth.avatar_url || 'https://github.com/tafabande.png',
    repoOwner: auth.repo_owner || process.env.GITHUB_REPO_OWNER || 'tafabande',
    repoName: auth.repo_name || process.env.GITHUB_REPO_NAME || 'portfolio',
    hasToken: Boolean(token),
    linkedAt: auth.linked_at || null
  });
});

// GET /api/auth/github/login — trigger GitHub OAuth flow
router.get('/github/login', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || `http://localhost:${process.env.PORT || 3737}/api/auth/github/callback`;
  
  if (!clientId) {
    return res.status(400).json({
      error: 'GITHUB_CLIENT_ID is not configured in .env. You can use Personal Access Token linking instead.'
    });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
  res.redirect(githubAuthUrl);
});

// GET /api/auth/github/callback — handle OAuth callback from GitHub
router.get('/github/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Authorization code missing');

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Exchange code for token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error) {
      throw new Error(tokenData.error_description || 'Failed to exchange OAuth token');
    }

    const accessToken = tokenData.access_token;
    const scope = tokenData.scope;

    // Fetch user details from GitHub API
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Portfolio-Ingestion-App'
      }
    });

    const userData = await userRes.json();
    if (!userRes.ok) throw new Error('Failed to fetch GitHub user profile');

    // Save to database
    db.githubAuth.saveToken({
      username: userData.login,
      avatar_url: userData.avatar_url,
      access_token: accessToken,
      scope: scope
    });

    res.redirect('/?auth=success');

  } catch (err) {
    console.error('[OAUTH ERROR]', err.message);
    res.status(500).send(`OAuth authorization failed: ${err.message}`);
  }
});

// POST /api/auth/github/pat — Link account using Personal Access Token
router.post('/github/pat', async (req, res) => {
  const { token, repoOwner, repoName } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Portfolio-Ingestion-App'
      }
    });

    const userData = await userRes.json();
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid GitHub Personal Access Token' });

    db.githubAuth.saveToken({
      username: userData.login,
      avatar_url: userData.avatar_url,
      access_token: token,
      scope: 'repo',
      repo_owner: repoOwner || userData.login,
      repo_name: repoName || 'portfolio'
    });

    res.json({ success: true, username: userData.login });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/disconnect — unlink GitHub account
router.post('/disconnect', (req, res) => {
  db.githubAuth.unlink();
  res.json({ success: true, message: 'GitHub account unlinked' });
});

module.exports = router;
