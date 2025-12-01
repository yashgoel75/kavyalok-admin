import "quill/dist/quill.snow.css";

import Quill from "quill/core";

import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";

import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Underline from "quill/formats/underline";
import Header from "quill/formats/header";
import List from "quill/formats/list";
import Link from "quill/formats/link";

Quill.register({
    "modules/toolbar": Toolbar,
    "themes/snow": Snow,
    "formats/bold": Bold,
    "formats/italic": Italic,
    "formats/underline": Underline,
    "formats/header": Header,
    "formats/list": List,
    "formats/link": Link,
});

export default Quill;