// The whole site in one list: every page's address, title, description and place in the menu.
// build.mjs reads the body of each page from _src/pages/<path>.html and wraps it in the layout
// below. GitHub Pages ignores folders that start with "_", so none of this is published.

export const SITE = 'https://zenn.com.ng';
export const APP = 'https://zentra.com.ng';
export const EMAIL = 'zenn.games.official@gmail.com';

// Sections, in menu order. Each page: [path, menu label, <title>, meta description, options]
// options.money: a real-money page, which ends with the 18+ / play responsibly note
export const SECTIONS = [
  { id: 'start', name: 'Start', pages: [
    ['/', 'Home', 'Zentra: skill games for real stakes', 'Play Chess, Whot, Lie, Ludo and Pool against real people for real money, in your browser. 18+, Nigeria only.', { money: true }],
    ['/zentra/', 'What is Zentra', 'What is Zentra?', 'Zentra is a Nigerian platform for playing skill games against real people, with a stake on each match. What it is, who runs it and how it makes money.', { money: true }],
    ['/start/', 'Getting started', 'Getting started on Zentra', 'Create an account, set your PIN, add money and play your first match, step by step.', { money: true }],
    ['/play/', 'Play now', 'Play Zentra in your browser', 'Zentra runs in your phone or computer browser at zentra.com.ng. What you need before you sign up.', { money: true }],
  ] },
  { id: 'games', name: 'Games', pages: [
    ['/games/', 'All games', 'The five Zentra games', 'Chess, Whot, Lie, Ludo and Pool on Zentra: how long each takes, what decides a win and where to learn the rules.'],
    ['/games/chess/', 'Chess', 'Chess on Zentra: rules and clocks', 'How chess works on Zentra: the 15-minute clock, how a game ends, and why a draw goes to the player with more time left.'],
    ['/games/chess/tips/', 'Chess tips', 'Chess tips for Zentra', 'Practical chess advice for 15-minute games: openings, safety checks, using your clock and finishing won games.'],
    ['/games/whot/', 'Whot', 'Whot on Zentra: rules and special cards', 'The Whot rules Zentra uses: 6 cards each, matching shape or number, and what Hold On, Pick Two, Pick Three, Suspension, General Market and Whot do.'],
    ['/games/whot/tips/', 'Whot tips', 'Whot tips for Zentra', 'How to win more Whot games: keeping counters, timing your special cards, counting what has been played and calling the right shape.'],
    ['/games/lie/', 'Lie', 'Lie on Zentra: rules', 'Lie is Zentra\'s own bluffing card game. Play cards face down, claim what they are, and check your opponent when you think they are lying.'],
    ['/games/lie/tips/', 'Lie tips', 'Lie tips for Zentra', 'When to bluff, when to tell the truth and when to check in Lie, Zentra\'s bluffing card game.'],
    ['/games/ludo/', 'Ludo', 'Ludo on Zentra: rules', 'The Ludo rules Zentra uses: two colours each, two dice, a 6 to come out, captures and how to win.'],
    ['/games/ludo/tips/', 'Ludo tips', 'Ludo tips for Zentra', 'How to play your dice well in Ludo: using each die or the total, when to capture, and keeping tokens safe.'],
    ['/games/pool/', 'Pool', 'Pool on Zentra: 8-ball rules', 'The 8-ball rules Zentra uses: the break, the open table, fouls, ball in hand and how the 8-ball wins or loses a game.'],
    ['/games/pool/tips/', 'Pool tips', 'Pool tips for Zentra', 'How to win more 8-ball games on Zentra: position play, safeties, planning a run-out and avoiding fouls.'],
    ['/computer-players/', 'Computer players', 'Computer players on Zentra', 'When you might play a computer player on Zentra, how strong it is, how it is labelled and what happens to your stake.', { money: true }],
    ['/games/settings/', 'Game settings', 'Game settings on Zentra', 'The settings in each Zentra game: boards, pieces, card colours, cues, sounds and play helpers. None of them gives anyone an edge.'],
  ] },
  { id: 'matches', name: 'Matches', pages: [
    ['/matches/', 'How matches work', 'How matches work on Zentra', 'The kinds of match on Zentra, how stakes are held and paid, and when each kind of match starts.', { money: true }],
    ['/matches/quick-match/', 'Quick Match', 'Quick Match on Zentra', 'Join the queue at ₦200 or ₦500 and get paired with another player, or join a tournament of four.', { money: true }],
    ['/matches/create/', 'Create or join a match', 'Create or join a match on Zentra', 'Set up a challenge, tournament or match-up: pick the game, the stake and who can join. Or join one with a match code.', { money: true }],
    ['/matches/long-clock/', '24-hour matches', '24-hour matches on Zentra', 'Matches you create give each player 24 hours on their clock, so nobody has to be online at the same time.', { money: true }],
    ['/tournaments/', 'Tournaments', 'Tournaments on Zentra', 'Tournaments of 4 to 256 players on Zentra: brackets, stakes, the pot and the winner\'s prize.', { money: true }],
    ['/match-ups/', 'Match-ups', 'Match-ups: best-of series on Zentra', 'A match-up is a best-of-3 to best-of-11 series between two players for one stake of at least ₦2,000.', { money: true }],
    ['/matches/clocks/', 'Clocks, resigning and rematches', 'Clocks, resigning and rematches', 'What happens when your clock runs out, when you resign, when a match never starts, and how to ask for a rematch.', { money: true }],
    ['/matches/chat/', 'Match chat', 'Match chat on Zentra', 'Chat with your opponent during a match: who can chat, what is filtered out, and how to mute or report someone.'],
  ] },
  { id: 'money', name: 'Money', pages: [
    ['/fees/', 'Stakes and fees', 'Stakes and fees on Zentra', 'Zentra keeps 10% of what is staked in each match. Worked examples, the gift fee, the club fee and when you get a refund.', { money: true }],
    ['/wallet/', 'Your wallet', 'Your Zentra wallet', 'How your Zentra wallet works: balances, more than one wallet, wallet PINs and your activity.', { money: true }],
    ['/wallet/deposits/', 'Deposits', 'Adding money to Zentra', 'Add money by bank transfer through Paystack, or set up a permanent Zentra account number. Deposit limits and held deposits explained.', { money: true }],
    ['/wallet/withdrawals/', 'Withdrawals', 'Withdrawing from Zentra', 'Withdraw to your own bank account up to 3 times a day: ₦100 to ₦30,000 each time and ₦50,000 a day.', { money: true }],
    ['/wallet/verification/', 'Verifying your identity', 'Verifying your identity on Zentra', 'What identity verification unlocks on Zentra, what you need for it and how long it takes.', { money: true }],
    ['/security/', 'Account security', 'Keeping your Zentra account safe', 'Your sign-in PIN, wallet PINs, one-time codes and what Zentra will never ask you for.'],
  ] },
  { id: 'community', name: 'Clubs and watching', pages: [
    ['/clubs/', 'Clubs', 'Clubs on Zentra', 'Start or join a club for your game: members, roles, invite links and requests.'],
    ['/clubs/games/', 'Club chat and games', 'Club chat and club games', 'Chat with your club and play club challenges and tournaments that start at a set time.', { money: true }],
    ['/clubs/leagues/', 'Club leagues', 'Club leagues on Zentra', 'Clubs play each other in divisions: seasons, fixtures of five boards, points, promotion and trophies.', { money: true }],
    ['/watch/', 'Watching live', 'Watching live matches on Zentra', 'Watch live games on Zentra, send reactions, follow a match-up, and choose who can watch your own games.'],
    ['/watch/gifts/', 'Gifts', 'Gifts to players on Zentra', 'Watchers can send a player a gift of ₦100, ₦500, ₦1,000 or ₦5,000. The player gets 90% straight away.', { money: true }],
    ['/community/', 'Profiles and following', 'Profiles, following and leaderboards', 'Your Zentra profile, following players, starring games, Explore and the leaderboards.'],
  ] },
  { id: 'skill', name: 'Skill and fairness', pages: [
    ['/ratings/', 'Ratings', 'Ratings on Zentra', 'Every player has a rating for each game. How it starts, how it moves and how it is used to pair players.'],
    ['/reviews/', 'Game reviews', 'Game reviews on Zentra', 'Look back at any game you played: every move labelled from brilliant to blunder, your accuracy and coach notes.'],
    ['/achievements/', 'Achievements', 'Achievements on Zentra', 'Badges for first wins, streaks, rating milestones, great moves and rare moments. None of them rewards spending or playing more.'],
    ['/fair-play/', 'Fair play', 'Fair play on Zentra', 'What is not allowed on Zentra, how games are reviewed for cheating, and what happens when someone breaks the rules.', { money: true }],
  ] },
  { id: 'safety', name: 'Safety and help', pages: [
    ['/responsible-gambling/', 'Play responsibly', 'Play responsibly', 'Zentra is a game with real money in it. Tips for keeping it a game, signs it is becoming a problem, and free help in Nigeria.', { money: true }],
    ['/responsible-gambling/tools/', 'Limits, breaks and self-exclusion', 'Limits, breaks and self-exclusion', 'Deposit limits, breaks of 24 hours to 30 days, self-exclusion for 6 months, 1 year or 5 years, and reality checks.', { money: true }],
    ['/safety/', 'Blocking and reporting', 'Blocking and reporting on Zentra', 'What blocking someone does on Zentra, and how to report a chat message or a player.'],
    ['/support/', 'Support and disputes', 'Support and disputes', 'How to raise a problem with a match or anything else, and how Zentra answers.'],
    ['/faq/', 'FAQ', 'Zentra FAQ', 'Short answers to common questions about Zentra: money, matches, computer players, safety and accounts.', { money: true }],
  ] },
  { id: 'company', name: 'Company', pages: [
    ['/promoters/', 'Promoters', 'Zentra promoters and referral links', 'Promoters share a Zentra link and earn a share of Zentra\'s fee on games played by the people they bring. How it works.'],
    ['/about/', 'About Zenn', 'About Zenn Interactive Limited', 'Zenn Interactive Limited is a Lagos company that builds and runs Zentra.'],
    ['/updates/', 'Updates', 'Zentra updates', 'What has changed on Zentra, month by month.'],
    ['/contact/', 'Contact', 'Contact Zenn', 'How to reach Zenn Interactive Limited: email, social media and in-app support.'],
    ['/terms/', 'Terms of Service', 'Zentra Terms of Service', 'The Terms of Service for Zentra, run by Zenn Interactive Limited.'],
    ['/privacy/', 'Privacy', 'Zentra Privacy Policy', 'What Zentra collects about you, why, who it is shared with, how long it is kept and your rights.'],
    ['/brand/', 'Brand', 'Zentra brand', 'The Zentra logo and colours, and how to use them.'],
  ] },
];

export const NOT_FOUND = ['/404.html', 'Page not found', 'Page not found', 'This page does not exist.'];

// the main menu: a few top entries, each opening a section page
export const MENU = [
  ['Games', '/games/'],
  ['Matches', '/matches/'],
  ['Money', '/fees/'],
  ['Clubs', '/clubs/'],
  ['Help', '/faq/'],
];

export const allPages = () => SECTIONS.flatMap((s) => s.pages.map(([path, label, title, description, opts = {}]) => ({ path, label, title, description, section: s, ...opts })));

// a page's file name: '/games/chess/' → 'games/chess', '/' → 'index'; and its share image's name
export const slugOf = (path) => path === '/' ? 'index' : path === '/404.html' ? '404' : path.replace(/^\/|\/$/g, '');
export const ogName = (path) => slugOf(path).replace(/\//g, '-');
