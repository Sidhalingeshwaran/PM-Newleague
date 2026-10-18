//@ts-check

/**
 * Standalone Next.js config.
 *
 * The original apps/pm-player-portal/next.config.js wraps the config with
 * Nx (`withNx` from @nx/next) and allows remote images from PlayMatches CDNs.
 * Neither is needed here: there is no Nx workspace and the league pages only
 * use local images from /public/newleague/images.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {};

module.exports = nextConfig;
