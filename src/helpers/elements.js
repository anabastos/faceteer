export default {
  url: 'https://www.facebook.com/',
  userForm: '#email',
  passForm: '#pass',
  loginButton: '#loginbutton',
  postSelector: 'div[role=\'region\'] > div[role=\'article\']',
  postFeedSelector: 'div[role=\'feed\'] > div[role=\'article\']',
  argumentSelector: 'arguments[0].click()',
  groupPostDiv: id => `[id*="mall_post_${id}"] > div > div`
};