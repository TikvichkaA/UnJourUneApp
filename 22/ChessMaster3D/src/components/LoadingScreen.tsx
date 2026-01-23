import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Chess piece icon */}
        <motion.div
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="inline-block mb-6"
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            className="drop-shadow-lg"
          >
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFD700' }} />
                <stop offset="50%" style={{ stopColor: '#FFA500' }} />
                <stop offset="100%" style={{ stopColor: '#FFD700' }} />
              </linearGradient>
            </defs>
            <path
              d="M50 10 L50 20 M45 15 L55 15"
              stroke="url(#goldGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M35 90 L65 90 L62 80 L60 75 L60 55 L65 50 L60 45 L60 35 L55 28 L45 28 L40 35 L40 45 L35 50 L40 55 L40 75 L38 80 Z"
              fill="url(#goldGrad)"
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-display font-bold text-wood-light mb-2"
        >
          ChessMaster 3D
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-wood-accent text-sm"
        >
          Chargement...
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 200 }}
          transition={{ delay: 0.3 }}
          className="mt-6 h-1 bg-wood-dark/30 rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            animate={{
              x: [-200, 200],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-wood-medium to-transparent"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
