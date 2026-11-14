// Every word the lessons link to, in English, French and light Arabic.

import type { Text } from '../lessons.ts'

export const GLOSSARY: Record<string, { term: Text; def: Text }> = {
  crypto: {
    term: { en: 'Crypto', fr: 'Crypto', ar: 'العملات الرقمية (crypto)' },
    def: {
      en: 'Digital money or assets recorded on a blockchain, with no bank or state guaranteeing them.',
      fr: 'De l’argent ou des actifs numériques inscrits sur une blockchain, sans banque ni État pour les garantir.',
      ar: 'أموال أو أصول رقمية مسجلة على blockchain، لا يضمنها أي بنك ولا أي دولة.',
    },
  },
  blockchain: {
    term: { en: 'Blockchain', fr: 'Blockchain', ar: 'blockchain' },
    def: {
      en: 'A shared record copied on thousands of computers. Nobody can secretly change past lines.',
      fr: 'Un registre partagé copié sur des milliers d’ordinateurs. Personne ne peut modifier les lignes passées en douce.',
      ar: 'سجل مشترك منسوخ على آلاف الحواسيب. لا أحد يستطيع تغيير السطور القديمة في الخفاء.',
    },
  },
  bitcoin: {
    term: { en: 'Bitcoin (BTC)', fr: 'Bitcoin (BTC)', ar: 'Bitcoin (BTC)' },
    def: {
      en: 'The first crypto, running since January 2009. There will never be more than 21 million.',
      fr: 'La première crypto, en marche depuis janvier 2009. Il n’y en aura jamais plus de 21 millions.',
      ar: 'أول عملة رقمية، تعمل منذ يناير 2009. لن يتجاوز عددها أبدًا 21 مليونًا.',
    },
  },
  satoshi: {
    term: { en: 'Satoshi', fr: 'Satoshi', ar: 'satoshi' },
    def: {
      en: 'The smallest piece of a bitcoin: 0.00000001 BTC. One bitcoin is 100 million satoshis.',
      fr: 'Le plus petit morceau d’un bitcoin : 0,00000001 BTC. Un bitcoin vaut 100 millions de satoshis.',
      ar: 'أصغر جزء من الـ bitcoin: ‎0.00000001 BTC. الـ bitcoin الواحد يساوي 100 مليون satoshi.',
    },
  },
  stablecoin: {
    term: { en: 'Stablecoin', fr: 'Stablecoin', ar: 'عملة مستقرة (stablecoin)' },
    def: {
      en: 'A crypto designed to stay at a fixed price, usually 1 US dollar.',
      fr: 'Une crypto conçue pour garder un prix fixe, en général 1 dollar américain.',
      ar: 'عملة رقمية مصممة لتبقى عند سعر ثابت، عادةً 1 دولار أمريكي.',
    },
  },
  usdt: {
    term: { en: 'USDT (Tether)', fr: 'USDT (Tether)', ar: 'USDT (Tether)' },
    def: {
      en: 'The biggest stablecoin, issued by the company Tether. It aims to stay at $1.',
      fr: 'Le plus gros stablecoin, émis par la société Tether. Il vise à rester à 1 $.',
      ar: 'أكبر عملة مستقرة، تصدرها شركة Tether. تهدف إلى البقاء عند 1 دولار.',
    },
  },
  depeg: {
    term: { en: 'Depeg', fr: 'Décrochage (depeg)', ar: 'فك الارتباط (depeg)' },
    def: {
      en: 'When a stablecoin falls away from its $1 target.',
      fr: 'Quand un stablecoin s’éloigne de son objectif de 1 $.',
      ar: 'عندما تبتعد عملة مستقرة عن هدفها، أي 1 دولار.',
    },
  },
  volatility: {
    term: { en: 'Volatility', fr: 'Volatilité', ar: 'التقلب (volatility)' },
    def: {
      en: 'How much a price usually moves. Qirat shows it as “a typical day”.',
      fr: 'L’ampleur habituelle des mouvements d’un prix. Qirat l’affiche comme « une journée normale ».',
      ar: 'كم يتحرك السعر عادةً. يعرضه قيراط كـ«يوم عادي».',
    },
  },
  'risk-grade': {
    term: { en: 'Risk grade', fr: 'Note de risque', ar: 'درجة المخاطرة' },
    def: {
      en: 'Qirat’s low, medium or high: where a coin’s moves over the past 30 days rank among 18 big coins. “Low” is low for crypto, still far more than savings.',
      fr: 'Le faible, moyen ou élevé de Qirat : le rang des mouvements d’une crypto sur 30 jours parmi 18 grandes cryptos. « Faible » l’est pour une crypto, c’est toujours bien plus qu’une épargne.',
      ar: 'منخفضة أو متوسطة أو عالية في قيراط: ترتيب حركة العملة في آخر 30 يومًا بين 18 عملة كبيرة. «منخفضة» بالنسبة للعملات الرقمية، وتبقى أعلى بكثير من التوفير.',
    },
  },
  'rough-month': {
    term: { en: 'Rough month', fr: 'Mauvais mois', ar: 'الشهر الصعب' },
    def: {
      en: 'How much you could lose in a bad month, the kind that comes about once in 20 months. It comes from past moves and is not the worst case.',
      fr: 'Ce que vous pourriez perdre pendant un mauvais mois, le genre qui arrive environ une fois tous les 20 mois. Il vient des mouvements passés et ce n’est pas le pire cas.',
      ar: 'كم يمكن أن تخسر في شهر سيئ، من النوع الذي يأتي تقريبًا مرة كل 20 شهرًا. محسوب من الحركة الماضية، وليس أسوأ الاحتمالات.',
    },
  },
  liquidity: {
    term: { en: 'Liquidity', fr: 'Liquidité', ar: 'السيولة (liquidity)' },
    def: {
      en: 'How easily a coin can be bought or sold without moving its price. Small coins have little.',
      fr: 'La facilité à acheter ou vendre une crypto sans faire bouger son prix. Les petites en ont peu.',
      ar: 'مدى سهولة شراء عملة أو بيعها دون أن يتحرك سعرها. العملات الصغيرة سيولتها قليلة.',
    },
  },
  signals: {
    term: { en: 'Signals', fr: 'Signaux', ar: 'التوصيات (signals)' },
    def: {
      en: 'Paid “buy now / sell now” tips sold in groups. Often the first step of a scam.',
      fr: 'Des conseils payants « achète maintenant / vends maintenant » vendus dans des groupes. Souvent le début d’une arnaque.',
      ar: 'نصائح مدفوعة من نوع «اشترِ الآن / بِع الآن» تُباع في المجموعات. غالبًا تكون أول خطوة في احتيال.',
    },
  },
  ponzi: {
    term: { en: 'Ponzi scheme', fr: 'Chaîne de Ponzi', ar: 'مخطط Ponzi' },
    def: {
      en: 'A scheme that pays early members with newer members’ money, until it collapses.',
      fr: 'Un système qui paie les premiers membres avec l’argent des nouveaux, jusqu’à l’effondrement.',
      ar: 'مخطط يدفع للأعضاء الأوائل من أموال الأعضاء الجدد، إلى أن ينهار.',
    },
  },
  'fake-platform': {
    term: { en: 'Fake platform', fr: 'Fausse plateforme', ar: 'منصة مزيفة' },
    def: {
      en: 'A site or app that shows a fake growing balance, then blocks withdrawals or asks for “fees”.',
      fr: 'Un site ou une appli qui affiche un faux solde qui grimpe, puis bloque les retraits ou réclame des « frais ».',
      ar: 'موقع أو تطبيق يعرض رصيدًا مزيفًا يكبر، ثم يمنع السحب أو يطلب «رسومًا».',
    },
  },
  phishing: {
    term: { en: 'Phishing', fr: 'Hameçonnage (phishing)', ar: 'التصيّد (phishing)' },
    def: {
      en: 'A fake page or message that copies a real service to steal your password or keys.',
      fr: 'Une fausse page ou un faux message qui imite un vrai service pour voler votre mot de passe ou vos clés.',
      ar: 'صفحة أو رسالة مزيفة تقلّد خدمة حقيقية لتسرق كلمة المرور أو المفاتيح.',
    },
  },
  fomo: {
    term: { en: 'FOMO', fr: 'FOMO', ar: 'FOMO' },
    def: {
      en: 'Fear Of Missing Out: the urge to jump in because a price is rising and everyone is talking about it.',
      fr: 'Fear Of Missing Out : l’envie de se lancer parce qu’un prix monte et que tout le monde en parle.',
      ar: 'Fear Of Missing Out: الرغبة في الدخول لأن السعر يرتفع والجميع يتحدث عنه.',
    },
  },
  candle: {
    term: { en: 'Candle', fr: 'Bougie', ar: 'الشمعة (candle)' },
    def: {
      en: 'One bar on a price chart. On Qirat it covers one day: green closed higher than it opened, red closed lower, the thin line is the day’s high and low.',
      fr: 'Une barre sur un graphique de prix. Sur Qirat, elle couvre un jour : verte a clôturé plus haut qu’à l’ouverture, rouge plus bas, le trait fin est le plus haut et le plus bas du jour.',
      ar: 'عمود على الرسم البياني للسعر. في قيراط تمثل يومًا: الخضراء أُغلقت أعلى من الافتتاح، والحمراء أدنى، والخط الرفيع هو أعلى وأدنى سعر في اليوم.',
    },
  },
  pullback: {
    term: { en: 'Pullback', fr: 'Repli', ar: 'التراجع (pullback)' },
    def: {
      en: 'A drop in price after a rise.',
      fr: 'Une baisse du prix après une hausse.',
      ar: 'هبوط في السعر بعد صعود.',
    },
  },
  'order-book': {
    term: { en: 'Order book', fr: 'Carnet d’ordres', ar: 'دفتر الأوامر (order book)' },
    def: {
      en: 'The list of people waiting to buy below the price and to sell above it. Trades happen when someone takes one of these offers.',
      fr: 'La liste des personnes qui attendent pour acheter sous le prix et vendre au-dessus. Une transaction a lieu quand quelqu’un prend une de ces offres.',
      ar: 'قائمة الأشخاص الذين ينتظرون الشراء تحت السعر والبيع فوقه. تتمّ الصفقة عندما يأخذ أحدهم أحد هذه العروض.',
    },
  },
  'bid-ask': {
    term: { en: 'Bid and ask', fr: 'Bid et ask', ar: 'سعر الشراء والبيع (bid / ask)' },
    def: {
      en: 'Bid: the most anyone will pay right now. Ask: the least anyone will sell for. The ask is always a little higher.',
      fr: 'Bid : le plus que quelqu’un paiera maintenant. Ask : le moins pour lequel quelqu’un vendra. L’ask est toujours un peu plus haut.',
      ar: 'الـ bid: أعلى مبلغ يدفعه أحد الآن. الـ ask: أقل مبلغ يقبل أحد البيع به. الـ ask دائماً أعلى قليلاً.',
    },
  },
  spread: {
    term: { en: 'Spread', fr: 'Spread (écart)', ar: 'الفارق (spread)' },
    def: {
      en: 'The gap between the best buy and best sell price. You pay it on every trade made straight away. In Qirat’s practice wallet it is 0.05% each way.',
      fr: 'L’écart entre le meilleur prix d’achat et le meilleur prix de vente. Vous le payez à chaque opération immédiate. Dans le portefeuille d’entraînement de Qirat, il est de 0,05 % dans chaque sens.',
      ar: 'الفرق بين أفضل سعر شراء وأفضل سعر بيع. تدفعه في كل عملية فورية. في محفظة التدريب في قيراط هو 0.05% في كل اتجاه.',
    },
  },
  'market-cap': {
    term: { en: 'Market cap', fr: 'Capitalisation (market cap)', ar: 'القيمة السوقية (market cap)' },
    def: {
      en: 'Price × number of coins in circulation. It is how coins are compared in size; the price of one coin alone says little.',
      fr: 'Prix × nombre de pièces en circulation. C’est ainsi qu’on compare la taille des cryptos ; le prix d’une seule pièce dit peu de chose.',
      ar: 'السعر × عدد العملات المتداولة. بها تُقارَن أحجام العملات، أما سعر العملة الواحدة وحده فلا يقول الكثير.',
    },
  },
  'emergency-fund': {
    term: { en: 'Emergency fund', fr: 'Épargne de secours', ar: 'صندوق الطوارئ' },
    def: {
      en: 'Money set aside for sudden costs, like a repair or a doctor. It comes before any crypto.',
      fr: 'De l’argent mis de côté pour les dépenses imprévues, comme une réparation ou un médecin. Il passe avant toute crypto.',
      ar: 'مال تضعه جانباً للمصاريف المفاجئة، مثل إصلاح أو طبيب. يأتي قبل أي عملة رقمية.',
    },
  },
  drawdown: {
    term: { en: 'Drawdown', fr: 'Baisse depuis le sommet (drawdown)', ar: 'التراجع من القمّة (drawdown)' },
    def: {
      en: 'How far a value has fallen from its highest point. A 50% drawdown needs a 100% gain to come back.',
      fr: 'De combien une valeur a baissé depuis son plus haut. Une baisse de 50 % demande une hausse de 100 % pour revenir.',
      ar: 'كم نزلت القيمة عن أعلى نقطة وصلتها. تراجع 50% يحتاج ربح 100% للعودة.',
    },
  },
  wallet: {
    term: { en: 'Wallet', fr: 'Wallet (portefeuille)', ar: 'المحفظة (wallet)' },
    def: {
      en: 'Where the keys to your crypto are kept. A platform can hold them for you, or you can hold them yourself.',
      fr: 'L’endroit où sont gardées les clés de vos cryptos. Une plateforme peut les garder pour vous, ou vous pouvez les garder vous-même.',
      ar: 'المكان الذي تُحفظ فيه مفاتيح عملاتك الرقمية. يمكن أن تحفظها منصّة بدلاً منك، أو تحفظها أنت بنفسك.',
    },
  },
  'private-key': {
    term: { en: 'Private key', fr: 'Clé privée', ar: 'المفتاح السرّي (private key)' },
    def: {
      en: 'The secret code that allows coins to be moved. Whoever controls it controls the coins.',
      fr: 'Le code secret qui permet de déplacer des cryptos. Qui la contrôle contrôle les cryptos.',
      ar: 'الرمز السرّي الذي يسمح بتحريك العملات. من يتحكّم فيه يتحكّم في العملات.',
    },
  },
  'seed-phrase': {
    term: { en: 'Seed phrase', fr: 'Phrase de récupération', ar: 'كلمات الاسترجاع (seed phrase)' },
    def: {
      en: 'Usually 12 or 24 words that can rebuild your own wallet. Whoever has them has your crypto. Never share them.',
      fr: 'En général 12 ou 24 mots qui peuvent reconstruire votre wallet. Qui les a, a votre crypto. Ne les partagez jamais.',
      ar: 'عادةً 12 أو 24 كلمة تستطيع إعادة بناء محفظتك الخاصة. من يملكها يملك عملاتك. لا تشاركها أبداً.',
    },
  },
  exchange: {
    term: { en: 'Exchange', fr: 'Plateforme d’échange', ar: 'منصّة التداول (exchange)' },
    def: {
      en: 'A company where people buy and sell crypto. It usually holds the keys for its customers. Qirat does not recommend any.',
      fr: 'Une entreprise où l’on achète et vend de la crypto. Elle garde en général les clés de ses clients. Qirat n’en recommande aucune.',
      ar: 'شركة يشتري فيها الناس العملات الرقمية ويبيعونها. عادةً تحفظ المفاتيح بدلاً من عملائها. قيراط لا ينصح بأيّ منها.',
    },
  },
  'self-custody': {
    term: { en: 'Self-custody', fr: 'Auto-conservation', ar: 'الحفظ الذاتي (self-custody)' },
    def: {
      en: 'Holding your own keys instead of leaving them with a company. Full control, and nobody can reset it if you lose them.',
      fr: 'Garder soi-même ses clés au lieu de les laisser à une entreprise. Contrôle total, et personne ne peut rien réinitialiser si vous les perdez.',
      ar: 'أن تحفظ مفاتيحك بنفسك بدل تركها عند شركة. تحكّم كامل، ولا أحد يستطيع استرجاعها إذا ضاعت.',
    },
  },
  p2p: {
    term: { en: 'P2P', fr: 'P2P', ar: 'التعامل المباشر (P2P)' },
    def: {
      en: 'Buying or selling crypto directly with another person instead of with an exchange. The other side is a stranger.',
      fr: 'Acheter ou vendre de la crypto directement avec une autre personne plutôt qu’avec une plateforme. L’autre côté est un inconnu.',
      ar: 'شراء أو بيع العملات الرقمية مباشرة مع شخص آخر بدل المنصّة. الطرف الآخر شخص غريب.',
    },
  },
  escrow: {
    term: { en: 'Escrow', fr: 'Séquestre (escrow)', ar: 'الحجز (escrow)' },
    def: {
      en: 'A platform holds the crypto during a P2P deal until both sides confirm. Outside the platform, there is none.',
      fr: 'La plateforme bloque la crypto pendant un échange P2P jusqu’à ce que les deux côtés confirment. Hors de la plateforme, il n’y en a pas.',
      ar: 'المنصّة تحجز العملة خلال صفقة P2P حتى يؤكّد الطرفان. خارج المنصّة لا يوجد حجز.',
    },
  },
  bct: {
    term: { en: 'BCT', fr: 'BCT', ar: 'البنك المركزي التونسي (BCT)' },
    def: {
      en: 'Banque Centrale de Tunisie, Tunisia’s central bank. It oversees foreign-exchange rules under the 1976 law.',
      fr: 'La Banque Centrale de Tunisie. Elle veille aux règles de change prévues par la loi de 1976.',
      ar: 'البنك المركزي التونسي. يراقب قواعد الصرف بموجب قانون 1976.',
    },
  },
  'legal-tender': {
    term: { en: 'Legal tender', fr: 'Cours légal', ar: 'العملة القانونية (legal tender)' },
    def: {
      en: 'The money a country’s law recognises for payments. In Tunisia it is the dinar.',
      fr: 'La monnaie que la loi d’un pays reconnaît pour les paiements. En Tunisie, c’est le dinar.',
      ar: 'العملة التي يعترف بها قانون البلد في الدفع. في تونس هي الدينار.',
    },
  },
  'exchange-code': {
    term: { en: 'Exchange code (Tunisia)', fr: 'Code des changes (Tunisie)', ar: 'مجلّة الصرف (تونس)' },
    def: {
      en: 'Law 76-18 of 21 January 1976 on foreign currency. A new code has been drafted since 2023 but is not law as of November 2026.',
      fr: 'La loi 76-18 du 21 janvier 1976 sur les devises. Un nouveau code est en projet depuis 2023 mais n’est pas une loi en novembre 2026.',
      ar: 'القانون 76-18 المؤرّخ في 21 جانفي 1976 الخاص بالعملة الأجنبية. توجد مشاريع لمجلّة جديدة منذ 2023، لكنها ليست قانوناً إلى غاية نوفمبر 2026.',
    },
  },
  trading: {
    term: { en: 'Trading', fr: 'Trading', ar: 'التداول (trading)' },
    def: {
      en: 'Buying and selling often to catch price moves. Every trade pays costs and is a new decision.',
      fr: 'Acheter et vendre souvent pour profiter des mouvements de prix. Chaque opération paie des coûts et demande une nouvelle décision.',
      ar: 'الشراء والبيع بشكل متكرر للاستفادة من حركات السعر. كل عملية تدفع تكاليف وتتطلب قرارًا جديدًا.',
    },
  },
  holding: {
    term: { en: 'Holding (HODL)', fr: 'Garder (holding)', ar: 'الاحتفاظ (holding)' },
    def: {
      en: 'Buying a coin and keeping it for months or years without reacting to every move.',
      fr: 'Acheter une crypto et la conserver des mois ou des années sans réagir à chaque mouvement.',
      ar: 'شراء عملة والاحتفاظ بها أشهرًا أو سنوات دون التفاعل مع كل حركة.',
    },
  },
  'day-trading': {
    term: { en: 'Day trading', fr: 'Day trading', ar: 'التداول اليومي (day trading)' },
    def: {
      en: 'Opening and closing trades within the same day, often many times. Studies of real day traders found that most lose money.',
      fr: 'Ouvrir et fermer des positions dans la même journée, souvent plusieurs fois. Les études sur de vrais day traders montrent que la plupart perdent de l’argent.',
      ar: 'فتح الصفقات وإغلاقها في نفس اليوم، وغالبًا عدة مرات. الدراسات على متداولين يوميين حقيقيين وجدت أن أغلبهم يخسرون.',
    },
  },
  timeframe: {
    term: { en: 'Timeframe', fr: 'Unité de temps', ar: 'الإطار الزمني (timeframe)' },
    def: {
      en: 'How much time one candle covers: 1 minute, 1 hour, 1 day, 1 week. On Qirat, one candle is one day.',
      fr: 'La durée couverte par une bougie : 1 minute, 1 heure, 1 jour, 1 semaine. Sur Qirat, une bougie est un jour.',
      ar: 'المدة التي تغطيها الشمعة الواحدة: دقيقة أو ساعة أو يوم أو أسبوع. في قيراط، الشمعة يوم واحد.',
    },
  },
  volume: {
    term: { en: 'Volume', fr: 'Volume', ar: 'الحجم (volume)' },
    def: {
      en: 'How much of a coin was traded in a period. It shows how many took part in a move, not what comes next.',
      fr: 'La quantité d’une crypto échangée pendant une période. Il montre combien ont participé à un mouvement, pas ce qui va suivre.',
      ar: 'كمية العملة التي تم تداولها خلال فترة. يبيّن كم شخصًا شارك في الحركة، لا ما سيأتي بعدها.',
    },
  },
  fee: {
    term: { en: 'Fee', fr: 'Frais', ar: 'الرسوم (fee)' },
    def: {
      en: 'What a platform charges on each trade. Qirat’s practice wallet uses 0.1%, like Binance’s basic spot fee.',
      fr: 'Ce que prend une plateforme sur chaque opération. Le portefeuille d’entraînement de Qirat applique 0,1 %, comme les frais spot de base de Binance.',
      ar: 'ما تأخذه المنصّة على كل عملية. محفظة التدريب في قيراط تأخذ 0.1%، مثل الرسوم الأساسية للتداول الفوري في Binance.',
    },
  },
  'market-order': {
    term: { en: 'Market order', fr: 'Ordre au marché', ar: 'أمر السوق (market order)' },
    def: {
      en: 'An order to buy or sell right now at the best price available. Fast, but the price can slip.',
      fr: 'Un ordre d’achat ou de vente immédiat au meilleur prix disponible. Rapide, mais le prix peut glisser.',
      ar: 'أمر بالشراء أو البيع فورًا بأفضل سعر متوفر. سريع، لكن السعر قد ينزلق.',
    },
  },
  'limit-order': {
    term: { en: 'Limit order', fr: 'Ordre à cours limité', ar: 'الأمر المحدد السعر (limit order)' },
    def: {
      en: 'An order that fills only at your price or better. It may never fill.',
      fr: 'Un ordre qui ne s’exécute qu’à votre prix ou mieux. Il peut ne jamais s’exécuter.',
      ar: 'أمر لا يُنفَّذ إلا بسعرك أو بسعر أفضل منه، وقد لا يُنفَّذ أبدًا.',
    },
  },
  'stop-loss': {
    term: { en: 'Stop-loss', fr: 'Stop-loss', ar: 'وقف الخسارة (stop-loss)' },
    def: {
      en: 'A price chosen in advance where a sell order is sent to limit a loss. In a fast drop it can fill lower.',
      fr: 'Un prix choisi à l’avance où un ordre de vente part pour limiter une perte. Dans une chute rapide, il peut s’exécuter plus bas.',
      ar: 'سعر تختاره مسبقًا يُرسَل عنده أمر بيع للحدّ من الخسارة. في الهبوط السريع قد يُنفَّذ بسعر أقل.',
    },
  },
  'take-profit': {
    term: { en: 'Take-profit', fr: 'Take-profit', ar: 'جني الأرباح (take-profit)' },
    def: {
      en: 'A price chosen in advance, above your entry, where a sell order is sent if the coin rises.',
      fr: 'Un prix choisi à l’avance, au-dessus de votre prix d’entrée, où un ordre de vente part si la crypto monte.',
      ar: 'سعر تختاره مسبقًا فوق سعر دخولك، يُرسَل عنده أمر بيع إذا ارتفعت العملة.',
    },
  },
  slippage: {
    term: { en: 'Slippage', fr: 'Glissement (slippage)', ar: 'الانزلاق (slippage)' },
    def: {
      en: 'The gap between the price you expected and the price you got. Bigger on small coins and big orders.',
      fr: 'L’écart entre le prix attendu et le prix obtenu. Plus grand sur les petites cryptos et les gros ordres.',
      ar: 'الفرق بين السعر الذي توقعته والسعر الذي حصلت عليه. يكون أكبر في العملات الصغيرة والأوامر الكبيرة.',
    },
  },
  karat: {
    term: { en: 'Karat (24K–10K)', fr: 'Carat (24K–10K)', ar: 'القيراط (24K–10K)' },
    def: {
      en: 'Qirat’s grade for a coin, from 24K (calm and climbing) to 10K (wild or sliding). It ranks 30-day calm and the 90-day trend against 18 big coins. Never an instruction to buy or sell.',
      fr: 'La note Qirat d’une crypto, de 24K (calme et en hausse) à 10K (agitée ou en baisse). Elle classe le calme sur 30 jours et la tendance sur 90 jours face à 18 grandes cryptos. Jamais une consigne d’achat ou de vente.',
      ar: 'تقييم قيراط للعملة، من 24K (هادئة وصاعدة) إلى 10K (هائجة أو هابطة). يرتّب هدوء آخر 30 يومًا واتجاه 90 يومًا مقارنة بـ 18 عملة كبيرة. وليس أبدًا أمرًا بالشراء أو البيع.',
    },
  },
  momentum: {
    term: { en: 'Trend (momentum)', fr: 'Tendance (momentum)', ar: 'الاتجاه (momentum)' },
    def: {
      en: 'How much a price rose or fell over a period. Qirat’s karat uses about 90 days, leaving out the last week.',
      fr: 'De combien un prix a monté ou baissé sur une période. Le carat de Qirat utilise environ 90 jours, sans la dernière semaine.',
      ar: 'مقدار ارتفاع السعر أو انخفاضه خلال فترة. قيراط يستعمل حوالي 90 يومًا دون الأسبوع الأخير.',
    },
  },
  'moving-average': {
    term: { en: 'Moving average', fr: 'Moyenne mobile', ar: 'المتوسط المتحرك (moving average)' },
    def: {
      en: 'The average closing price of the last N days, such as 50 or 200. It moves slowly behind the price.',
      fr: 'Le prix de clôture moyen des N derniers jours, par exemple 50 ou 200. Elle avance lentement derrière le prix.',
      ar: 'متوسط أسعار الإغلاق في آخر عدد من الأيام، مثل 50 أو 200 يوم. يتحرك ببطء خلف السعر.',
    },
  },
  'funding-rate': {
    term: { en: 'Funding rate', fr: 'Taux de financement (funding)', ar: 'رسوم التمويل (funding)' },
    def: {
      en: 'A small payment between traders on perpetual futures, usually every 8 hours. When it is high, many traders using borrowed money have bet on a rise.',
      fr: 'Un petit paiement entre traders sur les contrats à terme perpétuels, en général toutes les 8 heures. Quand il est élevé, beaucoup de traders à levier ont parié sur une hausse.',
      ar: 'دفعة صغيرة بين المتداولين في العقود الآجلة الدائمة، عادة كل 8 ساعات. عندما تكون مرتفعة، فهذا يعني أن كثيرًا من المتداولين بأموال مقترضة راهنوا على الصعود.',
    },
  },
  'fear-greed': {
    term: { en: 'Fear & Greed index', fr: 'Indice Fear & Greed', ar: 'مؤشر Fear & Greed' },
    def: {
      en: 'A daily score from 0 (extreme fear) to 100 (extreme greed) of the mood around Bitcoin, built from price swings, trading activity, social media and web searches. In Qirat, 80 or more turns a calm market choppy.',
      fr: 'Un score quotidien de 0 (peur extrême) à 100 (avidité extrême) de l’humeur autour du Bitcoin, calculé à partir des variations de prix, de l’activité des échanges, des réseaux sociaux et des recherches en ligne. Dans Qirat, 80 ou plus fait passer un marché calme à agité.',
      ar: 'نتيجة يومية من 0 (خوف شديد) إلى 100 (طمع شديد) لمزاج الناس حول Bitcoin، محسوبة من تقلبات السعر ونشاط التداول ووسائل التواصل والبحث على الإنترنت. في قيراط، 80 أو أكثر تحوّل السوق الهادئ إلى متقلب.',
    },
  },
  'position-size': {
    term: { en: 'Position size', fr: 'Taille de position', ar: 'حجم الصفقة (position size)' },
    def: {
      en: 'How much of your wallet one trade takes, for example $200 out of $1,000.',
      fr: 'La part de votre portefeuille que prend une opération, par exemple 200 $ sur 1 000 $.',
      ar: 'الجزء الذي تأخذه صفقة واحدة من محفظتك، مثلًا 200 دولار من 1000.',
    },
  },
  concentration: {
    term: { en: 'Concentration', fr: 'Concentration', ar: 'التركّز' },
    def: {
      en: 'Having a large share of your wallet in one coin. Qirat’s habit coach notes it when one coin passes half the wallet.',
      fr: 'Avoir une grosse part du portefeuille sur une seule crypto. Le coach des habitudes de Qirat le signale quand une crypto dépasse la moitié du portefeuille.',
      ar: 'أن يكون جزء كبير من محفظتك في عملة واحدة. ينبهك مدرب العادات في قيراط عندما تتجاوز عملة واحدة نصف المحفظة.',
    },
  },
  leverage: {
    term: { en: 'Leverage', fr: 'Levier', ar: 'الرافعة المالية (leverage)' },
    def: {
      en: 'Trading with borrowed money. At x10, $100 controls a $1,000 position, and every move counts ten times, losses included.',
      fr: 'Trader avec de l’argent emprunté. À x10, 100 $ contrôlent une position de 1 000 $, et chaque mouvement compte dix fois, pertes comprises.',
      ar: 'التداول بمال مقترض. مع x10 تتحكم 100 دولار في صفقة بـ 1000 دولار، وكل حركة تُحسب 10 مرات، والخسائر أيضًا.',
    },
  },
  margin: {
    term: { en: 'Margin', fr: 'Marge', ar: 'الهامش (margin)' },
    def: {
      en: 'The money that is really yours in a leveraged trade. Losses come out of it first.',
      fr: 'L’argent qui est vraiment à vous dans une opération à levier. Les pertes sont prises dessus en premier.',
      ar: 'المال الذي هو ملكك فعلًا في صفقة بالرافعة. منه تُخصم الخسائر أولًا.',
    },
  },
  liquidation: {
    term: { en: 'Liquidation', fr: 'Liquidation', ar: 'التصفية (liquidation)' },
    def: {
      en: 'When a platform closes a leveraged position by itself because losses ate the margin. At x10 it comes a little before a 10% move.',
      fr: 'Quand une plateforme ferme d’elle-même une position à levier parce que les pertes ont mangé la marge. À x10, elle arrive un peu avant un mouvement de 10 %.',
      ar: 'عندما تغلق المنصة صفقة بالرافعة من تلقاء نفسها لأن الخسائر أكلت الهامش. مع x10 تحدث قبل حركة 10% بقليل.',
    },
  },
  futures: {
    term: { en: 'Futures', fr: 'Futures (contrats à terme)', ar: 'العقود الآجلة (futures)' },
    def: {
      en: 'Contracts that bet on a coin’s price without owning the coin. Perpetual futures have no end date and charge a funding fee every few hours.',
      fr: 'Des contrats qui parient sur le prix d’une crypto sans la posséder. Les futures perpétuels n’ont pas de date de fin et prélèvent des frais de financement toutes les quelques heures.',
      ar: 'عقود تراهن على سعر العملة دون امتلاكها. العقود الدائمة ليس لها تاريخ انتهاء وتُدفع فيها رسوم funding كل بضع ساعات.',
    },
  },
  trend: {
    term: { en: 'Trend', fr: 'Tendance', ar: 'الاتجاه (trend)' },
    def: {
      en: 'The direction of a chart: higher highs and higher lows going up, lower highs and lower lows going down.',
      fr: 'La direction d’un graphique : des sommets et des creux de plus en plus hauts à la hausse, de plus en plus bas à la baisse.',
      ar: 'اتجاه الرسم البياني: قمم وقيعان أعلى في الصعود، وقمم وقيعان أدنى في الهبوط.',
    },
  },
  'support-resistance': {
    term: { en: 'Support and resistance', fr: 'Support et résistance', ar: 'الدعم والمقاومة' },
    def: {
      en: 'Price zones where buyers (support) or sellers (resistance) reacted before. Zones, not walls: the price often goes through.',
      fr: 'Des zones de prix où des acheteurs (support) ou des vendeurs (résistance) ont réagi avant. Des zones, pas des murs : le prix les traverse souvent.',
      ar: 'مناطق سعرية تفاعل فيها المشترون (الدعم) أو البائعون (المقاومة) من قبل. مناطق وليست جدرانًا: كثيرًا ما يخترقها السعر.',
    },
  },
  rsi: {
    term: { en: 'RSI', fr: 'RSI', ar: 'مؤشر RSI' },
    def: {
      en: 'Relative Strength Index: a 0–100 score of how far and fast the price moved, usually over 14 candles. Above 70 is called “overbought”, which is not a forecast.',
      fr: 'Indice de force relative : un score de 0 à 100 qui mesure de combien et à quelle vitesse le prix a bougé, en général sur 14 bougies. Au-dessus de 70, on dit « suracheté », ce qui n’est pas une prévision.',
      ar: 'مؤشر القوة النسبية: رقم من 0 إلى 100 يقيس كم تحرك السعر وبأي سرعة، عادة على 14 شمعة. فوق 70 يسمونه «تشبع شرائي»، وهذا ليس توقعًا.',
    },
  },
  diversification: {
    term: { en: 'Diversification', fr: 'Diversification', ar: 'التنويع (diversification)' },
    def: {
      en: 'Spreading money over several coins instead of one. In crypto it helps less than it looks, because most coins fall together.',
      fr: 'Répartir l’argent sur plusieurs cryptos au lieu d’une seule. En crypto, ça aide moins qu’il n’y paraît, car la plupart baissent ensemble.',
      ar: 'توزيع المال على عدة عملات بدل عملة واحدة. في العملات الرقمية يفيد أقل مما يبدو، لأن أغلبها يهبط معًا.',
    },
  },
  correlation: {
    term: { en: 'Correlation', fr: 'Corrélation', ar: 'الارتباط (correlation)' },
    def: {
      en: 'How much two prices move together. Most crypto coins move a lot with Bitcoin.',
      fr: 'À quel point deux prix bougent ensemble. La plupart des cryptos bougent beaucoup avec le Bitcoin.',
      ar: 'مدى تحرك سعرين معًا. أغلب العملات الرقمية تتحرك كثيرًا مع Bitcoin.',
    },
  },
  dca: {
    term: { en: 'DCA', fr: 'DCA (investissement programmé)', ar: 'الشراء الدوري (DCA)' },
    def: {
      en: 'Dollar-cost averaging: buying for the same amount at regular times, whatever the price. It smooths the price you pay; it does not stop losses.',
      fr: 'Dollar-cost averaging : acheter pour le même montant à intervalles réguliers, quel que soit le prix. Il lisse le prix payé, il n’empêche pas les pertes.',
      ar: 'الشراء بالمبلغ نفسه في أوقات منتظمة مهما كان السعر. يوازن السعر الذي تدفعه، لكنه لا يمنع الخسارة.',
    },
  },
  'trading-plan': {
    term: { en: 'Trading plan', fr: 'Plan de trading', ar: 'خطة التداول' },
    def: {
      en: 'A short note written before a trade: why, entry, exits, stop and size.',
      fr: 'Une courte note écrite avant une opération : pourquoi, l’entrée, les sorties, le stop et la taille.',
      ar: 'ملاحظة قصيرة تُكتب قبل الصفقة: السبب، الدخول، الخروج، نقطة الإيقاف والحجم.',
    },
  },
  journal: {
    term: { en: 'Trading journal', fr: 'Journal de trading', ar: 'دفتر الصفقات (journal)' },
    def: {
      en: 'A record of every trade: date, coin, why, what happened and how you felt.',
      fr: 'Un relevé de chaque opération : la date, la crypto, pourquoi, ce qui s’est passé et ce que vous avez ressenti.',
      ar: 'سجل لكل صفقة: التاريخ، العملة، السبب، ماذا حدث وبماذا شعرت.',
    },
  },
  'revenge-trading': {
    term: { en: 'Revenge trading', fr: 'Trading de revanche', ar: 'التداول الانتقامي (revenge trading)' },
    def: {
      en: 'A rushed trade, often bigger than usual, to win back a loss straight away. It often turns one loss into two.',
      fr: 'Une opération précipitée, souvent plus grosse que d’habitude, pour se refaire tout de suite après une perte. Elle transforme souvent une perte en deux.',
      ar: 'صفقة متسرعة، غالبًا أكبر من المعتاد، لاسترجاع خسارة فورًا. كثيرًا ما تحوّل خسارة واحدة إلى خسارتين.',
    },
  },
}
