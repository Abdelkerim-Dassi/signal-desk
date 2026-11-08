# D. Legal/regulatory perimeter and data/LLM costs for Qirat

Research date: 2026-11-08. **Not legal advice.** It is desk research from public, mostly secondary sources (Tunisian press, law-firm guides, regulator pages). Primary Tunisian texts (JORT, BCT circulars) were only partly available online. Every Tunisian finding below should be checked by a Tunisian lawyer (avocat d'affaires / fintech) before Qirat launches anything beyond education.

Confidence scale: **High** = primary text or several consistent recent sources. **Medium** = consistent secondary sources, no primary text checked. **Low** = a single or weak source, conflicting reports, or my inference.

Research gaps: the shared web-search budget ran out partway through. CoinDesk Data, Messari/Blockworks, CryptoPanic, Token Sniffer, De.Fi, RugCheck and honeypot.is pricing could not be confirmed and are marked "unverified" in the cost table.

---

## 0. Bottom line for Qirat

| Feature idea | Risk in Tunisia today | Verdict |
|---|---|---|
| Education, glossary, scam checks, generic market "weather", karat grades applied to everyone | Low. No law found that bans *talking about* crypto. The CMF's remit is securities. | **Go**, with disclaimers |
| Paper trading, "practice with $10" (virtual money, no real asset) | Low. No funds or crypto change hands. | **Go**. Label it clearly as a simulation. |
| User profiles with *self-reported* holdings, used for tracking and education | Low to medium. Mainly a personal-data issue (INPDP). It also creates "tailoring" risk if the AI comments on the holdings. | **Go with guardrails**: generic per-coin info only, no "you should sell X" |
| AI "buy/sell" suggestions personalised to a user's holdings or situation | Medium in Tunisia (grey area: the CMF polices "conseil" on social media). High under MiCA, UAE and US benchmarks: this is the textbook definition of advice. | **No-go** as personalised advice. Rephrase as impersonal, rules-based education. |
| "Trade my $10 for me" (custody, execution, discretionary management) | **Very high.** It combines buying crypto for residents (Code des changes, which requires BCT authorisation), portfolio management for third parties, custody and AML duties. | **Hard no** |
| Paid Pro subscription collected in crypto / RedotPay / Telegram Stars (paid out in TON) | High for a Tunisian-resident operator: the operator acquires crypto, which needs BCT prior authorisation under the current reading. | **Avoid** until a lawyer confirms. Prefer TND local rails, or foreign-currency export receipts through a Startup-Act account. |
| Telegram bot delivering the same impersonal content | Low | **Go** |

---

## 1. Tunisia: legal status of crypto

### 1.1 No dedicated crypto statute. Crypto is not money. The FX regime (Law 76-18) is the binding constraint.
- Tunisia has no crypto-specific law. The dinar is the only legal tender. The working constraint is the foreign-exchange regime under **Loi n° 76-18 du 21 janvier 1976**, which requires BCT prior authorisation for many foreign-currency operations and for assets held abroad. Source (Oct 10, 2026 explainer): https://fintechtunisia.com/blog/crypto-regulation-tunisia.html
- In Feb 2023 the BCT said crypto-assets "do not have the legal status of a currency": https://managers.tn/2023/02/25/les-crypto-actifs-ne-possedent-pas-le-statut-juridique-dune-monnaie-tranche-enfin-la-bct/
- The press still describes the regime as one where the Code des changes and BCT control "formally prohibit" trading in virtual assets (La Presse via allAfrica, **Nov 6, 2026**, Chainalysis coverage). The same article puts Tunisia last in North Africa, with about $3B in crypto flows from Jul 2025 to Jun 2026, mostly informal P2P: https://fr.allafrica.com/stories/202611060672.html
- The fintechtunisia explainer **could not trace the "total ban" to a specific statute or BCT circular**. Read the "ban" as an *interpretation* of the FX code (no authorisation means illegal), not as an explicit crypto prohibition.
- **Confidence: Medium-High** that buying, holding or paying in crypto as a Tunisian resident without BCT authorisation is treated as an FX violation in practice. **Low** on the exact legal basis and article numbers: no primary text was checked.

### 1.2 The "2018 BCT notice"
- Secondary sources say the BCT issued statements in 2017–2018 calling crypto "virtual tokens without legal value" and told banks to block card payments to foreign exchanges. One source claims a "formal ban in May 2018"; an AI-generated compliance site cites a communiqué of 30 Nov 2018. Sources: https://coinfomania.com/cryptocurrency-regulations-in-tunisia/ , https://web3compliance-ai-76r.pages.dev/regulations/tn/tn-status , https://www.lightspark.com/knowledge/is-crypto-legal-in-tunisia
- **I could not find the BCT primary text.** Dates and wording conflict between sources.
- **Confidence: Low** on the wording and date of the notice. **Medium** that banks block card payments to exchanges in practice, since several sources agree.

### 1.3 Foreign-exchange code reform (2024–2026): still not law
- **Mar 2022:** BCT Governor Abassi said crypto-assets would be in the next FX law. He acknowledged that young people had been jailed for crypto because of the legal vacuum: https://managers.tn/2022/03/01/exclusif-%e2%80%95-abassi-les-crypto-actifs-feront-partie-de-la-prochaine-loi-de-change/
- **Feb 2023 preliminary draft:** residents' crypto holdings would have to be *declared*. *Acquiring* crypto, whether bought with dinars **or received as payment for goods/services**, would need BCT prior authorisation: https://managers.tn/2023/02/27/il-va-falloir-obtenir-lautorisation-de-la-bct-pour-se-faire-payer-en-crypto-monnaie/
- **Mar 14, 2024:** the government adopted a draft FX code that allows holding and trading crypto under BCT authorisation and thresholds: https://managers.tn/2024/03/18/code-des-changes-les-tunisiens-peuvent-desormais-detenir-et-echanger-des-cryptomonnaies/ ; https://launchbaseafrica.com/2024/03/20/leaked-foreign-exchange-code-reveals-new-changes-to-foreign-currency-accounts-paypal-and-cryptocurrency-in-tunisia/
- **Oct 21, 2025:** MP Maher Ktari filed a full FX-code bill backed by 40 MPs: https://www.webdo.tn/fr/actualite/national/tunisie-une-proposition-de-reforme-complete-du-code-des-changes-deposee-a-larp/386013/
- **Apr 29, 2026:** the Finance & Budget Committee cleared a text. It defines crypto-assets, requires declaration of holdings above a threshold (set later by decree) and repatriation of digital-asset earnings, and sets up to 3 years' prison for serious FX violations (doubled for repeat offences): https://en.africanmanager.com/new-foreign-exchange-code-what-parliament-proposes-to-government/
- **Jul–Oct 2026:** still not adopted. Reportedly awaiting BCT input, and the Finance Ministry suggested postponing to 2027 (fintechtunisia, above). I found no plenary vote up to Nov 8, 2026.
- **Confidence: High** that the new code is not in force as of Nov 2026. **Medium** on its contents, which may still change.
- **Implication:** even after reform, the direction is *declaration plus BCT authorisation*, not free use. A Qirat feature that executes or holds crypto for Tunisians would almost certainly need a licence under the new code.

### 1.4 Prosecutions
- **2021, Houssem/Hossam Bouguerra** (engineering student): arrested in May 2021 for holding and using bitcoin and prosecuted under the Code des changes. The Tunis first-instance court issued a **non-lieu** (dismissal) in Dec 2021. A May 2021 report of a student released in Monastir may be the same case (not confirmed). Coverage: https://businessnews.com.tn/2021/12/09/article-1184427/1184427/ , https://businessnews.com.tn/2021/05/26/article-1179117/1179117/ , https://www.lapresse.tn/2021/09/19/ne-pas-confondre-cryptomonnaie-et-blanchiment-dargent/
- **June 2021:** Finance Minister Ali Kooli said bitcoin ownership should be decriminalised: https://news.bitcoin.com/tunisian-minister-says-he-plans-to-decriminalize-buying-of-bitcoin , https://cryptoast.fr/depenalisation-cryptomonnaies-tunisie/
- I found no 2025–2026 prosecution reports. The search budget ran out before a targeted search, so treat this as *not found*, not *none*.
- **Confidence: High** that arrests have happened under the FX code (2021). **Low** on current enforcement intensity.

### 1.5 e-Dinar (La Poste), sandbox and payments rules
- The **e-Dinar** is La Poste Tunisienne's prepaid card and wallet range, not a CBDC or crypto. The wallet has been free since July 2025. It is widely used for school and university fees: about 287k students paid remotely in 2026: https://managers.tn/2025/07/16/les-tunisiens-peuvent-desormais-beneficier-gratuitement-dune-wallet-e-dinar-aupres-de-la-poste/ , https://lapresse.tn/2026/10/09/numerisation-la-poste-tunisienne-valide-plus-de-18-million-dinscriptions-scolaires-et-universitaires-en-ligne/ . Phishing campaigns target e-Dinar users (Feb and Jul 2026): https://managers.tn/2026/02/24/attention-des-arnaques-ciblent-les-utilisateurs-du-wallet-e-dinar/ . This is useful scam-education content.
- A 2019 "e-Dinar blockchain/CBDC" story was false (fact-check): https://seo.misbar.com/en/factcheck/2022/05/25/tunisia-did-not-pioneer-the-use-of-cryptocurrency-and-blockchain ; the BCT denied plans for an imminent CBDC: https://www.unlock-bc.com/en/tunisia-central-bank-denies-claims-of-issuing-central-bank-currency-in-the-near-future
- The BCT regulatory sandbox (from 2020) included crypto/CBDC pilots. A wholesale CBDC test with the Banque de France ran in 2021. These are supervised pilots, not public trading: https://thefintechtimes.com/fintech-overview-of-tunisia-in-2024/
- **BCT Circular 2026-10 (Sep 25, 2026)** overhauls payment-institution rules (account tiers capped at TND 1.5k/5k/20k, KYC with liveness checks, cross-border receipts capped at TND 20k per transaction). It does not mention crypto. It matters if Qirat ever collects money through a local payment institution: https://launchbaseafrica.com/2026/09/28/tunisias-fintech/
- **Confidence: High** (e-Dinar). **Medium** (circular details come from one press source).

### 1.6 AML/CTF (CTAF)
- The framework is Loi organique 2015-26, amended by LO 2019-9. The CTAF is the FIU and receives suspicious-transaction reports through goAML. The obliged entities are financial intermediaries (banks, brokers, management companies…). See the CMF reminder to brokers and management companies (Jan 2025): https://managers.tn/2025/01/30/les-intermediaires-en-bourse-appeles-a-respecter-rigoureusement-les-reglementations-aml ; CMF communiqué PDF: https://cmf.tn/sites/default/files/pdfs/publications/avis-et-communiques/communique_fr_2.pdf
- I found no Tunisian text that defines or registers VASPs/PSAV. A Jan 2026 study calls crypto a laundering channel and urges a "precise and proactive" crypto law: https://www.webmanagercenter.com/2026/01/30/560818/cryptomonnaies-et-reseaux-sociaux-comment-le-blanchiment-dargent-evolue-dans-lespace-numerique/ ; https://allafrica.com/stories/202601300069.html
- **Implication:** an education app that never touches funds is *not* an obliged entity. "Trade for me", custody or payment collection in crypto would pull Qirat toward AML duties, with no licensing path to satisfy them.
- **Confidence: Medium.**

### 1.7 CMF warnings (Sep–Oct 2026)
- **Sep 9–11, 2026:** the CMF warned about fake documents using its name to legitimise investment offers and said it would file a criminal complaint: https://managers.tn/2026/09/11/cmf-une-pretendue-lua-myriam-trabelsi-fait-circuler-de-faux-documents-pour-pieger-des-investisseurs/ , https://www.tunisienumerique.com/le-cmf-met-en-garde-contre-des-tentatives-descroquerie-numerique-utilisant-son-nom-et-de-faux-documents/ , https://www.webdo.tn/fr/actualite/national/le-cmf-alerte-sur-de-faux-agrements-utilises-pour-proposer-des-investissements-fictifs/403808/
- **Oct 5, 2026:** the CMF published the guide "Prévenir les fraudes sur Internet et investir avec vigilance" and a new "Mises en garde" section on its site (World Investor Week): https://managers.tn/2026/10/05/cmf-publie-un-nouveau-guide-pour-eviter-les-pieges-de-linvestissement-en-ligne/ ; guide PDF: https://cmf.tn/sites/default/files/pdfs/documentation/guides/Guide%20fraude%20CMF.pdf
- **Oct 28, 2026:** the CMF named **ELINOJA PATRIMOINE**, which offered portfolio management for third parties *"presented as investment advice and financial recommendations"* on a social network without any approval. The CMF reiterated that third-party portfolio management is reserved to licensed brokers, management companies and banks: https://www.leconomistemaghrebin.com/2026/10/28/cmf-attention-aux-arnaques-dinvestissement-sur-les-reseaux-sociaux/
- None of these warnings mention crypto explicitly.
- **Confidence: High** (several dated sources). **Relevance to Qirat:** the CMF is actively policing *social-media "conseil" that is really money management*. Qirat's marketing (reels, Telegram) must never look like "send us money / we manage it". These warnings are also good content: Qirat can relay CMF warnings as education.

---

## 2. Tunisia: what counts as regulated advice or management (Loi 94-117 and others)

- **Scope of the CMF (Loi 94-117, art. 23):** the CMF protects savings invested in *valeurs mobilières*, exchange-traded financial products, and "any other placement giving rise to appel public à l'épargne". Primary text: https://www.cmf.tn/sites/default/files/pdfs/reglementation/textes-reference/loi_94117_141194_fr.pdf
- **Art. 55:** brokers (intermédiaires en bourse) have the **exclusive** right to *negotiate and register* securities on the BVMT. **Art. 56:** brokers *may* also carry out "le conseil financier, le démarchage financier, la gestion individuelle de portefeuilles…" under the broker decree (n° 99-2478). Individual portfolio management requires a written agreement. Same PDF.
- **Loi 2005-96:** third-party management of *securities* portfolios is reserved to banks, brokers and CMF-approved management companies (SA). Unlicensed activity is a criminal offence: https://cmf.tn/sites/default/files/pdfs/reglementation/textes-reference/loi_200596_181005_fr.pdf
- **Appel public à l'épargne (APE), Loi 94-117 art. 1:** covers issuers placing *their titres* through intermediaries, any advertising or démarchage. Démarchage means habitually approaching people at home, at work or in public places, or habitually sending letters or leaflets, to propose subscribing to or buying *titres*. CMF APE regulation: https://cmf.tn/sites/default/files/pdfs/reglementation/textes-reference/reg_CMF_APE_fr.pdf
- **Does it apply to crypto?** These texts are written around *valeurs mobilières/titres* and exchange-traded products. Bitcoin and similar coins are not securities issued by a Tunisian company and are not listed on the BVMT. **My reading:** the CMF's investment-advice and portfolio-management perimeter does **not** squarely cover generic crypto commentary. Two caveats apply:
  1. A token sold to the Tunisian public as an investment (an ICO or "placement") could arguably be an APE "placement" under art. 23, which is also how scammers get caught.
  2. Tunisia appears to have **no standalone licensed "conseiller en investissements financiers" status** (a 2010 debate asked whether to create one: https://www.webmanagercenter.com/2010/08/16/93956/tunisie-faut-il-reglementer-la-profession-de-conseil-en-investissements-financiers/). Paid "conseil" is therefore a grey zone, and the CMF attacks it when it slides into managing money (ELINOJA, 2026; similar warnings in 2010–2011).
- **Other laws still apply:** Penal Code fraud (escroquerie), consumer protection, false advertising, and the FX code for anything that moves money or crypto across the border.
- **Confidence: High** on the text of 94-117 and 2005-96. **Medium-Low** on the conclusion that crypto falls outside the CMF perimeter: it is my interpretation, no CMF statement on crypto was found, and a court could take a broad view of "placement".

---

## 3. Benchmarks: where the education/advice line sits elsewhere

### 3.1 EU: MiCA (fully applicable; transition ended Jul 1, 2026)
- **Art. 3(1)(24):** advice on crypto-assets is "offering, giving or agreeing to give **personalised recommendations** to a client… in respect of one or more transactions relating to crypto-assets, or the use of crypto-asset services". Portfolio management of crypto-assets is a separate CASP service, with conduct rules in Art. 81. https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions
- **ESMA Q&A 2882 (Jun 18, 2026):** the MiCA advice perimeter is **broader than MiFID II's**. Tests: is it a recommendation; does it concern transactions or services; is it *presented as suitable or based on the person's circumstances*; is it given *other than exclusively to the public*; is the recipient an (potential) investor. Even introductory recommendations of a CASP can be advice. A bare reference to a CASP that everyone can access is not. https://www.esma.europa.eu/publications-data/questions-answers/2882
- **ESMA knowledge and competence guidelines** (apply from Jul 28, 2026): staff giving *advice* need a higher standard than staff giving *information*: https://www.esma.europa.eu/sites/default/files/2026-01/ESMA35-24871704-2922_Guidelines_for_the_criteria_on_the_assessment_of_knowledge_and_competence_under_MiCA.pdf ; summary: https://www.finanssivalvonta.fi/en/publications-and-press-releases/supervision-releases/2026/The-European-regulatory-framework-on-crypto-asset-service-providers-is-complete-last-ESMA-Guidelines-applicable-from-28-July-2026/
- **ESMA statement on unauthorised CASPs winding down (Jun 23, 2026):** https://www.amf-france.org/en/news-publications/news/esma-public-statement-esma-calls-unauthorised-crypto-asset-service-providers-wind-down-orderly-while
- **Finfluencers:** the ESAs' consumer warnings cite "aggressive promotion on social media by finfluencers": https://esma.europa.eu/press-news/esma-news/eu-supervisory-authorities-warn-consumers-risks-and-limited-protection-certain . I found no binding ESMA finfluencer rule.
- **Confidence: High.**

### 3.2 France: AMF and the influencer law
- The **Loi n° 2023-451 du 9 juin 2023** (influencers), art. 4, restricts commercial influencers promoting crypto to providers registered or authorised with the AMF (now MiCA CASPs). Reports differ on whether registration alone was enough. https://journalducoin.com/actualites/regulation-crypto-loi-influenceurs-publiee-journal-officiel/ , https://www.economie.gouv.fr/node/3222759
- The AMF/ARPP "certificat de l'influence responsable" has been updated for MiCA: https://www.amf-france.org/sites/institutionnel/files/pdf/75856/fr/Le_certificat_de_l%27influence_responsable_dans_la_finance_integre_desormais_les_evolutions_liees_au_reglement_europeen_MiCA.pdf
- The AMF has updated its doctrine on crypto advice by CIFs (FIAs): https://www.amf-france.org/en/news-publications/news/advice-crypto-assets-amf-updates-its-doctrine-relation-fias
- **Relevance:** if Qirat reaches French users (FR content), it must never be *paid* to promote an exchange that is not MiCA-authorised. Affiliate links to exchanges are risky.
- **Confidence: Medium** (exact art. 4 wording not checked).

### 3.3 US: publisher's exclusion
- **Lowe v. SEC, 472 U.S. 181 (1985):** newsletters are excluded from the Investment Advisers Act if they are (i) **impersonal**, not tailored to any specific portfolio, (ii) **bona fide**, meaning genuine and disinterested commentary rather than touting, and (iii) of **general and regular circulation**, not episodic "tips" timed to market moves. https://www.law.cornell.edu/supremecourt/text/472/181 ; SEC staff reading: https://www.sec.gov/divisions/investment/noaction/1995/alfredzurl080795.pdf
- The SEC has signalled interest in regulating "information providers" and analytics that drift into advice: https://www.wsgr.com/en/insights/informationor-advice-sec-regulation-of-information-providers-may-expand-to-include-providers-of-innovative-investment-analytics.html
- Caveat: the Advisers Act applies to *securities*. Many tokens' status is unsettled. The point here is the design pattern, not US exposure (Qirat does not target the US).
- **Confidence: High** on Lowe.

### 3.4 UAE
- **VARA (Dubai):** "Advisory Services" and "Broker-Dealer" are separately licensed VA activities. The Marketing Regulations apply to anyone marketing VAs into or in the UAE, licensed or not: https://rulebooks.vara.ae/node/337
- **CMA (formerly SCA) finfluencer regime, Resolution 10/R.M of 2025, in force May 29, 2025:** anyone giving public financial recommendations on social media, *including on virtual assets*, must register (CFA or accredited analyst, 1,000+ followers, 6+ months of experience). Duties: separate fact from opinion, source data, add risk disclaimers, disclose compensation. A media permit is also needed. https://www.clydeco.com/zh/insights/2026/09/the-uae-s-finfluencer-regime (Sep 7, 2026)
- **Relevance:** if Qirat markets to UAE-resident Arabic speakers, "recommendations" content could trigger CMA registration. Pure education with disclaimers and no buy/sell calls is the safe zone.
- **Confidence: Medium-High.**

### 3.5 Morocco
- **Draft Law 42.25 (published Nov 2025):** covers issuance, public offering, trading, custody and **advisory services** for digital assets. The AMMC licenses service providers, Bank Al-Maghrib oversees stablecoins and the ANRF handles AML. https://fr.hespress.com/449112-actifs-numeriques-ce-que-prevoit-le-projet-de-loi-42-25.html
- **Still not enacted as of Jul 22, 2026** (BAM says finalisation continues): https://www.moroccoworldnews.com/2026/07/330814/bam-confirms-progress-on-crypto-law-to-curb-moroccos-growing-underground-market/ . The Office des Changes is pursuing undeclared crypto held abroad (May 2026): https://www.moroccoworldnews.com/2026/05/289879/morocco-tightens-oversight-of-crypto-assets-as-foreign-exchange-office-steps-in/
- **Confidence: Medium-High.**

### 3.6 Algeria: full ban
- **Law 25-10 (JO n° 48, in force Jul 24, 2025)** amends the AML law 05-01. It bans issuing, buying, selling, holding, using, **promoting**, mining and running exchanges for crypto. Penalties are reported as up to 1 year and DZD 1M; other reports say up to 2 years and DZD 10M for operators. https://www.unlock-bc.com/en/algeria-enforces-complete-crypto-ban-with-harsh-penalties-under-law-no-25-10 , https://cryptobriefing.com/algeria-crypto-ban-legislation
- **Relevance:** "promotion" is banned. Do not target Algeria in marketing. Education framed as "scam awareness" is lower-risk but still uncertain.
- **Confidence: Medium** (penalty amounts conflict; primary text not checked).

### 3.7 Egypt
- **CBE Law 194/2020, art. 206:** issuing, trading or **promoting** crypto, or operating platforms, without a CBE board licence is prohibited. Penalties under art. 225: prison and/or EGP 1M–10M. No licence has ever been granted. https://eg.andersen.com/legality-cryptocurrency-in-egypt/ ; Chambers Fintech 2026: https://gpg-pdf.chambers.com/fintech-2026/228/
- **Confidence: Medium-High.** As with Algeria, do not "promote" crypto to Egypt.

### 3.8 Design patterns that keep an app on the information/education side (consistent across MiCA, Lowe and the UAE)
1. **Impersonal:** the same content for everyone, not tailored to a person's holdings, goals, age or wealth (Lowe; MiCA "presented as suitable").
2. **Not a recommendation to transact:** describe and grade risk ("BTC: low risk grade, trend weak"), never "buy", "sell", "now", "you should".
3. **Regular and bona fide:** a scheduled daily or weekly cadence, not alerts that tell people to act at once. No paid placements or affiliate touting.
4. **No execution, no custody, no "send us money".** These turn "information" into a regulated service everywhere, and trigger the Tunisian FX code.
5. **Show the method:** publish how grades are computed, separate facts from opinion and cite sources (UAE CMA duties).
6. **Disclose conflicts:** state that Qirat earns nothing from any coin or exchange. Refuse affiliate deals with unlicensed exchanges (France, UAE).
7. **Mandatory risk disclaimers:** on every screen and in every message (UAE, VARA, AMF certificate).
8. **Geo-awareness:** no promotion targeted at Algeria or Egypt. Be careful with UAE and France.

---

## 4. Payments: can a Tunisian operator collect subscriptions in crypto or foreign currency?

- **In crypto (direct, RedotPay or Telegram Stars → TON):** under the current FX regime and the stated BCT position (the 2023 draft requires prior BCT authorisation to *acquire* crypto, including as payment for services), a Tunisian-resident operator receiving crypto is **high risk**. Revenue earned abroad must also be repatriated. Sources: https://managers.tn/2023/02/27/il-va-falloir-obtenir-lautorisation-de-la-bct-pour-se-faire-payer-en-crypto-monnaie/ ; https://en.africanmanager.com/new-foreign-exchange-code-what-parliament-proposes-to-government/ . **Confidence: Medium.**
- **RedotPay:** a stablecoin card and wallet. Tunisia is not on its unsupported-registration list (https://intercom.help/redotpay-support/en/articles/10339263-redotpay-unsupported-countries-regions, "updated this week"). Secondary guides say Tunisia is a supported *billing* country, but **physical cards are not shipped** to Tunisia. I found no RedotPay merchant-acceptance product. Using it means Qirat holds USDT/USDC, which runs into the issue above. **Confidence: Medium-Low.**
- **Telegram Stars:** digital goods in bots and Mini Apps **must** be sold in Stars (XTR). Using other rails risks being hidden from iOS/Android users: https://core.telegram.org/bots/payments-stars . Payouts go through Fragment in **TON** after a **21-day hold**. Secondary sources cite a minimum of about 1,000 Stars and a value of about $0.013 per Star. Creator terms: https://telegram.org/tos/content-creator-rewards ; guide: https://dev.to/starsearn/how-telegram-creators-cash-out-stars-the-complete-2026-withdrawal-guide-dko . So a Tunisian operator still ends up receiving crypto (TON). **Confidence: Medium.**
- **Foreign currency through legal channels:** a company with the **Startup Act label** can open a "compte startup en devises" (BCT Circular 2019-01). It is credited with export proceeds (for example card payments from *foreign* customers) and is subject to BCT controls. In practice, BCT approvals take months. Sources: https://www.webmanagercenter.com/2019/02/01/430519/bct-conditions-douverture-de-comptes-startup-en-devises/ , https://www.mtc.gov.tn/fileadmin/StartupAct/Cir_2019_02_fr.pdf , https://launchbaseafrica.com/2024/11/26/will-funding-finally-flow-to-tunisian-startups-new-foreign-currency-rules-challenge-the-status-quo/ , https://www.leconomistemaghrebin.com/2026/02/12/reglementation-change-cadre-juge-startups-tunisiennes/ . **Confidence: Medium.**
- **For Tunisian users:** charge in **TND** through local rails: e-Dinar, bank cards via a licensed local payment gateway or payment institution (now under BCT Circular 2026-10). I did not research specific gateway providers or their fees. **Recommendation:** before charging (planned Jan 2027), get a one-hour opinion from a Tunisian fintech lawyer covering (a) TND subscriptions for residents, (b) foreign-card receipts through a startup FX account, and (c) whether any crypto or Stars route is tolerable.

---

## 5. Safe design rules for Qirat (proposed)

1. **No execution, no custody, no pooled money. Ever.** Drop "trade my $10 for me". It touches the FX code, third-party portfolio management, AML and custody at the same time.
2. **Paper trading only.** "Practice with $10" uses virtual balances, live public prices and *no* deposit, withdrawal, prize or real-money conversion. Label it "Simulation, not real money" in AR/FR/EN/Darija.
3. **Impersonal grades.** Karat and risk grades are computed the same way for everyone and published with their method. They are never recalculated "for you".
4. **No imperative verbs about transactions.** The AI must not say buy, sell, enter, exit, "now" or "you should". It describes risk, history and scenarios. Enforce this in system prompts and with an output filter (regex plus classifier), and log refusals.
5. **Holdings stay self-reported and educational.** Users may log coins to *learn* (diversification math, volatility of their mix, scam checks on tokens they hold). The AI comments on concepts and on each coin's public grade, never "sell your X". Do not ask for income, age, wealth or goals, since collecting them makes outputs look "suitable".
6. **The daily brief is the same for everyone (per language).** This is legally safer (Lowe: general and regular circulation) and roughly 100x cheaper than a personalised brief.
7. **The coach is a teacher, not an adviser.** It answers "what is / how does / what are the risks of". On "should I buy X?" it reframes: "I can't tell you what to do. Here is how to evaluate X: risk grade, liquidity, scam checks." A fixed disclaimer is appended.
8. **Disclaimers everywhere**, in EN, FR, AR and Darija: "Educational information, not investment advice. Qirat is not licensed by the CMF or the BCT. Crypto is not legal tender in Tunisia and buying it may be subject to foreign-exchange rules."
9. **No affiliate links, referral codes or paid listings** for exchanges, tokens, P2P sellers or "signal" groups. Disclose that Qirat takes no compensation from coins or exchanges.
10. **Never describe Qirat as approved or regulated** by the CMF, BCT, VARA or any other authority (VARA Marketing Regulations; CMF fake-approval warnings).
11. **Make scam education the hero.** Relay CMF, La Poste and BCT warnings. Run GoPlus-style token checks. Explain P2P and FX-law risk honestly, including that it is not legal advice.
12. **Geo-rules:** do not run promotional campaigns targeting Algeria or Egypt, where crypto promotion is banned. Keep UAE content strictly educational (CMA finfluencer regime). In France, no paid crypto promotion.
13. **Payments:** Pro is billed in TND through local licensed rails, or as foreign-card export revenue into a startup FX account, after a lawyer's sign-off. Hold off on crypto, RedotPay and Stars for revenue until then.
14. **Personal data:** profiles with holdings are personal data under Tunisia's data-protection law (Loi organique 2004-63, regulator INPDP). *Not researched this session; verify the declaration duties.* Minimise data: no ID documents and no wallet private keys. A watch-only public address is optional and treated as sensitive.
15. **Keep evidence:** log generated briefs and coach answers for at least 12 months, so Qirat can show they were impersonal if questioned.

---

## 6. Data-source cost table (prices fetched 2026-11-08 unless noted)

| Source | Free tier | Paid price | What Qirat would use it for | Notes / source |
|---|---|---|---|---|
| **CoinGecko API** | Demo: $0, 10k calls/mo, 100/min, 1-yr history, **attribution required** | Basic $35/mo ($29/mo annual), 100k calls; Analyst $129, 500k; Lite $499, 2M; Pro $999, 5M | Prices, market caps, history for grades and paper trading | Commercial use is explicit from Basic up; Demo commercial terms unclear. https://www.coingecko.com/en/api/pricing |
| **CoinMarketCap API** | Basic: $0, 15k credits/mo, 50/min, **commercial use allowed**, 1-yr daily history | Builder $29, 150k; Startup $79, 450k; Growth $299, 2M; Pro $699, 5M | Backup price feed, rankings | https://coinmarketcap.com/api/pricing/ |
| **Binance public market data** | Free, no key; limits are request weight per IP (see `exchangeInfo`); 429 then 418 bans of 2 min–3 days | n/a | Klines and tickers for charts, the 50-day regime, paper-trading fills | Use `data-api.binance.vision` for market-data-only access. The main API returns 451 from restricted locations (e.g. US cloud IPs). Using Binance data is not endorsing Binance; don't link users to trade. https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits ; https://dev.binance.vision/t/api-error-451-unavailable-for-legal-reasons/13828 |
| **CoinDesk Data (ex-CryptoCompare)** | Free tier for *personal* use (monthly request quota) | Commercial plans; **price unverified** | Optional news and price backup | https://developers.coindesk.com/ |
| **Messari** | Legacy API in maintenance mode; migrating to Blockworks API | **Unverified** | Not needed | https://docs.messari.io/ |
| **Santiment** | Free: 30-day lag in Sanbase, 2-yr charts | Sanbase Pro $49/mo; **Max $249/mo is the minimum for real-time API** | Social and on-chain sentiment (later) | https://app.santiment.net/pricing |
| **LunarCrush** | No free tier listed | Light $90/mo ($72 annual), Medium $300, Heavy $900; pay-as-you-go $1 per 1k requests | Social hype and FOMO meter (optional) | https://lunarcrush.com/pricing |
| **Glassnode** | None | Advanced $49/mo (annual) **has no API**; API is an add-on to Professional (from $584/mo) | Not worth it at this stage | https://studio.glassnode.com/pricing |
| **CryptoPanic** | Free developer tier exists (details **unverified**) | **Unverified** | Headline feed for the daily brief | https://cryptopanic.com/developers/api/ |
| **NewsAPI.org** | Developer: 100 req/day, 24h delay, **not for production** | Business $449/mo; Advanced $1,749/mo | Avoid: too expensive | https://newsapi.org/pricing |
| **GDELT DOC 2.0** | Free; 3-month window, up to 250 records per query | n/a | Global, multilingual (incl. Arabic) news on crypto scams and regulation | https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/ |
| **Fear & Greed (alternative.me)** | Free; `api.alternative.me/fng/`; commercial use OK **with attribution next to the data** | n/a | Market-mood input for "market weather" | https://alternative.me/crypto/fear-and-greed-index/ |
| **DefiLlama** | Free open API: TVL, fees, prices (no stated limits) | API tier $300/mo ($3,000/yr): 1M calls, 1,000/min, $0.60 per extra 1k; the $49 Pro plan has no API | Protocol TVL and stablecoin data for education cards | https://docs.llama.fi/pro-api |
| **GoPlus Security** | **Free: 150k CU/mo, 30k CU/day, 150 CU/min** | Test $199; Beginner $399; Growth $799; Pro $1,899/mo | **Scam check**: honeypot, mint, owner, tax flags on EVM and Solana tokens | https://gopluslabs.io/security-api |
| **Token Sniffer** | **Unverified** (page blocked) | **Unverified** | Secondary scam score | https://tokensniffer.com/TokenSnifferAPI |
| **De.Fi Scanner** | Web scanner; API **unverified** | **Unverified** | Secondary scam check | https://de.fi/scanner |
| **honeypot.is** | Web tool for ETH, BSC, Base; API terms not published (contact via Telegram) | **Unverified** | Honeypot check (GoPlus covers this) | https://honeypot.is/ |
| **RugCheck (Solana)** | Public Swagger API exists; limits **unverified** | **Unverified** | Solana memecoin risk | https://api.rugcheck.xyz/swagger/index.html |
| **Etherscan API v2** | Free: 3/s, 100k/day, selected chains, **personal/research only** | Lite $49, Standard $199 (both non-commercial); **Advanced $299/mo is the first commercial tier**; Pro $399; Pro Plus $899 | Contract age, holder concentration | Prefer GoPlus for commercial use. https://etherscan.io/apis |

**Recommended launch stack: about $0–35/mo for data.** CoinGecko Demo, then Basic at $35 when charging starts (commercial certainty), plus CMC Basic (free, commercial) as backup, Binance `data-api` klines, alternative.me F&G with attribution, DefiLlama free, GoPlus free, GDELT and RSS for news. Avoid Etherscan's free tier and NewsAPI's free tier in production because their terms forbid it.

---

## 7. LLM prices (official pages, fetched 2026-11-08)

| Model | Input $/M | Output $/M | Cache read $/M | Batch | Source |
|---|---|---|---|---|---|
| Claude **Haiku 5.5** (≤100K ctx) | 0.10 | 0.50 | 0.01 | −50% | https://claude.com/pricing |
| Claude **Sonnet 5.5** | 2.00 | 10.00 | 0.10 | −50% | same |
| Claude **Opus 5.5** | 4.00 | 20.00 | 0.20 | −50% | same |
| Claude Fable 5.1 (top tier) | 10.00 | 50.00 | 0.25 | −50% | same |
| Groq **gpt-oss-120b** | 0.15 | 0.60 | n/a | n/a | https://console.groq.com/docs/models |
| Groq gpt-oss-20b | 0.075 | 0.30 | n/a | n/a | same |
| Gemini **3.5 Flash-Lite** | 0.30 | 2.50 | n/a | n/a | https://aistudio.google.com/docs/pricing |
| Gemini **3.6 / 3.8 Flash** | 0.75 (→1.50 from Jan 1, 2027) | 3.75 (→7.50) | n/a | n/a | same |
| Gemini 3.1 Flash-Lite | 0.25 | 1.50 | n/a | n/a | same |
| Gemini 2.5 Flash / Flash-Lite | 0.30 / 0.10 | 2.50 / 0.40 | n/a | n/a | **Deprecated**: 2.5 Flash is rerouted to 3.5 Flash-Lite from Dec 1, 2026 |
| Gemini 2.5 Pro TTS (current Darija voice) | 1.00 text | 20.00 audio | n/a | n/a | same; Flash TTS is $0.50/$10 |

Notes: Haiku 5.5 is $0.50/$2.50 above 100K context. US-only inference costs 1.1x. Gemini grounding with Google Search is free up to 5k/month, then $14 per 1k.

### Cost estimate for ~1,000 users per month

Assumptions:
- **Personalised brief:** 1,000 users × 30 days, each with 3k input and 600 output tokens. That is 90M input and 18M output tokens.
- **Shared brief:** 3 languages × 30 days, each with 8k input and 1.5k output tokens. That is 0.72M input and 0.135M output tokens.
- **Coach:** 30% of users are active, each with 12 chats a month of 4 turns. That gives 14,400 turns at 4k input (mostly cacheable system prompt and context) and 400 output each: 57.6M input and 5.76M output tokens.

| Model | Shared brief | Personalised brief | Coach (no cache) | Coach (75% input cached)* | **Total (shared brief + coach)** |
|---|---|---|---|---|---|
| Haiku 5.5 | ~$0.14 | $18 | $8.6 | ~$4.6 | **≈ $5–9** |
| Sonnet 5.5 | ~$2.8 | $360 | $173 | ~$91 | **≈ $94–176** |
| Opus 5.5 | ~$5.6 | $720 | $346 | ~$183 | **≈ $189–352** |
| Groq gpt-oss-120b | ~$0.19 | $24 | $12.1 | n/a | **≈ $12** |
| Gemini 3.5 Flash-Lite | ~$0.55 | $72 | $31.7 | n/a | **≈ $32** |
| Gemini 3.6 Flash | ~$1.05 | $135 ($270 from 2027) | $65 ($130 from 2027) | n/a | **≈ $66 ($131 from 2027)** |

\*Cache math for Sonnet: 43.2M cached input at $0.10 plus 14.4M fresh input at $2, then outputs. Cache writes are ignored. The Haiku and Opus figures scale the same way.

Takeaways:
- An impersonal shared brief written with a strong model (Sonnet or Opus, about $3–6/mo) is both **legally safer and cheaper** than a personalised brief.
- The coach is the cost driver. Routing coach turns to Haiku 5.5 or Groq gpt-oss-120b, which production already uses, keeps the total under **$15/mo** at 1,000 users. Escalate to Sonnet only for flagged hard questions.
- A realistic all-in for data plus LLM at 1,000 users is **about $20–60/mo**. That fits the $0–50/mo budget if the coach stays on Haiku or Groq and CoinGecko Basic ($35) is deferred until revenue.
- TTS (reels) is a separate marketing cost and is not included here.

---

## 8. Open questions for a Tunisian lawyer

1. Does publishing crypto *education and grades* (no execution) expose the operator to any Code des changes, CMF or penal risk? Is there any recent case law?
2. Is a self-reported holdings tracker plus an AI coach "conseil" under any Tunisian text, given there is no standalone CIF status?
3. What is the legal route to charge Tunisian residents (TND gateway) and foreign users (startup FX account)? Can Telegram Stars or RedotPay revenue be lawfully held or converted by a Tunisian SUARL or SARL?
4. What INPDP declaration or authorisation is needed for user profiles stored outside Tunisia (Cloudflare, Vercel)?
5. If the new Code des changes passes (2026–27), will crypto *information* services need a BCT licence, or only exchange and custody services?
