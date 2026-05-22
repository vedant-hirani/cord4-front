import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { TrendingUp, Zap, PieChart, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Extraction',
    description: 'Automatically extract expense details from receipts using advanced AI',
  },
  {
    icon: PieChart,
    title: 'Smart Analytics',
    description: 'Get insights into your spending patterns with beautiful charts',
  },
  {
    icon: TrendingUp,
    title: 'Budget Tracking',
    description: 'Set and monitor budget limits for each category',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and kept private',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-white/10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold"
        >
          SpendAI
        </motion.div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="border-white text-white hover:border-blue-400 hover:text-blue-400"
          >
            Sign in
          </Button>
          <Button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 lg:px-12 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Smart Expense Tracking with{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Track your spending effortlessly. Extract receipt data with AI, visualize your finances, and take control of your budget.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 text-lg"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              View Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-12 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-300">Everything you need to master your finances</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors h-full">
                <CardBody className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg">
                      <feature.icon size={24} className="text-slate-900" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-24 bg-white/5 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to take control?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are managing their finances smarter.
          </p>
          <Button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 text-lg"
          >
            Start Your Free Account
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-white/10 text-center text-gray-400 text-sm">
        <p>&copy; 2024 SpendAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
