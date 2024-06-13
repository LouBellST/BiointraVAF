var ldap = require('ldapjs');
var assert = require('assert');


var client = null;

function searchUser(client, opts){
  return new Promise((resolve, reject) => {
    client.bind("CN=Scan Man,CN=Users,DC=biomaps,DC=lan", "ADinscriptor2!", function(err) {
      client.search('ou=Intern Users,dc=biomaps,dc=lan', opts, (err, res) => {
        assert.ifError(err);

        var success = false;
        var id;
        res.on('searchRequest', (searchRequest) => {
          console.log('searchRequest: ', searchRequest.messageId);
        });
        res.on('searchEntry', (entry) => {
          console.log('entry: ' + JSON.stringify(entry.pojo));
          success = true;
          id = entry.pojo;
        });
        res.on('searchReference', (referral) => {
          console.log('referral: ' + referral.uris.join());
        });
        res.on('error', (err) => {
          console.error('error: ' + err.message);
          reject(err);
        });
        res.on('end', (result) => {
          console.log('status: ' + result.status);
          if(success){resolve(id)}
            else{resolve(null)}
        });
      });

    });

    client.unbind((err) => {
      assert.ifError(err);
    });
  })
}

async function authenticateDN(username, password){
  
  if(client !== null){
    var client = ldap.createClient({
      url: 'ldap://zeta.biomaps.lan:389',
      reconnect: true
    });
  }
  var opts = {
    filter: `(&(samaccountname=${username})(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))`,
    scope: 'sub',
    attributes: ['sn', 'cn', 'adminCount']
  };

  
  let auth = await searchUser(client, opts).then((res) => res);

  return new Promise((resolve, reject) => {
    if(auth !== null){
      client.bind(`CN=${auth.attributes[0].values[0]},OU=Intern Users,DC=biomaps,DC=lan`, password, function(err) {
        if(err){
          resolve(false);
        }else{
          resolve(true);
        }
      });
    } else{
      resolve(false);
    }

  })
}

async function getUser(username, password){
  
  if(client !== null){
    var client = ldap.createClient({
      url: 'ldap://zeta.biomaps.lan:389',
      reconnect: true
    });
  }
  var opts = {
    filter: `(&(samaccountname=${username})(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))`,
    scope: 'sub',
    attributes: ['sn', 'cn', 'adminCount']
  };

  
  let user = await searchUser(client, opts).then((res) => res);
  return user;
}

async function authenticateUser(username, password){
  let auth = await authenticateDN(username, password).then((res) => res);
  return auth;
}


module.exports = { authenticateUser, getUser }