// src/pages/navbar/About.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.2 }
  }
};

const featureVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.04,
    y: -6,
    transition: { type: "spring", stiffness: 400, damping: 17 }
  }
};

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const differentiators = [
    {
      title: "Transparent Weighing",
      desc: "Live weighing shown on mobile app + digital receipt with photo proof",
      icon: "⚖️",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Instant Rewards",
      desc: "Points credited within seconds — redeem for vouchers, trees, cash & more",
      icon: "🎁",
      color: "from-teal-500 to-cyan-500"
    },
    {
      title: "Verified Partners",
      desc: "All collectors background-checked, trained & GPS-tracked",
      icon: "🛡️",
      color: "from-cyan-500 to-emerald-600"
    },
    {
      title: "Rajpura & Banur First",
      desc: "A focused community launch for Rajpura and Banur in Punjab",
      icon: "🏙️",
      color: "from-emerald-600 to-green-700"
    },
    {
      title: "Privacy First",
      desc: "Zero spam, no data selling — GDPR-inspired standards in India",
      icon: "🔒",
      color: "from-green-600 to-emerald-700"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
            About{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              WasteZero
            </span>
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            A community recycling platform focused on making responsible waste collection easier in Rajpura and Banur.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-emerald-100/60 rounded-full text-emerald-800 font-medium">
            <span className="text-2xl">♻️</span> Rajpura • Banur • Punjab
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-20 md:mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            We’re building India’s most trusted circular economy platform — one household at a time. 
            WasteZero connects citizens, trained collectors, verified recyclers and conscious brands 
            to transform everyday waste into real environmental and financial value.
          </p>
        </motion.div>

        {/* Differentiators Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {differentiators.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              initial="rest"
              whileHover="hover"
              className="group relative"
            >
              <motion.div
                variants={featureVariants}
                className="bg-white rounded-2xl md:rounded-3xl p-7 md:p-9 shadow-lg border border-gray-100/80 h-full flex flex-col relative overflow-hidden"
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`} />

                <div className="text-5xl md:text-6xl mb-6 text-center opacity-90 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-base leading-relaxed text-center flex-grow">
                  {item.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team & Story */}
        <motion.div
          className="mt-20 md:mt-28 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Who We Are
          </h2>

          <div className="prose prose-lg md:prose-xl text-gray-700 mx-auto leading-relaxed">
            <p>
              WasteZero is designed to help residents recycle with less friction and see how local efforts add up. The first focus is Rajpura and Banur.
            </p>

            <p className="mt-6">
              The platform brings residents, community organizations and collection partners into one place. Public rankings and map activity should reflect completed pickup records, not estimates.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {['Area rankings', 'India activity map', 'Local partners'].map((focus) => <div key={focus} className="rounded-xl border border-emerald-100 bg-white px-5 py-5 text-base font-semibold text-emerald-800">{focus}</div>)}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="mt-20 md:mt-28 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
        >
          <p className="text-xl md:text-2xl text-gray-800 font-medium mb-8">
            Join the effort to make Rajpura and Banur cleaner and more rewarding
          </p>

          <motion.a
            href="/register"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-10 py-5 md:px-14 md:py-6 text-xl md:text-2xl font-bold text-white shadow-xl shadow-emerald-200/50 hover:shadow-emerald-300/60 hover:brightness-110 transition-all duration-300"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started Today
            <span className="text-2xl md:text-3xl">→</span>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
