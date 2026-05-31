import type { App } from "@/types";

export const appsEn: Record<string, Partial<App>> = {
  earnapp: {
    description:
      "EarnApp lets you monetize your unused bandwidth. Install the app, let it run in the background, and earn money passively every month.",
    shortDescription: "Share bandwidth for passive income",
    difficultyLabel: "Very easy",
    howItWorks:
      "EarnApp uses your unused internet connection for legitimate web search requests and content verification.",
    advantages: [
      "2-minute setup",
      "Fully passive earnings",
      "Multi-device compatible",
      "PayPal payouts",
      "No interaction required",
    ],
    disadvantages: [
      "Modest earnings depending on your connection",
      "iOS app coming soon (earnapp.com)",
      "Slight battery usage on mobile",
      "Not available in some countries",
    ],
    tutorial: [
      { step: 1, title: "Create an account", description: "Sign up on earnapp.com with your email." },
      { step: 2, title: "Enter referral code", description: "Use the Money's House code during registration." },
      { step: 3, title: "Install the app", description: "Download EarnApp for your platform." },
      { step: 4, title: "Withdraw your earnings", description: "Reach the $10 minimum and withdraw via PayPal." },
    ],
    faq: [
      {
        question: "Is it safe?",
        answer:
          "Yes, EarnApp does not collect any personal data and only uses your unused bandwidth.",
      },
      {
        question: "How much can I earn?",
        answer: "Between €5 and €50/month depending on your connection and number of connected devices.",
      },
    ],
    referralBonusTitle: "EarnApp welcome bonus",
    referralBonusDescription:
      "Sign up with our referral code and unlock an extra bonus on your EarnApp account.",
    referralInstructions:
      "EarnApp — during registration:\n\n1. Go to earnapp.com and create an account.\n2. If a \"Referral code\" field appears, paste the Money's House code.\n3. You can also use a referral link: https://earnapp.com/i/YOUR_CODE\n4. Install the app and sign in with the same account.\n\nThe code must be entered before or during account creation.",
    downloadLinks: [
      { platform: "signup", label: "Create an account", url: "" },
      { platform: "android", label: "Download Android", url: "" },
      { platform: "windows", label: "Windows", url: "" },
      { platform: "linux", label: "Linux / macOS", url: "" },
    ],
  },
  honeygain: {
    description:
      "Honeygain is one of the most popular apps for monetizing your unused bandwidth.",
    shortDescription: "Monetize your unused bandwidth",
    difficultyLabel: "Very easy",
    howItWorks:
      "Honeygain shares your internet connection with partner companies. You get paid for every MB shared.",
    advantages: [
      "Intuitive interface",
      "Generous referral bonus",
      "Real-time dashboard",
      "Active community",
      "Regular payouts",
    ],
    disadvantages: [
      "Not available on the iOS App Store",
      "$20 minimum withdrawal",
      "Variable earnings by region",
      "May slightly slow your connection",
    ],
    tutorial: [
      { step: 1, title: "Sign up", description: "Create your account with the Money's House referral code." },
      { step: 2, title: "Download the app", description: "Install Honeygain from the official site (Android APK or desktop app)." },
      { step: 3, title: "Enable sharing", description: "Sign in and enable bandwidth sharing." },
    ],
    faq: [
      {
        question: "Is Honeygain legal?",
        answer: "Yes, Honeygain is a legitimate company based in Lithuania, active since 2019.",
      },
    ],
    referralBonusTitle: "500 MB free",
    referralBonusDescription:
      "Create your Honeygain account with our referral code and receive 500 MB of bonus bandwidth.",
    referralInstructions:
      "Honeygain — during registration:\n\n1. Go to dashboard.honeygain.com/sign-up.\n2. Fill in your email and password.\n3. Enter the Money's House code in the \"Referral code\" field.\n4. Alternative: referral link https://r.honeygain.com/YOURCODE\n5. Download the app and sign in.\n\nThe code must be entered at registration.",
    downloadLinks: [
      { platform: "signup", label: "Create an account", url: "" },
      { platform: "web", label: "Dashboard", url: "" },
      { platform: "android", label: "Download Android (APK)", url: "" },
      { platform: "windows", label: "Windows", url: "" },
      { platform: "linux", label: "Linux / macOS", url: "" },
    ],
  },
  mcmoney: {
    description: "McMoney pays you to receive SMS messages on your phone.",
    shortDescription: "Earn by receiving SMS",
    difficultyLabel: "Easy",
    howItWorks:
      "McMoney sends verification SMS messages to your number. You receive payment for each SMS received.",
    advantages: ["Earnings per SMS received", "No action required", "Fast payouts"],
    disadvantages: ["Android only", "Requires a dedicated number", "Unpredictable earnings"],
    tutorial: [
      { step: 1, title: "Install McMoney", description: "Download the APK from cm.com/mcmoney and install the app." },
      { step: 2, title: "Enter referral code", description: "Enter the Money's House code during registration." },
      { step: 3, title: "Set up your number", description: "Register a dedicated phone number." },
    ],
    faq: [
      {
        question: "Can I use my main number?",
        answer: "We recommend a secondary number to avoid interference.",
      },
    ],
    referralBonusTitle: "McMoney sign-up bonus",
    referralBonusDescription:
      "Enter our referral code at registration and receive a bonus on your first McMoney earnings.",
    referralInstructions:
      "McMoney — during registration:\n\n1. Download the APK from cm.com/mcmoney and install the app.\n2. Create an account in the app.\n3. Look for \"Referral code\" or \"Invitation code\" in settings or during sign-up.\n4. Enter the Money's House code before confirming.\n\nThe code must be entered during initial account setup.",
    downloadLinks: [
      { platform: "signup", label: "Official site", url: "" },
      { platform: "web", label: "CM.com McMoney", url: "" },
      { platform: "android", label: "Download Android (APK)", url: "" },
    ],
  },
  "money-sms": {
    description: "Money SMS pays users for receiving verification SMS messages.",
    shortDescription: "Earn by receiving SMS",
    difficultyLabel: "Easy",
    howItWorks: "Money SMS uses your phone as a relay to receive SMS verification codes.",
    advantages: ["Fully automated", "No skills required", "Flexible withdrawals"],
    disadvantages: ["Android only", "Variable SMS volume", "Modest earnings"],
    tutorial: [
      { step: 1, title: "Create an account", description: "Sign up on moneysmsapp.com with the referral code." },
      { step: 2, title: "Install and configure", description: "Download the APK from moneysmsapp.com and allow SMS reception." },
    ],
    faq: [],
    referralBonusTitle: "Money SMS sign-up bonus",
    referralBonusDescription:
      "Use our referral code on moneysmsapp.com and receive a bonus on your Money SMS account.",
    referralInstructions:
      "Money SMS — during registration:\n\n1. Sign up on moneysmsapp.com/fr.\n2. During account creation, a \"Referral code\" field is available.\n3. Enter the Money's House code before confirming.\n4. Download the Android app and sign in with the same account.\n\nThe code must be entered on the website before installing the app.",
    downloadLinks: [
      { platform: "signup", label: "Create an account", url: "" },
      { platform: "web", label: "Official site", url: "" },
      { platform: "android", label: "Download APK", url: "" },
      { platform: "web", label: "Installation guide", url: "" },
    ],
  },
  gamby: {
    description:
      "Gamby is the 100% free sports prediction app that rewards your correct picks. Football, tennis, basketball, MMA, eSports… earn Gambz convertible to real money without betting or depositing.",
    shortDescription: "Free paid sports predictions",
    difficultyLabel: "Easy",
    howItWorks:
      "Every day you receive free tokens to predict match outcomes. Correct picks earn points and Gambz. Complete surveys and mini-games to boost earnings, then convert Gambz to real money.",
    advantages: [
      "100% free, no betting or deposit",
      "Predictions across many sports",
      "Earnings convertible to real money",
      "Referral program",
      "Active Discord community",
    ],
    disadvantages: [
      "Requires regular activity (daily tokens)",
      "Variable earnings depending on your picks",
      "Withdrawals within a few business days",
    ],
    tutorial: [
      { step: 1, title: "Download Gamby", description: "Install the app from the Play Store or App Store." },
      { step: 2, title: "Enter referral code", description: "Enter the Money's House code during registration." },
      { step: 3, title: "Make your predictions", description: "Use your daily tokens on matches of your choice." },
      { step: 4, title: "Convert your Gambz", description: "Exchange Gambz for real money from the app." },
    ],
    faq: [
      {
        question: "Is Gamby a betting site?",
        answer: "No. Gamby is a free prediction game. You never bet your own money.",
      },
      {
        question: "How do I withdraw my earnings?",
        answer:
          "Accumulate Gambz through predictions and challenges, then convert them to real money in the app. Payouts are usually processed within 10 days.",
      },
    ],
    referralBonusTitle: "50 Gambz free",
    referralBonusDescription:
      "Sign up with our referral code and receive 50 Gambz instantly on Gamby.",
    referralInstructions:
      "Gamby — during registration:\n\n1. Download Gamby from the Play Store or App Store.\n2. Create your account with your email.\n3. Look for \"Referral code\" in settings or during sign-up.\n4. Enter the Money's House code before confirming.\n5. Invite friends to earn bonus Gambz.\n\nThe referral code can be entered at registration or from your profile.",
    downloadLinks: [
      { platform: "signup", label: "Official site", url: "" },
      { platform: "android", label: "Google Play", url: "" },
      { platform: "ios", label: "App Store", url: "" },
    ],
  },
  attapoll: {
    description:
      "AttaPoll pays you to complete paid surveys, play games, and test new apps. Earn from your phone and withdraw via PayPal, Revolut, or gift cards.",
    shortDescription: "Paid surveys and mini-games",
    difficultyLabel: "Easy",
    howItWorks:
      "AttaPoll connects users with market research firms. You receive surveys matched to your profile, paid games, and testing missions. Each completed activity credits your AttaPoll balance.",
    advantages: [
      "Withdraw from $3",
      "PayPal, Revolut, and gift cards",
      "Short surveys (1 to 15 min)",
      "Android and iOS app",
      "Referral program",
    ],
    disadvantages: [
      "Variable earnings depending on your profile",
      "Survey availability varies by region",
      "Requires regular activity",
    ],
    tutorial: [
      { step: 1, title: "Download AttaPoll", description: "Install the app from attapoll.com/fr-be/, the Play Store, or the App Store." },
      { step: 2, title: "Enter referral code", description: "Enter the Money's House code at registration or in the Referrals section." },
      { step: 3, title: "Complete surveys", description: "Answer available surveys and build your balance." },
      { step: 4, title: "Withdraw your earnings", description: "Cash out from $3 via PayPal, Revolut, or gift card." },
    ],
    faq: [
      {
        question: "Is AttaPoll available in Belgium?",
        answer:
          "Yes, AttaPoll is available in Belgium and many other countries. attapoll.com/fr-be/ offers the French version for Belgium.",
      },
      {
        question: "What is the minimum withdrawal?",
        answer:
          "The minimum withdrawal threshold is $3, with PayPal, Revolut, or gift card options depending on your region.",
      },
    ],
    referralBonusTitle: "AttaPoll referral bonus",
    referralBonusDescription:
      "Sign up with our AttaPoll referral code and receive a bonus on your first activity in the app.",
    referralInstructions:
      "AttaPoll — during registration:\n\n1. Download AttaPoll from the Play Store, App Store, or attapoll.com/fr-be/.\n2. Create your account with your email.\n3. Open Profile or Settings, then \"Referrals\" / \"Refer a friend\".\n4. Enter the Money's House code before confirming.\n5. Complete surveys to accumulate earnings.\n\nThe referral code can be entered at registration or from your profile.",
    downloadLinks: [
      { platform: "signup", label: "Official site", url: "" },
      { platform: "web", label: "AttaPoll Belgium", url: "" },
      { platform: "android", label: "Google Play", url: "" },
      { platform: "ios", label: "App Store", url: "" },
    ],
  },
  eureka: {
    description:
      "Eureka Surveys pays you to complete surveys, take the daily poll, and do brand check-ins. Earn on mobile or eurekasurveys.com and withdraw via PayPal, bank transfer, or gift cards.",
    shortDescription: "Paid surveys and daily poll",
    difficultyLabel: "Easy",
    howItWorks:
      "Eureka connects users with market research firms. You earn by answering surveys, participating in the free daily poll, and through brand check-ins. Rewards are paid in real money or gift cards.",
    advantages: [
      "$1 bonus on your first survey",
      "Free daily poll",
      "PayPal, bank transfer, and gift cards",
      "Android, iOS, and web app",
      "Referral program",
    ],
    disadvantages: [
      "Survey availability depends on your profile",
      "Some surveys may disqualify you mid-way",
      "Support mainly in English",
    ],
    tutorial: [
      { step: 1, title: "Download Eureka", description: "Install the app or create an account on eurekasurveys.com." },
      { step: 2, title: "Enter referral code", description: "Enter the Money's House code during registration." },
      { step: 3, title: "Complete surveys", description: "Answer surveys and the daily poll every day." },
      { step: 4, title: "Withdraw your earnings", description: "Cash out via PayPal, bank transfer, or gift card." },
    ],
    faq: [
      {
        question: "Is Eureka Surveys reliable?",
        answer:
          "Eureka is published by SocialLoop LLC and offers PayPal and gift card withdrawals. Like any survey site, earnings depend on your profile and survey availability.",
      },
      {
        question: "Can I use Eureka on desktop?",
        answer:
          "Yes, eurekasurveys.com lets you complete surveys from a browser, in addition to the Android and iOS apps.",
      },
    ],
    referralBonusTitle: "Eureka welcome bonus",
    referralBonusDescription:
      "Sign up with our Eureka referral code and receive a bonus on your account upon registration.",
    referralInstructions:
      "Eureka Surveys — during registration:\n\n1. Download Eureka from the Play Store, App Store, or go to eurekasurveys.com.\n2. Create your account with your email.\n3. Look for \"Referral code\" during sign-up or in settings.\n4. Enter the Money's House code before confirming.\n5. Complete surveys and the daily poll to accumulate earnings.\n\nThe referral code can be entered at registration or from your profile.",
    downloadLinks: [
      { platform: "signup", label: "Official site", url: "" },
      { platform: "web", label: "Eureka Surveys", url: "" },
      { platform: "android", label: "Google Play", url: "" },
      { platform: "ios", label: "App Store", url: "" },
    ],
  },
  "google-opinion-rewards": {
    description: "Google Opinion Rewards rewards you for answering short surveys.",
    shortDescription: "Google survey rewards",
    difficultyLabel: "Very easy",
    howItWorks:
      "Google sends you short surveys. Each completed survey earns Google Play credits.",
    advantages: [
      "100% free and official Google",
      "Short surveys (1–2 min)",
      "Google Play credits usable everywhere",
    ],
    disadvantages: [
      "Google Play credits only",
      "Unpredictable survey frequency",
      "Limited availability by region",
    ],
    tutorial: [
      { step: 1, title: "Download the app", description: "Install from the Play Store or App Store." },
      { step: 2, title: "Enable location", description: "Allow location access for more surveys." },
    ],
    faq: [
      {
        question: "Can I convert to real money?",
        answer: "No, rewards are Google Play credits only.",
      },
    ],
    referralInstructions:
      "Google Opinion Rewards does not offer a referral program. You can download the app directly from the Play Store or App Store without a code.",
    downloadLinks: [
      { platform: "android", label: "Google Play", url: "" },
      { platform: "ios", label: "App Store", url: "" },
    ],
  },
};
