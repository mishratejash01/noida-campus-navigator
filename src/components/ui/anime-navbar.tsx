import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
}

export function AnimeNavBar({ items, className, defaultActive = "Home" }: NavBarProps) {
  const location = useLocation()
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(defaultActive)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync active tab with current URL
  useEffect(() => {
    const currentItem = items.find(item => item.url === location.pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) return null

  return (
    <div className={cn("fixed top-5 left-0 right-0 z-[50]", className)}>
      <div className="flex justify-center pt-2">
        <motion.div 
          className="flex items-center gap-3 bg-black/80 border border-white/10 backdrop-blur-xl py-2 px-2 rounded-full shadow-2xl relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            const isHovered = hoveredTab === item.name

            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={() => setActiveTab(item.name)}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300",
                  "text-white/60 hover:text-white",
                  isActive && "text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-md" />
                    <div className="absolute inset-[-4px] bg-primary/30 rounded-full blur-xl" />
                    <div className="absolute inset-[-8px] bg-primary/20 rounded-full blur-2xl" />
                    
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
                      style={{
                        animation: "shine 3s ease-in-out infinite"
                      }}
                    />
                  </motion.div>
                )}

                <motion.span
                  className="hidden md:inline-flex items-center gap-2 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Show Icon on desktop too for better look */}
                  <Icon size={16} />
                  {item.name}
                </motion.span>
                
                <motion.span 
                  className="md:hidden flex items-center justify-center relative z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} strokeWidth={2.5} />
                </motion.span>
           
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="anime-mascot"
                    className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="relative w-12 h-12">
                      <motion.div 
                        className="absolute w-10 h-10 bg-white rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        animate={
                          hoveredTab ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0],
                            transition: {
                              duration: 0.5,
                              ease: "easeInOut"
                            }
                          } : {
                            y: [0, -4, 0],
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }
                        }
                      >
                        {/* Eyes */}
                        <motion.div 
                          className="absolute w-1.5 h-2 bg-black rounded-full"
                          animate={hoveredTab ? { scaleY: [1, 0.1, 1], transition: { duration: 0.2 } } : {}}
                          style={{ left: '28%', top: '40%' }}
                        />
                        <motion.div 
                          className="absolute w-1.5 h-2 bg-black rounded-full"
                          animate={hoveredTab ? { scaleY: [1, 0.1, 1], transition: { duration: 0.2 } } : {}}
                          style={{ right: '28%', top: '40%' }}
                        />
                        
                        {/* Blush */}
                        <div className="absolute w-1.5 h-1 bg-pink-300/80 rounded-full" style={{ left: '15%', top: '55%' }} />
                        <div className="absolute w-1.5 h-1 bg-pink-300/80 rounded-full" style={{ right: '15%', top: '55%' }} />
                        
                        {/* Mouth */}
                        <motion.div 
                          className="absolute w-3 h-1.5 border-b-[1.5px] border-black/80 rounded-full"
                          animate={hoveredTab ? { scaleY: 1.5, y: -0.5 } : { scaleY: 1, y: 0 }}
                          style={{ left: '35%', top: '60%' }}
                        />

                        {/* Sparkles */}
                        <AnimatePresence>
                          {hoveredTab && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-1 -right-1 text-[10px]"
                              >
                                ✨
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ delay: 0.1 }}
                                className="absolute -top-2 left-0 text-[10px]"
                              >
                                ✨
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      
                      {/* Body/Shadow */}
                      <motion.div 
                        className="absolute -bottom-1 left-1/2 w-3 h-3 -translate-x-1/2"
                        animate={
                          hoveredTab ? {
                            y: [0, -4, 0],
                            transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" }
                          } : {
                            y: [0, 2, 0],
                            transition: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                          }
                        }
                      >
                        <div className="w-full h-full bg-white/90 rotate-45 transform origin-center rounded-sm" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
        </motion.div>
      </div>
      
      {/* Add style for shine animation */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
