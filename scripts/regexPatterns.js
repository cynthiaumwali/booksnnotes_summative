export const patterns = {
  title: /^[A-Za-z0-9](?:[A-Za-z0-9 ,.'’:!?&()-]*[A-Za-z0-9.!?)])?$/,

  author: /^[A-Za-z]+(?:[ .'-]+[A-Za-z]+)*\.?$/,

  genre: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,

  year: /^(?:1[5-9]\d{2}|20\d{2})$/,

  status: /^(?:read|unread)$/,

  rating: /^[1-5]$/,

  date: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,

  page: /^[1-9]\d{0,3}$/,

  tag: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  tags: /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\s*,\s*[a-z0-9]+(?:-[a-z0-9]+)*)*$/,

  text: /^\S.{4,498}\S$/,

  hasALetter: /^(?=.*[A-Za-z]).+$/,

  duplicateWord: /\b(\w+)\s+\1\b/i,
};
