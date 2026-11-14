// App screenshots for the site: node _src/shots.mjs
// The pictures come from zentra-web's own browser tests (npm run test:e2e there), which play the
// real app against a fake server with sample players (Ada Obi, Olushola, Waheed...), so no real
// account or money is shown. This copies the chosen ones into media/app/ as small WebP files,
// cropped where a full screen would show test-only text, and writes media/app/sizes.json for
// build.mjs. Uses the image library already installed in zentra-backend-server (set SHARP to
// another copy of sharp if that folder isn't next to this one).
//
// Left out on purpose: queue screens (the tests use a ₦100 stake; the real queue is ₦200/₦500),
// winning screens with amounts that don't match the 10% fee, watching screens that say
// "30s behind" (there's no delay in the real app), the terms screen (still marked draft in the
// app), and the welcome screen.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = process.env.SHOTS ?? join(ROOT, '..', 'zentra-web', 'tests', 'e2e', 'output');
const OUT = join(ROOT, 'media', 'app');
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP ?? join(ROOT, '..', 'zentra-backend-server', 'node_modules', 'sharp'));

// name on the site: [test screenshot, crop height in source pixels (720 wide) or null for the whole screen]
const SHOTS = {
  'home': ['15-home', 975],
  'home-cards': ['15-home', 700],
  'notifications': ['16-home-feed', null],
  'signup-phone': ['7-signup-phone', null],
  'signup-games': ['9-signup-games', null],
  'signup-done': ['11-signup-done', null],
  'login': ['2-login', null],
  'otp': ['5-otp', null],
  'forgot-pin': ['13-forgot-reset', null],

  'chess-turn': ['52-chess-opponent-moved', null],
  'chess-check': ['60-chess-check', null],
  'chess-premoves': ['54b-chess-premoves', null],
  'chess-checkmate': ['63-chess-checkmate', null],
  'chess-settings': ['54c-chess-settings', null],
  'whot-turn': ['82-whot-your-turn', null],
  'whot-pick-two': ['85-whot-pick-two', null],
  'whot-shape': ['86-whot-shape-picker', null],
  'whot-request': ['87-whot-request', null],
  'whot-star': ['89b-whot-star-finish', null],
  'whot-won': ['89-whot-won', null],
  'whot-settings': ['82b-whot-settings-grid', null],
  'lie-claim': ['lie-01-claim-picker', null],
  'lie-check': ['lie-02-check-offered', null],
  'lie-caught': ['lie-03-caught', null],
  'lie-last-card': ['lie-04-last-card', null],
  'ludo-roll': ['71-ludo-your-roll', null],
  'ludo-move': ['73-ludo-token-marked', null],
  'ludo-capture': ['75-ludo-capture', null],
  'ludo-won': ['76-ludo-won', null],
  'ludo-settings': ['71b-ludo-settings-grid', null],
  'pool-shot': ['91-pool-your-shot', null],
  'pool-aim': ['92-pool-aimed', null],
  'pool-ball-in-hand': ['96-pool-ball-in-hand', null],
  'pool-groups': ['97-pool-groups', null],
  'pool-settings': ['97b-pool-settings-grid', null],
  'computer-profile': ['23c-profile-computer', null],

  'match-detail': ['19-detail-owner', null],
  'match-join': ['20-detail-joiner', null],
  'load-match': ['22-load-match', null],
  'create-type': ['25-create-type', null],
  'create-stake': ['26-create-stake', null],
  'create-review': ['27-create-review', null],
  'create-done': ['29-create-done', null],
  'tournament-room': ['42-room-tournament', null],
  'tournament-final': ['46-room-results', null],
  'tournament-done': ['69e-finished-room', null],
  'matchup-length': ['29b-create-matchup-games', null],
  'matchup-room': ['58b-matchup-room', null],
  'matchup-game-won': ['58c-matchup-game-won', null],
  'matchup-series-won': ['58d-matchup-series-won', null],
  'resign': ['57-chess-resign', null],
  'game-lost': ['58-chess-lost', null],
  'rematch': ['89d-rematch-prompt', null],
  'chat-banner': ['e18-match-chat-banner', null],
  'chat-window': ['e19-match-chat-window', null],

  'wallet': ['w05-wallet', null],
  'wallet-new-pin': ['w03-new-wallet-pin', null],
  'wallet-list': ['w07-wallet-list', null],
  'wallet-transaction': ['w06-transaction', null],
  'wallet-details': ['w08-details', null],
  'deposit-amount': ['w09-deposit', null],
  'deposit-account': ['w10-deposit-account', null],
  'dedicated-account': ['w11-dedicated-account', null],
  'withdraw-amount': ['w12-withdraw-amount', null],
  'withdraw-bank': ['w14-withdraw-bank', null],
  'withdraw-pin': ['w15-withdraw-pin', null],
  'withdraw-sent': ['w18-withdraw-sent', null],
  'kyc-bvn': ['m05-kyc-bvn', null],
  'kyc-bank': ['m06-kyc-bank', null],
  'kyc-submitted': ['m08-kyc-submitted', null],

  'club': ['e12-club-league', null],
  'club-trophies': ['e15-club-trophies', null],
  'club-game-start': ['e11-room-before-start', null],
  'club-matchup': ['e10-club-matchup', null],
  'fixture-lineup': ['e13-fixture-lineup', null],
  'fixture-boards': ['e14-fixture-boards', null],
  'league-tables': ['e16-league-tables', null],
  'watching': ['93-watching-lie', null],
  'watching-gift': ['94-watching-lie-check', null],
  'friends-playing': ['90-home-friends-playing', 320],
  'profile': ['23-profile', null],
  'profile-starred': ['62a-profile-starred', null],
  'followers': ['62b-profile-followers', null],
  'rating-board': ['e02b-elo-board', null],
  'menu': ['m01-menu', null],

  'review-summary': ['64b-review-chess-summary-page', null],
  'review-chess': ['66-review-chess-blunder', null],
  'review-whot': ['67-review-whot', null],
  'review-lie': ['67i-review-lie-bluff', null],
  'review-ludo': ['68-review-ludo', null],
  'review-pool': ['69b-review-pool-better', null],
  'achievement': ['23c-achievement-detail', null],
  'achievements': ['23d-profile-achievements', null],
  'achievement-unlocked': ['24c-achievement-unlocked', null],

  'limits': ['rg1-limits', null],
  'break': ['rg2-break', null],
  'reality-check': ['rg4-reality-check', null],
  'blocked': ['rg5-blocked-profile', null],
  'support-new': ['16s-support-new', null],
  'support-thread': ['16t-support-thread', null],
};

mkdirSync(OUT, { recursive: true });
const sizes = {};
for (const [name, [file, cropHeight]] of Object.entries(SHOTS)) {
  const src = join(SOURCE, `${file}.png`);
  if (!existsSync(src)) throw new Error(`No test screenshot ${src}: run npm run test:e2e in zentra-web`);
  let img = sharp(src);
  const meta = await img.metadata();
  if (cropHeight) img = img.extract({ left: 0, top: 0, width: meta.width, height: Math.min(cropHeight, meta.height) });
  const width = 540;
  const height = Math.round((cropHeight ? Math.min(cropHeight, meta.height) : meta.height) * (width / meta.width));
  await img.resize(width).webp({ quality: 80 }).toFile(join(OUT, `${name}.webp`));
  sizes[name] = [width, height];
}
writeFileSync(join(OUT, 'sizes.json'), JSON.stringify(sizes, null, 1) + '\n');
console.log(`Wrote ${Object.keys(sizes).length} screenshots to media/app/.`);
