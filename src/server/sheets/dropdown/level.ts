function onEdit(event) 
{
  var t = new Date();
  
  
  var maxRows = false;
	
  // Change Settings:
  //--------------------------------------------------------------------------------------
  var TargetSheet = 'Main'; // name of sheet with data validation
  var LogSheet = 'Data1'; // name of sheet with data
  var NumOfLevels = 4; // number of levels of data validation
  var lcol = 2; // number of column where validation starts; A = 1, B = 2, etc.
  var lrow = 2; // number of row where validation starts
  var offsets = [1,1,1,2]; // offsets for levels
  var maxRows = 21; // to set the last row of validation, delete this row if not needed
  //                   ^ means offset column #4 on one position right.
  
  // =====================================================================================
	
  SmartDataValidation(event, TargetSheet, LogSheet, NumOfLevels, lcol, lrow, offsets, maxRows);
  
  // Change Settings:
  //--------------------------------------------------------------------------------------
  var TargetSheet = 'Main'; // name of sheet with data validation
  var LogSheet = 'Data2'; // name of sheet with data
  var NumOfLevels = 7; // number of levels of data validation
  var lcol = 9; // number of column where validation starts; A = 1, B = 2, etc.
  var lrow = 2; // number of row where validation starts
  var offsets = [1,1,1,1,1,1,1]; // offsets for levels
  // var maxRows = 500; // to set the last row of validation, delete this row if not needed
  // =====================================================================================  
  SmartDataValidation(event, TargetSheet, LogSheet, NumOfLevels, lcol, lrow, offsets);

  
  Logger.log((new Date()) - t);
}



function SmartDataValidation(event, TargetSheet, LogSheet, NumOfLevels, lcol, lrow, offsets, maxRows) 
{
  //--------------------------------------------------------------------------------------
  // The event handler, adds data validation for the input parameters
  //--------------------------------------------------------------------------------------
  
  var FormulaSplitter = ';'; // depends on regional setting, ';' or ',' works for US
  //--------------------------------------------------------------------------------------
  
  //	===================================   key variables	 =================================
  //
  //		ss			sheet we change (TargetSheet)
  //			br				range to change
  //			scol			number of column to edit
  //			srow			number of row to edit	
  //			CurrentLevel	level of drop-down, which we change
  //			HeadLevel		main level
  //			r				current cell, which was changed by user
  //			X         		number of levels could be checked on the right
  //
  //		ls			Data sheet (LogSheet)
  //
  //    ======================================================================================

	// Checks
	var ts = event.source.getActiveSheet();
	var sname = ts.getName(); 
	if (sname !== TargetSheet) { return -1;  } // not main sheet
    // Test if range fits
    var br = event.range;
    var scol = br.getColumn(); // the column number in which the change is made
    var srow = br.getRow() // line number in which the change is made
	var ColNum = br.getWidth();
    
	if ((scol + ColNum - 1) < lcol) { return -2; }  // columns... 
	if (srow < lrow) { return -3; } // rows
	
	if (maxRows)
	{
		if (srow > maxRows)	 { return -3.5; }	// max rows
	}
	
	// Test range is in levels
	var columnsLevels = getColumnsOffset_(offsets, lcol); // Columns for all levels	
	var CurrentLevel = getCurrentLevel_(ColNum, br, scol, columnsLevels);
	if(CurrentLevel === 1) { return -4; } // out of data validations
    if(CurrentLevel > NumOfLevels) { return -5; } // last level	


/*
		ts - sheet with validation, sname = name of sheet
		
						 NumOfLevels = 4                     
						 offsets = [1,1,1,2] - last offset is 2 because need to skip 1 column
						 columnsLevels = [4,5,6,8] - Columns of validation
						 
										 Columns 7 is skipped
										 |
		   1	2	 3	  4    5    6    7    8    9    
		|----+----+----+----+----+----+----+----+----+
	1	|	 |    |    |    |    |    |  x |    |    |
		|----+----+----+----+----+----+----+----+----+
	2	|	 |    |    |  v |  V |  ? |  x |  ? |    | lrow = 2 - number of row where validation starts
		|----+----+----+----+----+----+----+----+----+
	3	|	 |    |    |    |    |    |  x |    |    |
		|----+----+----+----+----+----+----+----+----+
	4	|	 |    |    |    |    |    |  x |    |    |
		|----+----+----+----+----+----+----+----+----+
					   |  |	  |	    |           |
					   |  |	  |	    | Currentlevel = 3 - the number of level to change
					   |  |	  |	                |
					   |  |   | br - cell, user changes: scol - column, srow - row,
					   |  |          ColNum = 1 - width   
					   |__|________   _.....____|
						  |         v
						  |  Drop-down lists					
						  |
						  | lcol = 4 - number of column where validation starts
*/
	// Constants
	var ReplaceCommas = getDecimalMarkIsCommaLocals(); // // ReplaceCommas = true if locale uses commas to separate decimals
	var ls = SpreadsheetApp.getActive().getSheetByName(LogSheet); // Data sheet       				         
    var RowNum = br.getHeight();
	/* 	Adjust the range 'br' 
	    ???       !
		xxx       x
		xxx       x 
		xxx  =>   x
		xxx       x
		xxx       x
	*/	
    br = ts.getRange(br.getRow(), columnsLevels[CurrentLevel - 2], RowNum); 
	// Levels
    var HeadLevel = CurrentLevel - 1; // main level
    var X = NumOfLevels - CurrentLevel + 1; // number of levels left       
    // determine columns on the sheet 'Data'
    var KudaCol = NumOfLevels + 2;
    var KudaNado = ls.getRange(1, KudaCol);  // 1 place for a formula
    var lastRow = ls.getLastRow();
    var ChtoNado = ls.getRange(1, KudaCol, lastRow, KudaCol); // the range with list, returned by a formula
    
    // ============================================================================= > loop >
    var CurrLevelBase = CurrentLevel; // remember the first current level
    
    

    for (var j = 1; j <= RowNum; j++) // [01] loop rows start
    {    
      // refresh first val  
      var currentRow = br.getCell(j, 1).getRow();      
      loopColumns_(HeadLevel, X, currentRow, NumOfLevels, CurrLevelBase, lastRow, FormulaSplitter, CurrLevelBase, columnsLevels, br, KudaNado, ChtoNado, ReplaceCommas, ts);
    } // [01] loop rows end

           

}


function getColumnsOffset_(offsets, lefColumn)
{
	// Columns for all levels
	var columnsLevels = [];
	var totalOffset = 0;	
	for (var i = 0, l = offsets.length; i < l; i++)
	{	
		totalOffset += offsets[i];
		columnsLevels.push(totalOffset + lefColumn - 1);
	}	
	
	return columnsLevels;
	
}

function test_getCurrentLevel()
{
  var br = SpreadsheetApp.getActive().getActiveSheet().getRange('A5:C5');
  var scol = 1;
  
  
  /*
            |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |
      range |xxxxx| 
   dv range |xxxxxxxxxxxxxxxxx|
     levels    1     2     3
      level          2
  
  */
  Logger.log(getCurrentLevel_(1, br, scol, [1,2,3])); // 2
  
  /*
            |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |
      range |xxxxxxxxxxx| 
   dv range |xxxxx|     |xxxxx|     |xxxxx|
     levels    1           2           3
      level                2
  
  */  
  Logger.log(getCurrentLevel_(2, br, scol, [1,3,5])); // 2
  
  /*
            |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |
      range |xxxxxxxxxxxxxxxxx| 
   dv range |xxxxx|                 |xxxxxxxxxxx| 
     levels    1                       2     3
      level                            2
  
  */    
  Logger.log(getCurrentLevel_(3, br, scol, [1,5,6])); // 2
  
  
  /*
            |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |
      range |xxxxxxxxxxxxxxxxx| 
   dv range |xxxxxxxxxxx|                             |xxxxx| 
     levels    1     2                                   3
      level                                              3
  
  */    
  Logger.log(getCurrentLevel_(3, br, scol, [1,2,8])); // 3
  
  
  /*
            |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |
      range |xxxxxxxxxxxxxxxxx| 
   dv range |xxxxxxxxxxxxxxxxx|
     levels    1     2     3
      level                      4 (error)
  
  */    
  Logger.log(getCurrentLevel_(3, br, scol, [1,2,3]));
  
  
  /*
            |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |
      range |xxxxxxxxxxxxxxxxx| 
   dv range                         |xxxxxxxxxxxxxxxxx|
     levels    
      level    1 (error)                      
  
  */    
  Logger.log(getCurrentLevel_(3, br, scol, [5,6,7])); // 1 
  
}


function getCurrentLevel_(ColNum, br, scol, columnsLevels)
{
	var colPlus = 2; // const
	if (ColNum === 1) { return columnsLevels.indexOf(scol) + colPlus; }
	var CurrentLevel = -1;
	var level = 0;
	var column = 0;
	for (var i = 0; i < ColNum; i++ )
	{
		column = br.offset(0, i).getColumn();
		level = columnsLevels.indexOf(column) + colPlus;
		if (level > CurrentLevel) { CurrentLevel = level; }
	}
	return CurrentLevel;
}



function loopColumns_(HeadLevel, X, currentRow, NumOfLevels, CurrentLevel, lastRow, FormulaSplitter, CurrLevelBase, columnsLevels, br, KudaNado, ChtoNado, ReplaceCommas, ts)
{
  for (var k = 1; k <= X; k++)
  {   
    HeadLevel = HeadLevel + k - 1; 
    CurrentLevel = CurrLevelBase + k - 1;
	var r = ts.getRange(currentRow, columnsLevels[CurrentLevel - 2]);
	var SearchText = r.getValue(); // searched text 
	X = loopColumn_(X, SearchText, HeadLevel, HeadLevel, currentRow, NumOfLevels, CurrentLevel, lastRow, FormulaSplitter, CurrLevelBase, columnsLevels, br, KudaNado, ChtoNado, ReplaceCommas, ts);
  } 
}


function loopColumn_(X, SearchText, HeadLevel, HeadLevel, currentRow, NumOfLevels, CurrentLevel, lastRow, FormulaSplitter, CurrLevelBase, columnsLevels, br, KudaNado, ChtoNado, ReplaceCommas, ts)
{
    

  // if nothing is chosen!
  if (SearchText === '') // condition value =''
  {
    // kill extra data validation if there were 
    // columns on the right
    if (CurrentLevel <= NumOfLevels) 
    {
      for (var f = 0; f < X; f++) 
      {
        var cell = ts.getRange(currentRow, columnsLevels[CurrentLevel + f - 1]);		  
        // clean & get rid of validation
        cell.clear({contentsOnly: true});              
        cell.clear({validationsOnly: true});
        // exit columns loop  
      }
    }
    return 0;	// end loop this row	
  }
  
  
  // formula for values
  var formula = getDVListFormula_(CurrentLevel, currentRow, columnsLevels, lastRow, ReplaceCommas, FormulaSplitter, ts);  
  KudaNado.setFormula(formula);
    
  
  // get response
  var Response = getResponse_(ChtoNado, lastRow, ReplaceCommas);
  var Variants = Response.length;
    

  // build data validation rule
  if (Variants === 0.0) // empty is found
  {
    return;
  }  
  if(Variants >= 1.0) // if some variants were found
  {
    
    var cell = ts.getRange(currentRow, columnsLevels[CurrentLevel - 1]);
    var rule = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(Response, true)
    .setAllowInvalid(false)
    .build();
    // set validation rule
    cell.setDataValidation(rule);
  }    
  if (Variants === 1.0) // // set the only value
  {      
    cell.setValue(Response[0]);
    SearchText = null;
    Response = null;
    return X; // continue doing DV
  } // the only value
  
  return 0; // end DV in this row
  
}


function getDVListFormula_(CurrentLevel, currentRow, columnsLevels, lastRow, ReplaceCommas, FormulaSplitter, ts)
{
  
  var checkVals = [];
  var Offs = CurrentLevel - 2;
  var values = [];
  // get values and display values for a formula
  for (var s = 0; s <= Offs; s++)
  {
    var checkR = ts.getRange(currentRow, columnsLevels[s]);
    values.push(checkR.getValue());
  } 		  
  
  var LookCol = colName(CurrentLevel-1); // gets column name 'A,B,C...'
  var formula = '=unique(filter(' + LookCol + '2:' + LookCol + lastRow; // =unique(filter(A2:A84

  var mathOpPlusVal = ''; 
  var value = '';

  // loop levels for multiple conditions  
  for (var i = 0; i < CurrentLevel - 1; i++) {            
    formula += FormulaSplitter; // =unique(filter(A2:A84;
    LookCol = colName(i);
    		
    value = values[i];

    mathOpPlusVal = getValueAndMathOpForFunction_(value, FormulaSplitter, ReplaceCommas); // =unique(filter(A2:A84;B2:B84='Text'
    
    if ( Array.isArray(mathOpPlusVal) )
    {
      formula += mathOpPlusVal[0];
      formula += LookCol + '2:' + LookCol + lastRow; // =unique(filter(A2:A84;ROUND(B2:B84
      formula += mathOpPlusVal[1];
    }
    else
    {
      formula += LookCol + '2:' + LookCol + lastRow; // =unique(filter(A2:A84;B2:B84
      formula += mathOpPlusVal;
    }
    
    
  }  
  
  formula += '))'; //=unique(filter(A2:A84;B2:B84='Text'))

  return formula;
}


function getValueAndMathOpForFunction_(value, FormulaSplitter, ReplaceCommas)
{
  var result = '';
  var splinter = '';	
	
  var type = typeof value;
  
 
  // strings
  if (type === 'string') return '='' + value + ''';
  // date
  if(value instanceof Date)
  {
	return ['ROUND(', FormulaSplitter +'5)=ROUND(DATE(' + value.getFullYear() + FormulaSplitter + (value.getMonth() + 1) + FormulaSplitter + value.getDate() + ')' + '+' 
	      + 'TIME(' + value.getHours() + FormulaSplitter + value.getMinutes() + FormulaSplitter + value.getSeconds() + ')' + FormulaSplitter + '5)'];	  
  }  
  // numbers
  if (type === 'number')
  {
	if (ReplaceCommas)
	{
		return '+0=' + value.toString().replace('.', ',');		
	}
	else
	{
		return '+0=' + value;
	}
  }
  // booleans
  if (type === 'boolean')
  {
	  return '=' + value;
  }  
  // other
  return '=' + value;
	
}


function getResponse_(allRange, l, ReplaceCommas)
{
  var data = allRange.getValues();
  var data_ = allRange.getDisplayValues();
  
  var response = [];
  var val = '';
  for (var i = 0; i < l; i++)
  {
    val = data[i][0];
    if (val !== '') 
    {
      var type = typeof val;
      if (type === 'boolean' || val instanceof Date) val = String(data_[i][0]);
      if (type === 'number' && ReplaceCommas) val = val.toString().replace('.', ',')
      response.push(val);  
    }
  }
  
  return response;  
}




function colName(n) {
    var ordA = 'a'.charCodeAt(0);
    var ordZ = 'z'.charCodeAt(0);
    
    var len = ordZ - ordA + 1;

    var s = '';
    while(n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s; 
}


function getDecimalMarkIsCommaLocals() {


// list of Locals Decimal mark = comma
var LANGUAGE_BY_LOCALE = {
    af_NA: 'Afrikaans (Namibia)',
    af_ZA: 'Afrikaans (South Africa)',
    af: 'Afrikaans',
    sq_AL: 'Albanian (Albania)',
    sq: 'Albanian',
    ar_DZ: 'Arabic (Algeria)',
    ar_BH: 'Arabic (Bahrain)',
    ar_EG: 'Arabic (Egypt)',
    ar_IQ: 'Arabic (Iraq)',
    ar_JO: 'Arabic (Jordan)',
    ar_KW: 'Arabic (Kuwait)',
    ar_LB: 'Arabic (Lebanon)',
    ar_LY: 'Arabic (Libya)',
    ar_MA: 'Arabic (Morocco)',
    ar_OM: 'Arabic (Oman)',
    ar_QA: 'Arabic (Qatar)',
    ar_SA: 'Arabic (Saudi Arabia)',
    ar_SD: 'Arabic (Sudan)',
    ar_SY: 'Arabic (Syria)',
    ar_TN: 'Arabic (Tunisia)',
    ar_AE: 'Arabic (United Arab Emirates)',
    ar_YE: 'Arabic (Yemen)',
    ar: 'Arabic',
    hy_AM: 'Armenian (Armenia)',
    hy: 'Armenian',
    eu_ES: 'Basque (Spain)',
    eu: 'Basque',
    be_BY: 'Belarusian (Belarus)',
    be: 'Belarusian',
    bg_BG: 'Bulgarian (Bulgaria)',
    bg: 'Bulgarian',
    ca_ES: 'Catalan (Spain)',
    ca: 'Catalan',
    tzm_Latn: 'Central Morocco Tamazight (Latin)',
    tzm_Latn_MA: 'Central Morocco Tamazight (Latin, Morocco)',
    tzm: 'Central Morocco Tamazight',
    da_DK: 'Danish (Denmark)',
    da: 'Danish',
    nl_BE: 'Dutch (Belgium)',
    nl_NL: 'Dutch (Netherlands)',
    nl: 'Dutch',
    et_EE: 'Estonian (Estonia)',
    et: 'Estonian',
    fi_FI: 'Finnish (Finland)',
    fi: 'Finnish',
    fr_BE: 'French (Belgium)',
    fr_BJ: 'French (Benin)',
    fr_BF: 'French (Burkina Faso)',
    fr_BI: 'French (Burundi)',
    fr_CM: 'French (Cameroon)',
    fr_CA: 'French (Canada)',
    fr_CF: 'French (Central African Republic)',
    fr_TD: 'French (Chad)',
    fr_KM: 'French (Comoros)',
    fr_CG: 'French (Congo - Brazzaville)',
    fr_CD: 'French (Congo - Kinshasa)',
    fr_CI: 'French (Côte d’Ivoire)',
    fr_DJ: 'French (Djibouti)',
    fr_GQ: 'French (Equatorial Guinea)',
    fr_FR: 'French (France)',
    fr_GA: 'French (Gabon)',
    fr_GP: 'French (Guadeloupe)',
    fr_GN: 'French (Guinea)',
    fr_LU: 'French (Luxembourg)',
    fr_MG: 'French (Madagascar)',
    fr_ML: 'French (Mali)',
    fr_MQ: 'French (Martinique)',
    fr_MC: 'French (Monaco)',
    fr_NE: 'French (Niger)',
    fr_RW: 'French (Rwanda)',
    fr_RE: 'French (Réunion)',
    fr_BL: 'French (Saint Barthélemy)',
    fr_MF: 'French (Saint Martin)',
    fr_SN: 'French (Senegal)',
    fr_CH: 'French (Switzerland)',
    fr_TG: 'French (Togo)',
    fr: 'French',
    gl_ES: 'Galician (Spain)',
    gl: 'Galician',
    ka_GE: 'Georgian (Georgia)',
    ka: 'Georgian',
    de_AT: 'German (Austria)',
    de_BE: 'German (Belgium)',
    de_DE: 'German (Germany)',
    de_LI: 'German (Liechtenstein)',
    de_LU: 'German (Luxembourg)',
    de_CH: 'German (Switzerland)',
    de: 'German',
    el_CY: 'Greek (Cyprus)',
    el_GR: 'Greek (Greece)',
    el: 'Greek',
    hu_HU: 'Hungarian (Hungary)',
    hu: 'Hungarian',
    is_IS: 'Icelandic (Iceland)',
    is: 'Icelandic',
    id_ID: 'Indonesian (Indonesia)',
    id: 'Indonesian',
    it_IT: 'Italian (Italy)',
    it_CH: 'Italian (Switzerland)',
    it: 'Italian',
    kab_DZ: 'Kabyle (Algeria)',
    kab: 'Kabyle',
    kl_GL: 'Kalaallisut (Greenland)',
    kl: 'Kalaallisut',
    lv_LV: 'Latvian (Latvia)',
    lv: 'Latvian',
    lt_LT: 'Lithuanian (Lithuania)',
    lt: 'Lithuanian',
    mk_MK: 'Macedonian (Macedonia)',
    mk: 'Macedonian',
    naq_NA: 'Nama (Namibia)',
    naq: 'Nama',
    pl_PL: 'Polish (Poland)',
    pl: 'Polish',
    pt_BR: 'Portuguese (Brazil)',
    pt_GW: 'Portuguese (Guinea-Bissau)',
    pt_MZ: 'Portuguese (Mozambique)',
    pt_PT: 'Portuguese (Portugal)',
    pt: 'Portuguese',
    ro_MD: 'Romanian (Moldova)',
    ro_RO: 'Romanian (Romania)',
    ro: 'Romanian',
    ru_MD: 'Russian (Moldova)',
    ru_RU: 'Russian (Russia)',
    ru_UA: 'Russian (Ukraine)',
    ru: 'Russian',
    seh_MZ: 'Sena (Mozambique)',
    seh: 'Sena',
    sk_SK: 'Slovak (Slovakia)',
    sk: 'Slovak',
    sl_SI: 'Slovenian (Slovenia)',
    sl: 'Slovenian',
    es_AR: 'Spanish (Argentina)',
    es_BO: 'Spanish (Bolivia)',
    es_CL: 'Spanish (Chile)',
    es_CO: 'Spanish (Colombia)',
    es_CR: 'Spanish (Costa Rica)',
    es_DO: 'Spanish (Dominican Republic)',
    es_EC: 'Spanish (Ecuador)',
    es_SV: 'Spanish (El Salvador)',
    es_GQ: 'Spanish (Equatorial Guinea)',
    es_GT: 'Spanish (Guatemala)',
    es_HN: 'Spanish (Honduras)',
    es_419: 'Spanish (Latin America)',
    es_MX: 'Spanish (Mexico)',
    es_NI: 'Spanish (Nicaragua)',
    es_PA: 'Spanish (Panama)',
    es_PY: 'Spanish (Paraguay)',
    es_PE: 'Spanish (Peru)',
    es_PR: 'Spanish (Puerto Rico)',
    es_ES: 'Spanish (Spain)',
    es_US: 'Spanish (United States)',
    es_UY: 'Spanish (Uruguay)',
    es_VE: 'Spanish (Venezuela)',
    es: 'Spanish',
    sv_FI: 'Swedish (Finland)',
    sv_SE: 'Swedish (Sweden)',
    sv: 'Swedish',
    tr_TR: 'Turkish (Turkey)',
    tr: 'Turkish',
    uk_UA: 'Ukrainian (Ukraine)',
    uk: 'Ukrainian',
    vi_VN: 'Vietnamese (Vietnam)',
    vi: 'Vietnamese'
}


var SS = SpreadsheetApp.getActiveSpreadsheet();
var LocalS = SS.getSpreadsheetLocale();


if (LANGUAGE_BY_LOCALE[LocalS] == undefined) {
  return false;
  
}
  //Logger.log(true);
  return true;
}