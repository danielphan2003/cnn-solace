import * as publicUiFunctions from './sheets/context/ui';
import * as publicSheetFunctions from './sheets/context/sheets';

// Expose public functions by attaching to `global`
global.onOpen = publicUiFunctions.onOpen;
global.openDialog = publicUiFunctions.openDialog;
global.openSidebar = publicUiFunctions.openSidebar;
global.onEdit = publicSheetFunctions.onEdit;