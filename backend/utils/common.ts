/**
 * Use this to generate slug from string value
 * @param value
 * @returns
 */
export const generateSlug = (value: string) => {
  // convert to lower case
  let slug = value.toLowerCase();

  // remove special characters
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\\|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ""
  );
  // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string

  // replace spaces with dash symbols
  slug = slug.replace(/ /gi, "-");

  // remove consecutive dash symbols
  slug = slug.replace(/\-\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-/gi, "-");
  slug = slug.replace(/\-\-/gi, "-");

  // remove the unwanted dash symbols at the beginning and the end of the slug
  slug = "@" + slug + "@";
  slug = slug.replace(/\@\-|\-\@|\@/gi, "");
  return slug;
};

/**
 * Use this to get randome string of given length
 * @param len lenght of string
 * @returns
 */
export const randomStringKey = (len: number) => {
  var buf = [];
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  var charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    const randomInt = Math.floor(Math.random() * (charlen - 1 - 0 + 1)) + 0;
    buf.push(chars[randomInt]);
  }

  return buf.join("");
};
