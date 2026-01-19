import React, { useState, useEffect, useRef } from 'react';
import { Github, Mail, Linkedin, ExternalLink, Download, X, Menu, ArrowUpRight, Terminal, Sparkles, Zap } from 'lucide-react';

export default function Portfolio() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();

    const particles = [];
    const particleCount = 120;
    const connectionDistance = 150;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 3 + 1;
        this.hue = Math.random() * 60 + 180;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        const dx = mousePos.x - this.x;
        const dy = mousePos.y + scrollY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200;
          this.vx -= (dx / dist) * force * 0.2;
          this.vy -= (dy / dist) * force * 0.2;
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) {
          this.vx = (this.vx / speed) * 2;
          this.vy = (this.vy / speed) * 2;
        }
      }

      draw() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.fillStyle = 'rgba(5, 8, 22, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.5;
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `hsla(${p1.hue}, 100%, 60%, ${opacity})`);
            gradient.addColorStop(1, `hsla(${p2.hue}, 100%, 60%, ${opacity})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos, scrollY]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const projects = [
    {
      title: "SDZone.shop",
      subtitle: "Trading Indicator Marketplace",
      description: "Full-stack e-commerce platform for Pine Script trading indicators. Integrated Razorpay payment gateway with automated subscription management, user authentication, and TradingView API for seamless indicator delivery system.",
      tech: ["Node.js", "MongoDB", "Razorpay API", "TradingView"],
      gradient: "from-purple-600 via-pink-600 to-red-600",
      github: "https://github.com/ashishmenaria02/sdzone-marketplace",
      featured: true
    },
    {
      title: "ScheduleX",
      subtitle: "Distributed Task Scheduler",
      description: "Enterprise-grade job scheduling system with thread pools for concurrent execution. Features REST API with cron expressions, intelligent retry mechanisms with exponential backoff, and real-time monitoring dashboard.",
      tech: ["Java", "Spring Boot", "PostgreSQL", "REST API"],
      gradient: "from-cyan-600 via-blue-600 to-indigo-600",
      github: "https://github.com/ashishmenaria02/schedulex",
      featured: true
    },
    {
      title: "Money Management",
      subtitle: "Financial Portfolio Tracker",
      description: "Comprehensive financial management application with multi-wallet architecture, real-time transaction tracking, intelligent expense categorization, budget analytics, and interactive data visualizations.",
      tech: ["React", "Spring Boot", "PostgreSQL", "JWT Auth"],
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      github: "https://github.com/ashishmenaria02/money-management",
      featured: true
    }
  ];

  const miniProjects = [
    { name: "Expense Tracker API", desc: "Spring Boot REST API with CRUD operations", tech: "Spring Boot • JPA", github: "#" },
    { name: "Student Management", desc: "Entity relationship management system", tech: "Spring Boot • MySQL", github: "#" },
    { name: "Library System", desc: "Book issue/return with validations", tech: "Spring Boot • JPA", github: "#" },
    { name: "Employee Portal", desc: "Department mappings & role access", tech: "Spring Boot • Hibernate", github: "#" },
    { name: "Blog REST API", desc: "Post management with JWT auth", tech: "Spring Boot • Security", github: "#" },
    { name: "Product Inventory", desc: "Stock tracking with categories", tech: "Spring Boot • MySQL", github: "#" },
    { name: "Task Manager", desc: "Priority-based task scheduling", tech: "Spring Boot • PostgreSQL", github: "#" },
    { name: "URL Shortener", desc: "Link shortening with analytics", tech: "Spring Boot • MongoDB", github: "#" }
  ];

  const skills = [
    { category: "Backend", items: ["Java", "Spring Boot", "Spring Security", "Hibernate/JPA", "Node.js", "Express.js", "REST API", "Microservices"], color: "from-purple-500 to-pink-500" },
    { category: "Frontend", items: ["React", "JavaScript", "HTML5", "CSS3"], color: "from-cyan-500 to-blue-500" },
    { category: "Database", items: ["MongoDB", "PostgreSQL", "MySQL"], color: "from-emerald-500 to-teal-500" },
    { category: "Tools", items: ["Git", "Maven", "Postman", "IntelliJ IDEA", "VS Code"], color: "from-amber-500 to-orange-500" },
    { category: "Core", items: ["DSA", "OOP", "System Design", "Payment Integration"], color: "from-rose-500 to-red-500" }
  ];

  return (
    <div className="relative bg-[#050816] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { overflow-x: hidden; background: #050816; }
        html { background: #050816; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(5deg); }
          66% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 80px rgba(168, 85, 247, 0.8), 0 0 120px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-slide-up { animation: slide-up 0.8s ease forwards; }
        .animate-scale-in { animation: scale-in 0.6s ease forwards; }
        .float { animation: float 8s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 8s ease infinite;
        }
        
        .card-hover {
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .card-hover:hover {
          transform: translateY(-15px) rotateY(5deg) rotateX(5deg);
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full pointer-events-none z-0" />

      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="text-2xl font-black gradient-text">{'<ASHISH />'}</div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-all hover:scale-110"
              >
                {item}
              </button>
            ))}
            <a 
              href="#" 
              download
              className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-sm pulse-glow hover:scale-105 transition-transform flex items-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Download className="w-4 h-4 relative z-10 group-hover:animate-bounce" />
              <span className="relative z-10">Resume</span>
            </a>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/10">
            <div className="px-6 py-4 space-y-3">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left py-2 text-gray-300 hover:text-white font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translate(${mousePos.x / 50}px, ${mousePos.y / 50}px)`
          }}
        >
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-8 animate-scale-in">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gray-300">Available for Opportunities</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">ASHISH</span>
          </h1>

          <div className="text-3xl md:text-5xl font-bold mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Backend Developer
            </span>
          </div>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Crafting scalable backend systems with <span className="text-purple-400 font-bold">Java</span>, <span className="text-pink-400 font-bold">Spring Boot</span> & modern tech stack
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass rounded-2xl p-6 min-w-[140px]">
              <div className="text-4xl font-black gradient-text mb-2">11K+</div>
              <div className="text-sm text-gray-400 font-medium">Instagram</div>
            </div>
            <div className="glass rounded-2xl p-6 min-w-[140px]">
              <div className="text-4xl font-black gradient-text mb-2">300+</div>
              <div className="text-sm text-gray-400 font-medium">Videos</div>
            </div>
            <div className="glass rounded-2xl p-6 min-w-[140px]">
              <div className="text-4xl font-black gradient-text mb-2">CDAC</div>
              <div className="text-sm text-gray-400 font-medium">Student</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-5 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => scrollToSection('projects')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg pulse-glow hover:scale-105 transition-all flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              View Projects
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all border-2 border-cyan-400/50 text-cyan-400"
            >
              Let's Connect
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1.5 h-2 bg-white/50 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      <section id="about" className="relative py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-20 flex items-center gap-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">01.</span>
            <span>About Me</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover glass rounded-3xl p-8 hover:bg-white/5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="text-6xl mb-6 float relative z-10">🎓</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 relative z-10">Education</h3>
              <div className="space-y-6 relative z-10">
                <div className="pb-6 border-b border-white/10">
                  <div className="font-bold text-xl">PG-DAC</div>
                  <div className="text-gray-400 mt-2">CDAC Noida</div>
                  <div className="text-sm text-gray-500 mt-1">2025 - 2026</div>
                  <span className="inline-block mt-3 px-4 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full text-sm font-semibold text-green-400">
                    Current
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xl">B.Tech CSE</div>
                  <div className="text-gray-400 mt-2">Chandigarh University</div>
                  <div className="text-sm text-gray-500 mt-1">2020 - 2024</div>
                </div>
              </div>
            </div>

            <div className="card-hover glass rounded-3xl p-8 hover:bg-white/5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="text-6xl mb-6 float relative z-10" style={{ animationDelay: '1s' }}>💼</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6 relative z-10">Expertise</h3>
              <p className="text-gray-300 leading-relaxed mb-4 relative z-10">
                Specialized in building robust backend systems with payment gateway integration, distributed job scheduling, and financial application architecture.
              </p>
              <p className="text-gray-300 leading-relaxed relative z-10">
                Content creator with 11K+ Instagram community, producing educational videos on trading and technical analysis.
              </p>
            </div>

            <div className="card-hover glass rounded-3xl p-8 hover:bg-white/5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="text-6xl mb-6 float relative z-10" style={{ animationDelay: '2s' }}>🏆</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-6 relative z-10">Certifications</h3>
              <div className="space-y-3 relative z-10">
                {[
                  { title: "Mastering DSA", org: "Udemy", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" },
                  { title: "Database & SQL", org: "Coursera", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
                  { title: "Java 11 Beyond", org: "Infosys", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" }
                ].map((cert, i) => (
                  <div key={i} className={`px-4 py-3 bg-gradient-to-r ${cert.color} border rounded-xl hover:scale-105 transition-transform`}>
                    <div className="font-semibold text-sm">{cert.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{cert.org}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <a
              href="#"
              download
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl font-black text-xl overflow-hidden hover:scale-105 transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center gap-4">
                <Download className="w-6 h-6 group-hover:animate-bounce" />
                <span>Download Resume</span>
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="relative py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-20 flex items-center gap-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">02.</span>
            <span>Featured Work</span>
          </h2>

          <div className="space-y-16 mb-24">
            {projects.map((project, idx) => (
              <div 
                key={idx} 
                className="card-hover glass rounded-3xl overflow-hidden group hover:bg-white/5"
              >
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                <div className="p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-4xl font-black mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${project.gradient} transition-all">
                        {project.title}
                      </h3>
                      <div className={`text-lg font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                        {project.subtitle}
                      </div>
                    </div>
                    <div className={`p-4 bg-gradient-to-br ${project.gradient} rounded-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                      <Terminal className="w-8 h-8" />
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {project.tech.map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-5 py-2 glass rounded-full text-sm font-semibold border border-white/10 hover:border-white/30 hover:scale-105 transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 font-bold text-lg group/link"
                  >
                    <Github className="w-6 h-6" />
                    <span className={`bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                      View Source Code
                    </span>
                    <ExternalLink className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-4xl font-black mb-10 flex items-center gap-4">
              <Zap className="w-10 h-10 text-amber-500" />
              <span>Practice Projects</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {miniProjects.map((project, idx) => (
                <div 
                  key={idx} 
                  className="glass rounded-2xl p-6 hover:bg-white/5 group transition-all card-hover"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                      {project.name}
                    </h4>
                    <a 
                      href={project.github}
                      className="p-2 glass rounded-lg hover:bg-white/10 transition-all group-hover:scale-110"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-gray-400 mb-3">{project.desc}</p>
                  <div className="text-sm text-gray-500 font-mono">{project.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="relative py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-20 flex items-center gap-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">03.</span>
            <span>Tech Stack</span>
          </h2>

          <div className="space-y-8">
            {skills.map((skillSet, idx) => (
              <div key={idx} className="glass rounded-3xl p-10 hover:bg-white/5 transition-all">
                <h3 className={`text-3xl font-black mb-8 bg-gradient-to-r ${skillSet.color} bg-clip-text text-transparent`}>
                  {skillSet.category}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {skillSet.items.map((skill, i) => (
                    <span
                      key={i}
                      className="px-6 py-3 glass rounded-full font-semibold border border-white/10 hover:border-white/30 hover:scale-110 hover:-rotate-2 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative py-32 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-12 flex items-center justify-center gap-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">04.</span>
            <span>Get In Touch</span>
          </h2>

          <p className="text-2xl md:text-3xl text-gray-300 mb-16 leading-relaxed">
            Looking for a talented <span className="gradient-text font-black">Backend Developer</span>?
            <br />
            Let's build something amazing together!
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { icon: <Mail className="w-7 h-7" />, label: 'Email', link: 'mailto:ashishmenaria002@gmail.com', gradient: 'from-red-500 to-orange-500' },
              { icon: <Github className="w-7 h-7" />, label: 'GitHub', link: 'https://github.com/ashishmenaria02', gradient: 'from-gray-600 to-gray-900' },
              { icon: <Linkedin className="w-7 h-7" />, label: 'LinkedIn', link: 'https://linkedin.com/in/ashishmenaria', gradient: 'from-blue-600 to-cyan-600' }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass rounded-3xl p-8 hover:bg-white/5 transition-all card-hover flex flex-col items-center gap-5 min-w-[180px]"
              >
                <div className={`p-6 bg-gradient-to-br ${social.gradient} rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  {social.icon}
                </div>
                <span className="font-bold text-xl">{social.label}</span>
              </a>
            ))}
          </div>

          <a
            href="mailto:ashishmenaria002@gmail.com"
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-black text-xl pulse-glow hover:scale-110 transition-all"
          >
            <Mail className="w-6 h-6" />
            <span>Send Message</span>
            <ArrowUpRight className="w-6 h-6" />
          </a>

          <div className="mt-16 space-y-3 text-gray-400 text-lg">
            <p>📍 Udaipur, Rajasthan</p>
            <p>📞 +91-7014711224</p>
          </div>
        </div>
      </section>

      <footer className="relative py-12 px-6 glass border-t border-white/10 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">© 2024 Ashish Menaria • Built with 💜</p>
          <div className="flex gap-8">
            <button className="text-gray-400 hover:text-white font-semibold transition-colors">Privacy</button>
            <button className="text-gray-400 hover:text-white font-semibold transition-colors">Terms</button>
            <button className="text-gray-400 hover:text-white font-semibold transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
