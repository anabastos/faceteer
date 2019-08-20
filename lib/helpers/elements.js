export default {
  url: 'https://www.facebook.com',
  loginSelectors: {
    userForm: '#email',
    passForm: '#pass',
    loginButton: '#loginbutton',
  },
  argumentSelector: 'arguments[0].click()',
  postSelectors: {
    postDate: 'abbr',
    postText: 'div._5pbx',
    postBigText: 'span._4a6n',
    postsAuthor: 'span.fwb',
    postImg: 'img.scaledImageFitHeight',
    postLinkImg: 'img.scaledImageFitWidth',
    postLink: 'a._52c6',
    attachedImg: 'div.fbStoryAttachmentImage',
    commentText: 'span[class=\'_3l3x\'] > span',
    moreCommentsButton: 'div[class=\'_4sxd\']',
    postFeed: 'div._5pcb',
  },
  groupSelectors: {
    postFeedSelector: 'div[role=\'feed\'] > div[role=\'article\']',
    postSelector: 'div[role=\'region\'] > div[role=\'article\']',
    groupPostDiv: id => `[id*="mall_post_${id}"] > div > div`,
    memberListName: `div#groupsMemberSection_recently_joined > div 
> div > div > div > div > div > ul > div > a`,
    memberListNameExtended: `div#groupsMemberSection_recently_joined 
> div > div > div > div > div > div > div > ul > div > a`,
    memberAllListName: `div#groupsMemberSection_all_members > div > 
div > div > div > div > div > ul > div > a`,
  },
  profileSelectors: {
    name: 'a._2nlw',
    contactInfoIndex: 'div._4qm1 > ul > li > div > div._52ju',
    contactInfoValue: 'div._4qm1 > ul > li > div > div._pt5 > div > div',
    cityIndex: 'span._2iel',
    cityValue: 'div._4bl9 > div > div > div > div > div.fwn',
    educationLists: 'div._4qm1',
    educationIndex: 'div._2lzr',
    educationValue: 'div._173e',
    relashionShip: 'li._3pw9',
    familyRelationShip: 'div#family-relationships-pagelet > div > ul > li',
  }
};