var express = require('express');
var path = require('path');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Does the server hold an Anthropic key? (set ANTHROPIC_API_KEY in Railway -> Variables)
app.get('/api/keystatus', function(req, res){
  res.json({ hasKey: !!process.env.ANTHROPIC_API_KEY });
});

// Proxy to Anthropic using the server-held key — works for every device, key never reaches the browser
app.post('/api/parse', function(req, res){
  var key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(400).json({ error: { message: 'Server API key not set. Railway Variables mein ANTHROPIC_API_KEY add karo.' } });
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: req.body.model || 'claude-haiku-4-5',
      max_tokens: 1000,
      messages: req.body.messages
    })
  }).then(function(r){
    return r.json().then(function(data){ res.status(r.status).json(data); });
  }).catch(function(e){
    res.status(502).json({ error: { message: 'Upstream error: ' + e.message } });
  });
});

app.get('/.well-known/assetlinks.json', function(req, res){
  res.type('application/json');
  res.sendFile(path.join(__dirname, 'public', '.well-known', 'assetlinks.json'));
});
app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'allow' }));
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, function(){ console.log('WeightCalc running on ' + PORT); });
