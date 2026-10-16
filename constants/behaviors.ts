export interface BehaviorStep {
  number: number;
  title: string;
  description: string;
}

export interface Behavior {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  audioScript: string;
  audioDuration: string;
  audioUrl?: string;
  steps: BehaviorStep[];
}

export const BEHAVIORS: Behavior[] = [
  {
    id: 'screaming',
    title: 'عند صراخ الطفل',
    subtitle: 'خطوات عملية للتعامل مع الصراخ',
    iconName: 'headphones',
    color: '#5B3D91',
    audioDuration: '04:32',
    audioScript:
      'خدي نفس عميق يا ماما.. طالما طفلك في مكان آمن، متبصيش في عينه ومتتكلميش معاه خالص وقت الصراخ، واشغلي نفسك بأي حاجة جنبه. أوعي تديله الحاجة اللي بيعيط عشانها دلوقتي، وأول ما يسكت لمدة عشر ثواني، ابتسمي ليه وقوليله برافو إنك هديت.',
    steps: [
      { number: 1, title: 'الهدوء أولاً', description: 'أمّني المكان وحافظي على هدوء ملامح وجهك.' },
      { number: 2, title: 'التواصل البصري', description: 'تجنبي النظر في عينيه أو الحديث معه أثناء الصراخ (التجاهل المنظم).' },
      { number: 3, title: 'استخدام أسلوب التوجيه', description: 'لا تعطيه ما يطلبه أثناء البكاء أبداً.' },
      { number: 4, title: 'تعزيز السلوك البديل', description: 'بمجرد أن يصمت 10 ثوانٍ، امدحيه ودربيه على الطلب بهدوء.' },
    ],
  },
  {
    id: 'throwing',
    title: 'عند رمي الأشياء',
    subtitle: 'كيف نمنع السلوك ونستبدله',
    iconName: 'list',
    color: '#4DB6AC',
    audioDuration: '03:45',
    audioScript:
      'امسكي إيده بهدوء ومن غير عصبية، وقولي جملة واحدة بحزم: ممنوع الضرب، إيدي للعب الجميل. وخديه يقعد في ركن التهدئة دقيقتين بس، ولما يهدأ خليه يرجع اللعبة اللي رماها مكانها.',
    steps: [
      { number: 1, title: 'وقف السلوك بهدوء', description: 'أمسكي يده بهدوء لمنع الضربة وقولي بحزم: "ممنوع الضرب".' },
      { number: 2, title: 'ركن التهدئة', description: 'وجهيه لركن التهدئة لمدة دقيقتين فقط.' },
      { number: 3, title: 'تجنب التعزيز السلبي', description: 'لا تضربيه أبداً ولا تضحكي على سلوكه.' },
      { number: 4, title: 'التعزيز الإيجابي', description: 'بعد التهدئة، اطلبي منه إعادة ما رماه، وكافئيه عندما يلعب بلطف.' },
    ],
  },
  {
    id: 'noncompliance',
    title: 'عند عدم الاستجابة',
    subtitle: 'طرق فعالة لجذب الانتباه',
    iconName: 'psychology',
    color: '#FFC567',
    audioDuration: '04:10',
    audioScript:
      'بلاش تكرري الأمر وإنتي واقفة بعيد.. انزلي لمستوى نظره، وبدل الأمر المباشر، خيريه بين حاجتين، زي: تحب نلم اللعب الحمرا الأول ولا الزرقا؟ وامسكي إيده ساعديه في أول لعبة بس وكملي تشجيع.',
    steps: [
      { number: 1, title: 'التواصل المباشر', description: 'انزلي لمستوى نظره وأعطي أمراً واحداً قصيراً ومحدداً.' },
      { number: 2, title: 'الاختيار المقيد', description: 'استخدمي الاختيار المقيد (مثال: نجمع المكعبات الحمراء أم الزرقاء؟).' },
      { number: 3, title: 'المساعدة الجسدية', description: 'انتظري 5 ثوانٍ، ثم ساعديه جسدياً في أول خطوة فقط.' },
      { number: 4, title: 'المكافأة الفورية', description: 'كافئيه فور الاستجابة (قاعدة: أولاً ننجز المهمة، ثم نلعب).' },
    ],
  },
  {
    id: 'refusal',
    title: 'عند رفض الطعام/النوم',
    subtitle: 'بناء روتين مريح للطفل',
    iconName: 'favorite',
    color: '#FF8F7F',
    audioDuration: '03:58',
    audioScript:
      'من غير كلام ولا زعيق، خدي إيده ورجعيه بهدوء للكرسي أو السرير، وشغلي التايمر قدامه على خمس دقايق بس، ووريله صورة المكافأة أو النجمة اللي هياخدها أول ما يخلص.',
    steps: [
      { number: 1, title: 'الجدول البصري', description: 'استخدمي جدولاً بصرياً يوضح خطوات الروتين (طعام/نوم).' },
      { number: 2, title: 'الإعادة الهادئة', description: 'أعيديه لمكانه بهدوء تام دون عتاب إذا حاول الهروب.' },
      { number: 3, title: 'المؤقت البصري', description: 'استخدمي مؤقتاً بصرياً (مثلاً 5 دقائق للجلوس).' },
      { number: 4, title: 'لوحة النجوم', description: 'استخدمي لوحة النجوم لمكافأته على كل خطوة ينجزها.' },
    ],
  },
];

export const BEHAVIOR_CHIPS = ['نوبات صراخ', 'عناد', 'ضرب', 'رفض روتين'];
export const TIME_CHIPS = ['صباحاً', 'ظهراً', 'مساءً', 'قبل النوم'];
export const CAUSE_CHIPS = ['رُفض له طلب', 'طُلب منه مهمة', 'لفت انتباه', 'تعب/جوع'];
export const DURATION_CHIPS = ['أقل من 5 د', '5-15 د', 'أكثر من 15 د'];
export const RESULT_CHIPS = ['هدأ بسرعة', 'استجاب متأخراً', 'لم يستجب'];

export const COLOR_OPTIONS = [
  { label: 'بنفسجي', value: '#5B3D91' },
  { label: 'تيل', value: '#4DB6AC' },
  { label: 'أصفر', value: '#FFC567' },
  { label: 'مرجاني', value: '#FF8F7F' },
  { label: 'أزرق', value: '#42A5F5' },
  { label: 'أخضر', value: '#66BB6A' },
];

export const ICON_OPTIONS = [
  'headphones', 'list', 'psychology', 'favorite',
  'star', 'emoji-emotions', 'child-care', 'accessibility',
  'fitness-center', 'school', 'home', 'directions-run',
];
