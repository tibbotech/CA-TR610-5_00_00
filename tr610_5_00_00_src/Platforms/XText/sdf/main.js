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

function ParseLine(Line)
{
	var Obj = new Object;
        var Properties = Line.split(";");
	var PropertyCount = 0;

	for (var i = 0; i < Properties.length; i++)
	{	
		var s = Properties[i];
		var j = s.indexOf("=");
		if (j == -1) 
			continue; // invalid property
		
		var Name = s.substr(0, j);
		var Value = s.substr(j + 1);

		Obj[Name] = Value;
		PropertyCount++;
	}

	if (!PropertyCount) // empty or ill-formatted line
		return null;

	var Options = Obj.O ? ParseOptions(Obj.O) : null;
	if (Options)
		Obj.Options = Options;


	return Obj;
}

function ParseOptions(s)
{
	var Options = new Array;

	var i = 0;
	for (;;)
	{
		var j = s.indexOf("/", i);
		if (j == -1) 
			break; // invalid option

		var Name = s.slice(i, j);
		
		i = j + 1;
		j = s.indexOf("/", i);
		
		var Value = j != -1 ? s.slice(i, j) : s.slice(i);

		var Option = new Object;
		Option.Name = Name
		Option.Value = Value;
		Options.push(Option);

		if (j == -1)
			break; // no more options
			
		i = j + 1;
	}

	if (!Options.length) // ill-formatted option string
		return null;

	return Options;
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
//	Obj.O = Obj.Options ? FormatOptions(Obj.Options) : null;

	var s = new String;

	for (var Property in Obj)
	{
		if (Property == "Options") // skip this property, it's already formatted into Obj.O
			continue;

		var Value = Obj[Property];

		if (!Value) // this property is empty
			continue;

		if (s.length != 0)
			s += ";";

		s += Property;
		s += "=";
		s += Value;
	}
	
	return s;
}

//.............................................................................