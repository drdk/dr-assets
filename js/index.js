function fetch(file) {
  return require(file);
};

module.exports = {
  'core': fetch('./core/index.js'),
  'webfonts': fetch('./components/webfonts/font-load.js'),
  'widget-banner-ads': fetch('./components/widget-banner-ads/banner-ads.js'),
  'widget-cookie-policy': fetch('./components/widget-cookie-policy/cookie-policy.js'),
  'widget-media': fetch('./components/widget-media/index.js')
}
