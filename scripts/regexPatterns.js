export const regexPatterns = {
  //this regex checks for a title starting w a letter, matches numbers, spaces, and punctuation marks
  //it checks if ending is a letter or a punctuation mark
  title: /^[A-Za-z0-9](?:[A-Za-z0-9 ,.'’:!?&()-]*[A-Za-z0-9.!?)])?$/,

  //the regex matches author names with letters, spaces, hyphens, apostrophes, and periods.
  author: /^[A-Za-z]+(?:[ .'-]+[A-Za-z]+)*\.?$/,

  //this regex matches genres with letters with optional spaces, hyphens, comma, and apostrophes btn words
  genre: /^[A-Za-z]+(?:[ -',]+[A-Za-z]+)*$/,

  //this regex matches years from 1500 to 2026
  year: /^(?:1[5-9]\d{2}|20[0-1]\d|202[0-6])$/,

  //status limited to two options: read or unread
  status: /^(?:read|unread)$/,

  //ratings will be btn 1-5
  rating: /^[1-5]$/,

  yearPtnForDate: '(?:1[5-9]\\d{2}|20[0-1]\\d|202[0-6])',
  //this regex checks for a date in the format YYYY-MM-DD. 
  // YYYY is a four-digit year, MM is a two-digit month (01-12), and DD is a two-digit day (01-31).
  date: /^${yearPtnForDate}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,

  //this regex matches page numbers from one up to nine thousand (9999)
  page: /^[1-9]\d{0,3}$/,

  tag: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  //this regex matches tags in small letters, allows hyphens and numbers, and allows tags separated by commas. 
  tags: /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\s*,\s*[a-z0-9]+(?:-[a-z0-9]+)*)*$/,

  //this regex verifies that text is btn 6 and 500 characters without any trailing spaces
  text: /^\S.{4,498}\S$/,

  //this regex checks whether the text has a character, whether small or upper, making sure atleast one is there
  hasALetter: /^(?=.*[A-Za-z]).+$/,

  //this regex checks for duplicate words in a particular sentence being matched
  duplicateWord: /\b(\w+)\s+\1\b/i,
};
