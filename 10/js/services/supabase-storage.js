/**
 * SubTracker - Service Supabase Storage (upload/download fichiers)
 */
var StorageService = (function() {
  'use strict';

  var BUCKET = 'documents';

  function getUserPath() {
    var user = Auth.getUser();
    return user ? user.id : 'anonymous';
  }

  async function upload(file, subPath) {
    var path = getUserPath() + '/' + (subPath || '') + '/' + Date.now() + '_' + file.name;
    path = path.replace(/\/+/g, '/');

    var result = await supabaseClient.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (result.error) throw result.error;
    return { path: result.data.path, size: file.size, type: file.type, name: file.name };
  }

  function getPublicUrl(path) {
    var result = supabaseClient.storage.from(BUCKET).getPublicUrl(path);
    return result.data.publicUrl;
  }

  async function getSignedUrl(path, expiresIn) {
    expiresIn = expiresIn || 3600;
    var result = await supabaseClient.storage.from(BUCKET).createSignedUrl(path, expiresIn);
    if (result.error) throw result.error;
    return result.data.signedUrl;
  }

  async function remove(path) {
    var result = await supabaseClient.storage.from(BUCKET).remove([path]);
    if (result.error) throw result.error;
  }

  async function download(path) {
    var result = await supabaseClient.storage.from(BUCKET).download(path);
    if (result.error) throw result.error;
    return result.data;
  }

  return {
    upload: upload,
    getPublicUrl: getPublicUrl,
    getSignedUrl: getSignedUrl,
    remove: remove,
    download: download
  };
})();
