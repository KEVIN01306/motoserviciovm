import { promises as fs } from 'fs';
import path from 'path';

/**
 * Delete an image file from a directory.
 * @param {string} directoryOrPath - Either a full path to the file (absolute or relative),
 *                                    or a directory when `filename` is provided.
 * @param {string} [filename] - Optional file name relative to `directory`.
 * @returns {Promise<boolean>} - Resolves `true` if file was deleted, `false` if file did not exist.
 * @throws {Error} - Re-throws unexpected filesystem errors.
 */
export async function deleteImage(directoryOrPath, filename) {
  // Accept either: (fullPath) OR (directory, filename)
  // If the caller provides a single arg (the path), `directoryOrPath` must be present.
  if (!directoryOrPath) return false;

  let fullPath = '';
  if (typeof filename === 'undefined' || filename === null) {
    // Caller passed a single path (absolute or relative)
    fullPath = directoryOrPath;
  } else {
    // Caller passed directory + filename
    fullPath = path.isAbsolute(filename) ? filename : path.join(directoryOrPath || '', filename);
  }

  // Resolve to normalized absolute path for safety
  try {
    // If the path looks like a web path served from `public` (e.g. `/uploads/motos/x.jpg`), map it
    // to the project's `public` folder. Otherwise resolve normally.
    if (typeof fullPath === 'string' && fullPath.replace(/^\\+|^\/+/, '').startsWith('uploads' + path.sep) === false) {
      // This conditional tries to avoid treating POSIX-leading-slash paths as absolute Windows paths.
    }

    // Accept both "/uploads/..." and "uploads/..." (with or without leading slash)
    if (typeof fullPath === 'string' && (/^[/\\]*uploads[/\\]/).test(fullPath)) {
      // strip leading slashes and map to public/uploads
      const withoutLeading = fullPath.replace(/^[/\\]+/, '');
      fullPath = path.join(process.cwd(), 'public', withoutLeading);
    } else {
      fullPath = path.resolve(fullPath);
    }
  } catch (err) {
    // If path.resolve fails for any reason, fallback to raw
  }

  try {
    await fs.unlink(fullPath);
    return true;
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTFOUND')) return false;
    throw err;
  }
}

export default { deleteImage };
