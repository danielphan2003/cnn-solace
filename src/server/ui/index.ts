export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('CNN Solace') // edit me!
    .addItem('Open as dialog', 'openDialog')
    .addItem('Open as sidebar', 'openSidebar');

  menu.addToUi();
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'CNN Solace');
};

export const openSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar').setTitle(
    'CNN Solace'
  );
  SpreadsheetApp.getUi().showSidebar(html);
};
