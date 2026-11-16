# Time machine: the Darija lines to check before it goes live

Written Mon 16 Nov 2026 for Abdelkerim. The Time machine is built and committed on `claude/candle-lesson`. It is **not live**. These are all 71 lines of its Arabic text, each next to its English meaning. Nobody who speaks Darija has read them yet.

**What I need from you:** read the right-hand column once (about 10 minutes). Tell me the line number and the word you would say instead. Nothing else is needed.

Each line is copied from the app's own file (`frontend/src/lib/i18n-replay.ts`), so what you read here is exactly what a visitor will see. Words in curly brackets, like `{n}`, are filled in by the app with a number or a name.

## The words I am least sure of

| Line | Word | What I meant | My doubt |
|---|---|---|---|
| 1, 4 | آلة الزمن | Time machine | Standard Arabic. A Tunisian may say it in French |
| 7 | الرحلة | Trip (one game) | Could sound like a holiday |
| 37 | قدّم 5 أيّام | Move 5 days forward | The verb |
| 39 | وفاو | Are over | Spelling, and whether it fits 30 days |
| 6, 8 | مخبّيين | Hidden | Plural form |
| 47 | الكونكسيون | Your connection | French word in Arabic letters |
| 54 | الحرفاء, منصّات, تضاعف | Customers, exchanges, doubled | Standard Arabic words inside a Darija sentence |
| 69 | تنجّم تغلبني؟ | Can you beat me? | Tone: it should sound like a friendly dare |

The four habit notes (lines 62 to 65) follow the wording already live on the practice wallet, with the day number added in front.

## Every line

### The card on the Practice screen

| # | English | Darija in the app |
|---|---|---|
| 1 | Time machine | آلة الزمن |
| 2 | At live prices, little moves in a day. Here you play a real month of the past in 4 minutes, with 1000 pretend dollars. | بالسوم الحيّ، في نهار ما يتبدّل كان شويّة. هنا تلعب شهر حقيقي من الماضي في 4 دقايق، بـ 1000 دولار تجريبية. |
| 3 | Try the Time machine | جرّب آلة الزمن |

### Choosing a trip

| # | English | Darija in the app |
|---|---|---|
| 4 | Time machine | آلة الزمن |
| 5 | Simulation | تجربة |
| 6 | Play 30 real days from the past in about 4 minutes, with 1000 pretend dollars. The coins’ names and the dates stay hidden until the end. | العب 30 نهار حقيقيّين من الماضي في 4 دقايق تقريب، بـ 1000 دولار تجريبية. أسامي الـ coins والتواريخ مخبّيين حتى للآخر. |
| 7 | Trip {n} | الرحلة {n} |
| 8 | 30 days · 4 hidden coins | 30 نهار · 4 coins مخبّيين |
| 9 | Start | ابدا |
| 10 | Continue (day {d} of {n}) | كمّل (نهار {d} من {n}) |
| 11 | Play again | عاود العب |
| 12 | Your last result: {you}. Holding Bitcoin: {hold}. | آخر نتيجة ليك: {you}. كان خلّيت Bitcoin: {hold}. |
| 13 | How it works | كيفاش تخدم |
| 14 | Each tap on “Next day” moves one real day forward. | كل ضغطة على «النهار الجاي» تقدّم نهار حقيقي. |
| 15 | You buy and sell at that day’s price, with the same fee and spread as the practice wallet. | تشري وتبيع بسوم النهار هذاكا، بنفس الـ frais والـ spread متاع الـ wallet التجريبي. |
| 16 | Every price starts from 100, so nobody can recognise the coins. | السوامات الكل يبداو من 100، باش حتى حد ما يعرف الـ coins. |
| 17 | Pretend money, real prices from the past. The past says nothing about what comes next. Nothing here is advice. | فلوس تجريبية، وسوامات حقيقية من الماضي. الماضي ما يقول شي على اللي جاي. حتى حاجة هنا موش نصيحة. |
| 18 | Back to the practice wallet | ارجع للـ wallet التجريبي |

### Playing

| # | English | Darija in the app |
|---|---|---|
| 19 | Day {d} of {n} | نهار {d} من {n} |
| 20 | Leave | اخرج |
| 21 | Your wallet | الـ wallet متاعك |
| 22 | Cash | كاش |
| 23 | since the start | من البداية |
| 24 | Coin {k} | Coin {k} |
| 25 | today | اليوم |
| 26 | You hold {v} | عندك {v} |
| 27 | The lines stop at today. The rest of the month is still hidden. | الخطوط يوقفو في اليوم. باقي الشهر مازال مخبّي. |
| 28 | Tap a coin to buy or sell it. Or go to the next day. | اضغط على coin باش تشريها ولا تبيعها. ولا تعدّى للنهار الجاي. |
| 29 | Buy with part of your cash | اشري بجزء من الكاش متاعك |
| 30 | Sell what you hold | بيع اللي عندك |
| 31 | Half | النصّ |
| 32 | All | الكل |
| 33 | No cash left to buy with. | ما عادش عندك كاش باش تشري. |
| 34 | Bought {qty} of Coin {k} at {price}. Fee and spread: {cost}. | شريت {qty} من Coin {k} بسوم {price}. الـ frais والـ spread: {cost}. |
| 35 | Sold {qty} of Coin {k} at {price}. Fee and spread: {cost}. | بعت {qty} من Coin {k} بسوم {price}. الـ frais والـ spread: {cost}. |
| 36 | Next day | النهار الجاي |
| 37 | +5 days | قدّم 5 أيّام |
| 38 | See my result | شوف النتيجة متاعي |

### The result

| # | English | Darija in the app |
|---|---|---|
| 39 | Your 30 days are over | 30 نهار متاعك وفاو |
| 40 | You ended with | كمّلت بـ |
| 41 | Simply holding Bitcoin | كان خلّيت Bitcoin برك |
| 42 | Doing nothing (all cash) | كان ما عملت شي (الكل كاش) |
| 43 | You ended {v} below simply holding Bitcoin. | كمّلت بـ {v} أقل من اللي خلّى Bitcoin برك. |
| 44 | You ended {v} above simply holding Bitcoin. | كمّلت بـ {v} أكثر من اللي خلّى Bitcoin برك. |
| 45 | This is one month. In another month the same choices can give the opposite result. | هذا شهر واحد. في شهر آخر، نفس الاختيارات تنجّم تعطي العكس. |
| 46 | Counting your result… | نحسبو في النتيجة متاعك… |
| 47 | Could not load the names and the Bitcoin line. Check your connection. | ما نجّمناش نجيبو الأسامي وخطّ الـ Bitcoin. شوف الكونكسيون متاعك. |
| 48 | Try again | عاود |
| 49 | You | إنت |
| 50 | Holding Bitcoin | كان خلّيت Bitcoin |
| 51 | Start: 1000 | البداية: 1000 |

### The reveal

| # | English | Darija in the app |
|---|---|---|
| 52 | What it was | شنوّة كان |
| 53 | From {from} to {to} | من {from} لـ {to} |
| 54 | FTX, one of the largest crypto exchanges in the world, collapsed in a few days in November 2022. Its customers could no longer withdraw their money, and prices fell across the market. About ten days earlier, Dogecoin had doubled in a few days when Elon Musk bought Twitter. | FTX، وحدة من أكبر منصّات الـ crypto في العالم، طاحت في أيّامات في نوفمبر 2022. الحرفاء متاعها ما عادش نجّمو يسحبو فلوسهم، والسوامات طاحت في السوق الكل. عشرة أيّام قبل تقريب، الـ Dogecoin تضاعف في أيّامات وقت اللي Elon Musk شرى Twitter. |
| 55 | After the United States election of 5 November 2024, almost the whole crypto market rose for a month, and Bitcoin came close to 100,000 dollars for the first time. | بعد الانتخابات الأمريكية نهار 5 نوفمبر 2024، سوق الـ crypto تقريب الكل طلع شهر كامل، والـ Bitcoin قرّب لـ 100000 دولار لأوّل مرّة. |
| 56 | What each coin was, and how its price moved in the 30 days: | كل coin شنوّة كانت، وقدّاش تبدّل السوم متاعها في 30 نهار: |
| 57 | Coin {k} was {name}: {pct} | Coin {k} كانت {name}: {pct} |

### What you did

| # | English | Darija in the app |
|---|---|---|
| 58 | What you did | شنوّة عملت |
| 59 | You made {n} trades. Fees and spread took {cost}. | عملت {n} عمليات. الـ frais والـ spread خذاو {cost}. |
| 60 | You made 1 trade. Fee and spread took {cost}. | عملت عملية وحدة. الـ frais والـ spread خذاو {cost}. |
| 61 | You made no trade: your 1000 dollars stayed in cash. | ما عملت حتى عملية: الـ 1000 دولار متاعك قعدو كاش. |
| 62 | Day {day}: you bought {name} after it had risen {pct}% in 7 days. Buying after a big run-up is the classic FOMO pattern. | نهار {day}: شريت {name} بعد ما طلعت {pct}% في 7 أيّام. الشراية بعد طلعة كبيرة هي الـ FOMO الكلاسيكي. |
| 63 | Day {day}: you sold {name} on the day it fell {pct}%. Selling during a sharp drop is the common panic pattern. | نهار {day}: بعت {name} في النهار اللي طاحت فيه {pct}%. البيع وقت طيحة قويّة هو البيع بالخوف المعروف. |
| 64 | Day {day}: {name} became {pct}% of your wallet. With more than half in one coin, its every move becomes your wallet’s move. | نهار {day}: {name} ولّات {pct}% من الـ wallet متاعك. كي يكون أكثر من النصّ في coin وحدة، كل حركة فيها تولّي حركة للـ wallet الكل. |
| 65 | Day {day}: {count} trades in one day. Each one pays the fee and the spread. | نهار {day}: {count} عمليات في نهار واحد. كل وحدة تخلّص الـ frais والـ spread. |
| 66 | No habit notes on this trip. | حتى ملاحظة على الرحلة هاذي. |
| 67 | The lesson about this | الدرس على الموضوع هذا |

### Sharing

| # | English | Darija in the app |
|---|---|---|
| 68 | Send my result | ابعث النتيجة متاعي |
| 69 | I ended with {you} dollars out of 1000 in Qirat’s Time machine. Simply holding Bitcoin gave {hold}. Can you beat me? | كمّلت بـ {you} دولار من 1000 في آلة الزمن متاع Qirat. اللي خلّى Bitcoin برك كمّل بـ {hold}. تنجّم تغلبني؟ |
| 70 | ✓ Copied | ✓ تنسخ |
| 71 | Play the other trip | العب الرحلة الأخرى |
