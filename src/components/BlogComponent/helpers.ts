export function removeUnicode(string: string): string {
    if (string.indexOf("&#8217;") >= 0) {
        return removeUnicode(string.replace("&#8217;", "'"));
    } else {
        return string.replace("<p>", "").replace("[&hellip;]</p>", "...").replace("</p>", "");
    }
}