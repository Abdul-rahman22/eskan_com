import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AreaCard } from "@/components/AreaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Award,
  ChevronDown,
  MapPin,
  GraduationCap,
  Users,
  CalendarClock,
  MessageSquare,
  Phone as PhoneIcon,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  BadgeCheck,
  Home,
} from "lucide-react";
import { fetchAreas } from "@/api";
import { Link } from "react-router-dom";
import heroHome from "@/assets/hero-home.jpg";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AreaType = {
  id: number | string;
  // عدل الحقول هنا حسب شكل الـ area الراجع من الـ API
  name?: string;
  [key: string]: any;
};

const Index = () => {
  const [displayAreas, setDisplayAreas] = useState<AreaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const data = await fetchAreas();
        setDisplayAreas(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to load areas:", error);
        setDisplayAreas([]);
      } finally {
        setLoading(false);
      }
    };
    loadAreas();
  }, []);

  const faqs = [
    {
      question: "هل المنصة مخصصة فقط لسكن الطلاب؟",
      answer:
        "لا، المنصة توفر سكن للطلاب، العائلات، والسكن اليومي أو الأسبوعي حسب احتياجك.",
    },
    {
      question: "كيف يمكنني حجز سكن طلاب؟",
      answer:
        "تستطيع تصفح المناطق والسكن المتاح، ثم التواصل مباشرة مع المالك أو الوسيط من خلال بيانات الاتصال في صفحة العقار.",
    },
    {
      question: "هل الأسعار ثابتة أم قابلة للتفاوض؟",
      answer:
        "الأغلب قابل للتفاوض حسب المالك أو الوسيط، يمكنك التواصل معه والاتفاق على السعر النهائي.",
    },
    {
      question: "هل توجد رسوم على استخدام الموقع؟",
      answer:
        "البحث والتصفح مجاني بالكامل للمستخدمين، قد يتم احتساب رسوم خدمة على بعض الإعلانات المدفوعة.",
    },
  ];

  const advantages = [
    {
      icon: BadgeCheck,
      title: "موثوقية عالية",
      desc: "تحقق دوري من الإعلانات ومراجعة مستمرة للمحتوى.",
    },
    {
      icon: TrendingUp,
      title: "تحديث مستمر",
      desc: "إضافة عروض جديدة بشكل مستمر في مختلف المناطق.",
    },
    {
      icon: ThumbsUp,
      title: "سهولة الاستخدام",
      desc: "واجهة عربية بسيطة ومريحة للطلاب والعائلات.",
    },
    {
      icon: Users,
      title: "تنوع في السكن",
      desc: "خيارات متاحة للطلاب، العائلات، والسكن القصير المدى.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      {/* Hero Section - Animated */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden mt-16">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroHome})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 hero-gradient1" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20 pb-8">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white space-y-6 md:space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm md:text-base">
                <GraduationCap className="h-4 w-4 text-secondary" />
                <span>سكن طلاب وعائلات في الإسكندرية</span>
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              اعثر على سكنك المثالي
              <br />
              <span className="text-secondary">في الإسكندرية</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4"
              variants={fadeInUp}
            >
              سكن طلاب، سكن عائلات، وسكن يومي أو أسبوعي في أفضل مناطق
              الإسكندرية.
            </motion.p>

            {/* Search Box */}
              <div className="text-center mt-8">
                <Button asChild variant="outline" size="lg">
                  <Link to="/properties" className="text-blue-600">
                    عرض جميع المناطق
                  </Link>
                </Button>
              </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: <GraduationCap className="h-8 w-8 text-primary" />,
                title: "سكن طلاب",
                text: "مجموعة واسعة من العقارات لطلاب جامعة الإسكندرية.",
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "سكن عائلات",
                text: "شقق مناسبة للعائلات بمستويات مختلفة من الأسعار.",
              },
              {
                icon: <CalendarClock className="h-8 w-8 text-primary" />,
                title: "سكن يومي",
                text: "خيار الحجز اليومي أو الأسبوعي لإقامات قصيرة.",
              },
              {
                icon: <Award className="h-8 w-8 text-primary" />,
                title: "أفضل الأسعار",
                text: "عروض حصرية وأسعار تنافسية في السوق.",
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  text={feature.text}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
                <Award className="h-4 w-4" />
                لماذا تختار منصتنا؟
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                حل شامل لسكن الطلاب والعائلات
              </h2>
              <p className="text-muted-foreground mb-6">
                نوفر لك منصة واحدة تجمع بين سكن الطلاب، سكن العائلات، والسكن
                اليومي، مع تجربة استخدام سهلة ومريحة باللغة العربية.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advantages.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={heroHome}
                  alt="Alexandria housing"
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-6 right-6 left-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Home className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">الإسكندرية</div>
                      <div className="text-white/80 text-sm">
                        خيارات سكن متنوعة لكل الاحتياجات
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Areas Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              استكشف مناطق الإسكندرية
            </h2>
            <p className="text-muted-foreground">اختر المنطقة المفضلة لديك</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">جاري تحميل المناطق...</p>
            </div>
          ) : displayAreas.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {displayAreas.map((area) => (
                <motion.div key={area.id} variants={fadeInUp}>
                  <AreaCard area={area} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">لم تتمكن من تحميل المناطق</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/properties">عرض جميع المناطق</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10 md:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
              <MessageSquare className="h-4 w-4" />
              الأسئلة الشائعة
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              هل لديك سؤال؟
            </h2>
            <p className="text-muted-foreground">
              إليك إجابات لأكثر الأسئلة شيوعاً حول السكن في منصتنا
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-accent/20 rounded-xl px-6 border-0 shadow-sm"
                >
                  <AccordionTrigger className="text-right hover:no-underline py-5">
                    <span className="font-semibold text-base">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground mb-4">
              لم تجد إجابة لسؤالك؟
            </p>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/contact">
                <PhoneIcon className="h-4 w-4" />
                تواصل معنا
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - للوسطاء */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient1" />
        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Home className="h-12 w-12 md:h-16 md:w-16 text-white/80 mx-auto mb-4 md:mb-6" />
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
            variants={fadeInUp}
          >
            هل أنت وسيط عقاري؟
          </motion.h2>
          <motion.p
            className="text-base md:text-lg mb-6 md:mb-8 text-white/90 max-w-xl mx-auto px-4"
            variants={fadeInUp}
          >
            انضم إلى منصتنا وابدأ في عرض عقاراتك لآلاف الطلاب والعائلات في
            الإسكندرية.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
              سجل كوسيط عقاري
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 bg-transparent border-white text-white hover:bg-white/10"
            >
              <PhoneIcon className="h-4 w-4" />
              اتصل بنا
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

const FeatureCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="text-center space-y-3 bg-background rounded-2xl p-6 shadow-sm">
    <div className="inline-flex p-4 bg-primary/10 rounded-full">{icon}</div>
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);
