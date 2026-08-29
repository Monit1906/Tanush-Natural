/**
 * TANUSH NATURAL — CANONICAL MEDIA & VIDEO RESOLVER
 * Single Source of Truth for Video & Media Resolution across Admin CMS & Public Website
 */

/**
 * Validates whether a given URL string is a valid, usable video source
 * Rejects undefined, null, empty, '[object Object]', and known dead external demo URLs
 */
export const isValidVideoSource = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined' || trimmed === '[object Object]') {
    return false;
  }
  // Filter out expired / dead 403 third-party mixkit demo URLs
  if (trimmed.includes('mixkit.co')) {
    return false;
  }
  return true;
};

/**
 * Determines MIME type from URL or filename
 */
export const getVideoMimeType = (url = '', fallback = 'video/mp4') => {
  if (!url || typeof url !== 'string') return fallback;
  const lower = url.toLowerCase().split('?')[0];
  if (lower.endsWith('.mov')) return 'video/quicktime';
  if (lower.endsWith('.webm')) return 'video/webm';
  if (lower.endsWith('.m4v') || lower.endsWith('.mp4')) return 'video/mp4';
  if (lower.endsWith('.ogg') || lower.endsWith('.ogv')) return 'video/ogg';
  return fallback;
};

/**
 * Differentiates whether an asset is a video vs image
 */
export const isMediaVideo = (item) => {
  if (!item) return false;
  const url = typeof item === 'string' ? item : (item.url || '');
  const name = typeof item === 'object' ? (item.name || '') : '';
  const category = typeof item === 'object' ? (item.category || '') : '';
  const mimeType = typeof item === 'object' ? (item.mime_type || item.mimeType || '') : '';

  if (category === 'Videos') return true;
  if (mimeType.startsWith('video/')) return true;
  if (url.startsWith('data:video/')) return true;

  const lowerUrl = url.toLowerCase().split('?')[0];
  const lowerName = name.toLowerCase();

  return (
    lowerUrl.endsWith('.mp4') ||
    lowerUrl.endsWith('.mov') ||
    lowerUrl.endsWith('.webm') ||
    lowerUrl.endsWith('.m4v') ||
    lowerName.endsWith('.mp4') ||
    lowerName.endsWith('.mov') ||
    lowerName.endsWith('.webm') ||
    lowerName.endsWith('.m4v')
  );
};

/**
 * Resolves the canonical video URL for a Reel / Story record
 * Searches story fields, referenced media ID, and media library registry
 */
export const resolveReelVideoUrl = (story, mediaList = []) => {
  if (!story) return '';

  // 1. Direct video URL in story record
  const directUrl = story.video_url || story.videoUrl || story.video || story.media_url || story.mediaUrl;
  if (isValidVideoSource(directUrl)) {
    return directUrl.trim();
  }

  // 2. Lookup via media_id
  const mediaId = story.media_id || story.mediaId;
  if (mediaId && Array.isArray(mediaList) && mediaList.length > 0) {
    const matchedMedia = mediaList.find(m => String(m.id) === String(mediaId));
    if (matchedMedia && isValidVideoSource(matchedMedia.url)) {
      return matchedMedia.url.trim();
    }
  }

  // 3. Fallback match in media library by title/name if video_url was blank
  if (story.title && Array.isArray(mediaList) && mediaList.length > 0) {
    const titleMatch = mediaList.find(m => 
      isMediaVideo(m) && 
      (m.name?.toLowerCase() === story.title?.toLowerCase() ||
       story.title?.toLowerCase().includes(m.name?.toLowerCase()))
    );
    if (titleMatch && isValidVideoSource(titleMatch.url)) {
      return titleMatch.url.trim();
    }
  }

  return '';
};
