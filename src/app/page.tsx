"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Code2,
  Cpu,
  LayoutDashboard,
  Zap,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Clock,
  Users,
  Star,
  Target,
  TrendingUp,
  Activity,
  Layers,
  GraduationCap,
  BookOpen,
} from "lucide-react"
import { motion, type Variants } from "framer-motion"

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans overflow-x-hidden selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30 selection:text-indigo-700 dark:selection:text-indigo-200 text-slate-600 dark:text-slate-200 transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-52 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-600/5 dark:bg-sky-600/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Badge className="mb-8 bg-white dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20 px-4 py-1.5 text-sm font-medium backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)] hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  Ingeniería de Sistemas UPDS
                </Badge>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]"
                variants={fadeInUp}
              >
                Potencia tu Lógica de{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Programación
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
                variants={fadeInUp}
              >
                Level UPDS es la plataforma oficial de evaluación automática para la Universidad Privada Domingo Savio.
                Resuelve ejercicios, compite en torneos y recibe feedback instantáneo en tus materias favoritas.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                variants={fadeInUp}
              >
                <Button
                  asChild
                  size="lg"
                  className="text-base h-12 px-8 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.3)] dark:shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] border border-transparent hover:scale-105 active:scale-95"
                >
                  <Link href="/register">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-8 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm transition-all shadow-sm"
                >
                  <Link href="#features">Explorar </Link>
                </Button>
              </motion.div>

              <motion.div className="mt-12 flex items-center gap-6 justify-center lg:justify-start text-sm" variants={fadeInUp}>
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>100% Práctico</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Basado en Judge0</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative flex justify-center"
              initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg aspect-square">
                <div className="relative w-full h-full rounded-[2.5rem] bg-gradient-to-br from-white via-slate-50 to-indigo-50 dark:from-white/10 dark:to-white/5 p-2 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20 border border-white/40 dark:border-white/10 backdrop-blur-2xl">
                  <div className="w-full h-full rounded-[2rem] bg-slate-50 dark:bg-slate-950/80 overflow-hidden relative border border-slate-200/50 dark:border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 mix-blend-multiply dark:mix-blend-overlay z-10 pointer-events-none" />
                    <Image
                      src="/landing/hero.png"
                      alt="Dashboard de Level UPDS"
                      width={500}
                      height={500}
                      className="object-cover w-full h-full opacity-100 dark:opacity-90 transition-opacity duration-500"
                      priority
                    />
                  </div>
                </div>

                <motion.div
                  className="absolute -top-6 -right-6 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/50 dark:border-slate-700/50 backdrop-blur-xl"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <div className="bg-amber-100 dark:bg-amber-500/20 p-2.5 rounded-xl border border-amber-200 dark:border-amber-500/20">
                    <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/50 dark:border-slate-700/50 backdrop-blur-xl"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                >
                  <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-5xl mx-auto border-t border-slate-200 dark:border-white/5 pt-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {[
              { name: "Java", label: "Soportado", src: "/svg/java.svg", bg: "bg-red-50 dark:bg-red-500/10" },
              { name: "Python", label: "Soportado", src: "/svg/python.svg", bg: "bg-blue-50 dark:bg-blue-500/10" },
              { name: "JavaScript", label: "Soportado", src: "/svg/javascript.svg", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
              {
                name: "PHP",
                label: "Soportado",
                src: "/svg/Php_light.svg",
                srcDark: "/svg/Php_dark.svg",
                bg: "bg-purple-50 dark:bg-purple-500/10"
              },
            ].map((lang, i) => (
              <motion.div key={i} variants={scaleIn} className="text-center group cursor-default">
                <div className={`w-14 h-14 rounded-2xl ${lang.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-white/5 p-3.5 shadow-sm dark:shadow-none`}>
                  {lang.srcDark ? (
                    <>
                      <Image
                        src={lang.src}
                        alt={lang.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain drop-shadow-md dark:hidden"
                      />
                      <Image
                        src={lang.srcDark}
                        alt={lang.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain drop-shadow-md hidden dark:block"
                      />
                    </>
                  ) : (
                    <Image
                      src={lang.src}
                      alt={lang.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  )}
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">{lang.name}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{lang.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CHALLENGES SECTION */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300" id="features">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20">Innovación Académica</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              Diseñado para el <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">Exito Estudiantil</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Una herramienta integral para docentes y alumnos de Ingeniería de Sistemas.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Clock,
                title: "Optimización de Tiempo",
                desc: "Olvídate de esperar días por tu calificación. El sistema evalúa tu lógica al instante.",
                stat: "Instant",
                color: "rose",
              },
              {
                icon: Target,
                title: "Feedback Preciso",
                desc: "Conoce exactamente qué casos de prueba fallaron y mejora tu código paso a paso.",
                stat: "100%",
                color: "amber",
              },
              {
                icon: TrendingUp,
                title: "Seguimiento Continuo",
                desc: "Visualiza tu progreso, promedio y actividades completadas desde tu dashboard personal.",
                stat: "Data",
                color: "indigo",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={scaleIn}>
                <Card
                  className="bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/60 transition-all duration-300 h-full backdrop-blur-sm group hover:-translate-y-1 shadow-sm hover:shadow-md dark:shadow-none"
                >
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm dark:shadow-lg relative bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20 transition-colors border border-${item.color}-200 dark:border-white/5`}
                    >
                      <item.icon className={`h-8 w-8 text-${item.color}-600 dark:text-${item.color}-500`} />
                      <div className={`absolute -top-3 -right-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-white shadow-sm`}>
                        {item.stat}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 dark:bg-indigo-600/5 rounded-full blur-[120px]" />

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Image
                  src="/landing/hero.png"
                  alt="Editor Profesional de Código"
                  width={800}
                  height={600}
                  className="object-cover opacity-100 dark:opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="block dark:hidden absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="bg-indigo-600 hover:bg-indigo-700 mb-3 shadow-lg border-none text-white">
                    Motor Judge0 Integrado
                  </Badge>
                  <p className="text-slate-700 dark:text-white font-semibold text-lg drop-shadow-sm dark:drop-shadow-lg">
                    Ejecución segura y compilación remota
                  </p>
                </div>
              </div>

              <motion.div
                className="absolute -bottom-8 -right-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700/50 backdrop-blur-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/30">
                    <Zap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      UPDS
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ingeniería de Sistemas</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">Plataforma Institucional</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                Un Entorno de Desarrollo{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  Profesional
                </span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Level UPDS implementa tecnología moderna para simular entornos de trabajo y competición reales.
                Utilizamos <strong className="text-slate-900 dark:text-slate-200">Judge0</strong> para ejecutar tu código en contenedores Docker seguros, soportando múltiples lenguajes de programación.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Multi-lenguaje: Java, Python, PHP, JavaScript",
                  "Gestión de Cursos y Actividades Académicas",
                  "Dashboard de Métricas para Docentes y Estudiantes",
                  "Seguridad y Aislamiento de Ejecución (Sandboxing)",
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{point}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.3)] dark:shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]"
              >
                <Link href="/register">
                  Crear mi Cuenta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TECH SPECS SECTION */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950 opacity-100 dark:opacity-40" />
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20">Características del Sistema</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Todo lo que necesitas para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                Aprender
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Funcionalidades pensadas para mejorar tu experiencia educativa en la UPDS.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Code2,
                title: "Editor de Código Web",
                desc: "Editor basado en tecnologías modernas con resaltado de sintaxis y autocompletado básico.",
                tech: "Monaco Editor",
              },
              {
                icon: Cpu,
                title: "Juez en Línea",
                desc: "Compilación y ejecución remota de tus soluciones con soporte para múltiples lenguajes.",
                tech: "Judge0 API",
              },
              {
                icon: BookOpen,
                title: "Gestión de Cursos",
                desc: "Organización por materias, con acceso a tareas, plazos y recursos específicos.",
                tech: "Dashboard",
              },
              {
                icon: LayoutDashboard,
                title: "Métricas de Progreso",
                desc: "Visualiza tus calificaciones, tareas pendientes y desempeño general en tiempo real.",
                tech: "Analytics",
              },
              {
                icon: Users,
                title: "Roles Definidos",
                desc: "Interfaces especializadas para Docentes (gestión) y Estudiantes (resolución).",
                tech: "Auth RBAC",
              },
              {
                icon: Layers,
                title: "Arquitectura Moderna",
                desc: "Construido con Next.js 14, garantizando velocidad y una experiencia de usuario fluida.",
                tech: "Next.js",
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 shadow-sm hover:shadow-indigo-500/10 transition-all duration-300 h-full group relative overflow-hidden backdrop-blur-md"
                >
                  <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg font-mono border-l border-b border-slate-200 dark:border-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 group-hover:bg-indigo-50 dark:group-hover:bg-transparent group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 transition-colors">
                    {feat.tech}
                  </div>
                  <CardContent className="p-6 pt-10">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/80 rounded-xl flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all">
                      <feat.icon className="h-7 w-7 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-white transition-colors">{feat.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">{feat.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300" id="demo">
        <div className="container px-4 mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-20 text-slate-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Flujo de <span className="text-indigo-600 dark:text-indigo-400">Trabajo</span>
          </motion.h2>

          <div className="relative max-w-5xl mx-auto">
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-500/50 to-indigo-200 dark:from-indigo-500/20 dark:via-indigo-500/50 dark:to-indigo-500/20" />

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { step: "1", title: "Regístrate", desc: "Crea tu cuenta con tus datos.", color: "indigo" },
                { step: "2", title: "Inscríbete", desc: "Únete a tus materias asignadas.", color: "emerald" },
                { step: "3", title: "Codifica", desc: "Resuelve los retos en el editor.", color: "sky" },
                { step: "4", title: "Califica", desc: "Obtén tu nota al instante.", color: "purple" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center group"
                  variants={scaleIn}
                >
                  <div
                    className={`w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-3xl font-bold mb-6 shadow-xl relative z-10 group-hover:-translate-y-2 transition-transform duration-300 group-hover:border-${item.color}-500/50`}
                  >
                    <span className={`text-${item.color}-500 dark:text-${item.color}-400`}>{item.step}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed max-w-[150px]">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI SECTION */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px]" />
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge className="mb-6 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">ROI Académico</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-slate-900 dark:text-white">
                Impacto Medible en{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  la Institución
                </span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Clock,
                    title: "Reducción de Carga Docente",
                    desc: "Los profesores ahorran 85% del tiempo de revisión, liberando 35+ horas mensuales.",
                    metric: "-85%",
                    color: "emerald",
                  },
                  {
                    icon: Target,
                    title: "Mejora en Rendimiento",
                    desc: "Estudiantes muestran 42% más de ejercicios completados y mejor retención.",
                    metric: "+42%",
                    color: "indigo",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Estandarización de Calidad",
                    desc: "Eliminación del 100% de disparidades por diferencias de entorno.",
                    metric: "100%",
                    color: "sky",
                  },
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-5 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className={`bg-${benefit.color}-100 dark:bg-${benefit.color}-500/10 p-4 rounded-2xl h-fit border border-${benefit.color}-200 dark:border-${benefit.color}-500/20 group-hover:scale-105 transition-transform relative shrink-0`}
                    >
                      <benefit.icon className={`h-6 w-6 text-${benefit.color}-600 dark:text-${benefit.color}-400`} />
                      <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg border border-slate-200 dark:border-slate-700">
                        {benefit.metric}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-200">{benefit.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent opacity-50 dark:from-indigo-500/10" />
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 ring-1 ring-indigo-200 dark:ring-indigo-500/30 shadow-[0_0_30px_-5px_rgba(79,70,229,0.1)] dark:shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Futuros Ingenieros</h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-xs">Preparando a la próxima generación de desarrolladores UPDS.</p>
                </div>

                {/* Decorative particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-400/50 animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-sky-400/30 animate-pulse delay-700" />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-purple-400/40 animate-pulse delay-300" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-900 dark:text-white font-semibold text-lg mb-2">Resultados Comprobados</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">500+ estudiantes mejorando sus habilidades cada semestre</p>
                  </div>
                </div>
              </div>

              {/* Stats Overlay Bubbles */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-1">98.7%</div>
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Precisión</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 opacity-90" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px]" />
        </div>

        <motion.div
          className="container px-4 mx-auto text-center relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-8 bg-white/20 text-white border-white/20 backdrop-blur-md px-6 py-2">
            Ingeniería de Sistemas
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">Únete a Level UPDS</h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            La plataforma que estabas esperando para llevar tus habilidades de programación al siguiente nivel.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg h-14 px-10 bg-white text-indigo-950 hover:bg-slate-100 shadow-2xl font-bold hover:scale-105 transition-transform"
            >
              <Link href="/register">
                Registrarse Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg h-14 px-10 border-white/20 text-white hover:bg-white/10 backdrop-blur bg-transparent"
            >
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-3xl mx-auto px-4 bg-slate-50 dark:bg-slate-950">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Preguntas Frecuentes
        </motion.h2>
        <motion.div
          className="space-y-4 "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              q: "¿Es gratuito el acceso?",
              a: "Sí, Level UPDS es una herramienta institucional de uso libre para los estudiantes y docentes de la Universidad Privada Domingo Savio.",
            },
            {
              q: "¿Qué lenguajes puedo practicar?",
              a: "La plataforma soporta nativamente Java, Python, JavaScript y PHP. Próximamente se añadirán más lenguajes según la demanda académica.",
            },
            {
              q: "¿Cómo se evalúan los ejercicios?",
              a: "Utilizamos Judge0 como motor de evaluación. Tu código se ejecuta en un contenedor seguro (Sandbox) y se compara contra casos de prueba predefinidos por el docente.",
            },
            {
              q: "¿Funciona en dispositivos móviles?",
              a: "La interfaz es responsiva y puedes consultar tus notas o tareas desde el móvil, aunque recomendamos usar una PC para la escritura de código.",
            },
          ].map((faq, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors shadow-sm dark:shadow-none">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between font-medium list-none p-6 text-slate-800 dark:text-slate-200">
                      <span className="font-semibold text-lg">{faq.q}</span>
                      <span className="transition-transform group-open:rotate-180 text-slate-500">
                        <ArrowRight className="h-5 w-5 rotate-90" />
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">{faq.a}</div>
                  </details>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="bg-white dark:bg-slate-950 text-slate-500 py-12 border-t border-slate-200 dark:border-slate-900 relative transition-colors duration-300">
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mb-6">
                Level UPDS
              </span>
              <p className="max-w-xs leading-relaxed mb-6 text-sm">
                Plataforma de Evaluación Automática. <br />
                Universidad Privada Domingo Savio.<br />
                Cochabamba - Bolivia.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Plataforma</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Iniciar Sesión</Link></li>
                <li><Link href="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Registrarse</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li>Facultad de Ingeniería</li>
                <li className="text-indigo-600 dark:text-indigo-400">upds@levelupds.edu.bo</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-900 pt-8 text-center text-xs">
            <p>© {new Date().getFullYear()} Level UPDS - Proyecto de Grado</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
