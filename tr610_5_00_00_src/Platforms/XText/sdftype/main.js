// 
// Main X-Text handler JavaScript must export 2 functions:
//
// Decode(Text)
//   Parses contents of X-Text file and returns some object XText which 
//   represents X-Text file in a form convenient for further processing.
//   Most likely it will be an array of objects.
//
// Encode(XText)
//   Does the opposite to Decode(): takes XText object originally returned by
//   Decode() and possibly modified by HTML files and formats it back into 
//   the text form to be written into X-Text file.
//   

//.............................................................................

function Decode(Text)
{       	
	var XText = new Array;
	var Lines = Text.split("\n");

	for (var i = 0; i < Lines.length; i++)
	{
		var j = Lines[i].indexOf("\r"); // get rid of \r
		var s = j == -1 ? Lines[i] : Lines[i].substr(0, j);
        	var Obj = ParseLine(s);
		if (Obj)
			XText.push(Obj);
	}

	return XText;
}

function ParseLine(s)
{
	var Obj = new Object;

	var j = s.indexOf("=");
	if (j == -1) 
		return; // invalid line

 	Obj.Name = s.substr(0, j);
	Obj.Description = s.substr(j + 1);

	return Obj;
}

//.............................................................................

function Encode(XText) 
{
	var Text = new String;

	for (var i = 0; i < XText.length; i++)
	{
		var s = FormatLine(XText[i]);
		Text += s;
		Text += "\r\n";
	}

	return Text;
}

function FormatLine(Obj)
{
	var s = new String;

	s = Obj.Name;
	s += "=";
	s += Obj.Description;
	
	return s;
}

//.............................................................................
