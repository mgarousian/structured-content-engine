/**
 * Slug generation utility
 * Converts Persian/English text to URL-safe slugs
 */

export const generateSlug = (text: string): string => {
  if (!text) return '';

  // Convert Persian characters to Latin equivalents
  const persianToEnglish: Record<string, string> = {
    'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j',
    'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r',
    'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
    'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v',
    'ه': 'h', 'ی': 'i', 'ء': '', 'ة': 'a', 'آ': 'a', 'ؤ': 'o', 'ئ': 'i',
    'ى': 'a',
  };

  let slug = text.toLowerCase();

  // Replace Persian characters with Latin equivalents
  for (const [persian, latin] of Object.entries(persianToEnglish)) {
    slug = slug.replace(new RegExp(persian, 'g'), latin);
  }

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Remove special characters except hyphens
  slug = slug.replace(/[^a-z0-9\-]/g, '');

  // Remove consecutive hyphens
  slug = slug.replace(/\-+/g, '-');

  // Remove leading/trailing hyphens
  slug = slug.replace(/^\-+|\-+$/g, '');

  return slug || 'untitled';
};
