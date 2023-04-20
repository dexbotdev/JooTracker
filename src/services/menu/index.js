export default async function getMenuData() {
  return [
    // VB:REPLACE-START:MENU-CONFIG  
    {
      title: 'Portfolio',
      key: '__managetokens',
      url: '/managetokens',
      icon: 'fe fe-hard-drive',
    },
    {
      title: 'Manage Pairs',
      key: '__managepairs',
      url: '/managepairs',
      icon: 'fe fe-menu',
    },  
  ]
}
