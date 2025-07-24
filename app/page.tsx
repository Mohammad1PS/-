"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Appointment {
  id: string
  name: string
  date: string
  tooth: string
  issue: string
  sessionType: string
  price: number
  currency: string
  duration: number
  notes: string
  status: "مؤكد" | "ملغي" | "مكتمل"
  createdAt: string
}

interface ToothData {
  number: number
  status: "healthy" | "cavity" | "treated" | "missing" | "under-treatment"
  color?: string
  issue?: string
  treatment?: string
  notes?: string
  priority?: "low" | "medium" | "high" | "urgent"
  hasIssue: boolean
  lastUpdated?: string
}

export default function DentalClinicSystem() {
  const [currentView, setCurrentView] = useState("login")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("الكل")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [teethData, setTeethData] = useState<ToothData[]>([])
  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isArabic, setIsArabic] = useState(true)
  const [doctorName, setDoctorName] = useState("")
  const [notification, setNotification] = useState("")

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments")
    const savedTeethData = localStorage.getItem("teethData")
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedLanguage = localStorage.getItem("language")

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }

    if (savedTeethData) {
      setTeethData(JSON.parse(savedTeethData))
    } else {
      // Initialize teeth data if not found
      const initialTeeth: ToothData[] = []
      for (let i = 1; i <= 32; i++) {
        initialTeeth.push({
          number: i,
          status: "healthy",
          hasIssue: false,
        })
      }
      setTeethData(initialTeeth)
    }

    if (savedDarkMode === "true") {
      setIsDarkMode(true)
    }

    if (savedLanguage === "en") {
      setIsArabic(false)
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem("teethData", JSON.stringify(teethData))
  }, [teethData])

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString())
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem("language", isArabic ? "ar" : "en")
  }, [isArabic])

  // Filter appointments
  useEffect(() => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter((apt) => apt.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (statusFilter !== "الكل") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleLogin = () => {
    setDoctorName("د. أحمد محمد")
    setCurrentView("dashboard")
    showNotification("تم تسجيل الدخول بنجاح")
  }

  const handleRegister = () => {
    setDoctorName("د. أحمد محمد")
    setCurrentView("dashboard")
    showNotification("تم إنشاء الحساب بنجاح")
  }

  const handleLogout = () => {
    setCurrentView("login")
    setDoctorName("")
    showNotification("تم تسجيل الخروج بنجاح")
  }

  const handleAddAppointment = (formData: FormData) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      tooth: formData.get("tooth") as string,
      issue: formData.get("issue") as string,
      sessionType: formData.get("sessionType") as string,
      price: Number.parseFloat(formData.get("price") as string),
      currency: formData.get("currency") as string,
      duration: Number.parseInt(formData.get("duration") as string),
      notes: (formData.get("notes") as string) || "",
      status: "مؤكد",
      createdAt: new Date().toISOString(),
    }

    setAppointments((prev) => [...prev, newAppointment])

    // Update tooth data
    const toothNumber = Number.parseInt(newAppointment.tooth)
    setTeethData((prev) =>
      prev.map((tooth) =>
        tooth.number === toothNumber
          ? {
              ...tooth,
              hasIssue: true,
              issue: newAppointment.issue,
              status: "cavity",
              lastUpdated: new Date().toISOString(),
            }
          : tooth,
      ),
    )

    showNotification("تم حفظ الجلسة بنجاح")
    setCurrentView("appointments")
  }

  const handleUpdateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)))
    showNotification(`تم تحديث حالة الجلسة إلى ${status}`)
  }

  const handleDeleteAppointment = (id: string) => {
    if (confirm(isArabic ? "هل أنت متأكد من حذف هذه الجلسة؟" : "Are you sure you want to delete this session?")) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id))
      showNotification("تم حذف الجلسة بنجاح")
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ["اسم المريض", "التاريخ", "رقم السن", "نوع الإصابة", "نوع الجلسة", "السعر", "العملة", "المدة", "الحالة"],
      ...filteredAppointments.map((apt) => [
        apt.name,
        apt.date,
        apt.tooth,
        apt.issue,
        apt.sessionType,
        apt.price.toString(),
        apt.currency,
        apt.duration.toString(),
        apt.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "appointments.csv"
    link.click()
    showNotification("تم تصدير البيانات بنجاح")
  }

  const handleToothClick = (tooth: ToothData) => {
    setSelectedTooth(tooth)
  }

  const handleSaveToothData = (toothNumber: number, data: Partial<ToothData>) => {
    setTeethData((prev) =>
      prev.map((tooth) =>
        tooth.number === toothNumber
          ? {
              ...tooth,
              ...data,
              hasIssue: !!(data.issue || data.status !== "healthy"),
              lastUpdated: new Date().toISOString(),
            }
          : tooth,
      ),
    )
    setSelectedTooth(null)
    showNotification(`تم حفظ بيانات السن رقم ${toothNumber}`)
  }

  const handleDeleteToothData = (toothNumber: number) => {
    if (
      confirm(
        isArabic
          ? `هل أنت متأكد من حذف جميع بيانات السن رقم ${toothNumber}؟`
          : `Are you sure you want to delete all data for tooth ${toothNumber}?`,
      )
    ) {
      setTeethData((prev) =>
        prev.map((tooth) =>
          tooth.number === toothNumber
            ? {
                number: toothNumber,
                status: "healthy",
                hasIssue: false,
              }
            : tooth,
        ),
      )
      setSelectedTooth(null)
      showNotification(`تم حذف بيانات السن رقم ${toothNumber}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مؤكد":
        return "status-confirmed"
      case "ملغي":
        return "status-canceled"
      case "مكتمل":
        return "status-completed"
      default:
        return "bg-gray-500"
    }
  }

  const getToothStatusClass = (tooth: ToothData) => {
    switch (tooth.status) {
      case "healthy":
        return "tooth-healthy"
      case "cavity":
        return "tooth-cavity"
      case "treated":
        return "tooth-treated"
      case "missing":
        return "tooth-missing"
      case "under-treatment":
        return "tooth-under-treatment"
      default:
        return ""
    }
  }

  const updateDashboardStats = () => {
    const totalAppointments = appointments.length
    const healthyTeeth = teethData.filter((t) => t.status === "healthy").length
    const treatedTeeth = teethData.filter((t) => t.status === "treated").length
    const problemTeeth = teethData.filter((t) => t.status === "cavity" || t.status === "under-treatment").length

    return { totalAppointments, healthyTeeth, treatedTeeth, problemTeeth }
  }

  const updateAppointmentReminders = () => {
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const todayAppointments = appointments.filter((apt) => apt.date === today && apt.status === "مؤكد")
    const tomorrowAppointments = appointments.filter((apt) => apt.date === tomorrow && apt.status === "مؤكد")

    return { todayAppointments, tomorrowAppointments }
  }

  const generateReport = () => {
    const stats = updateDashboardStats()
    const report = {
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter((apt) => apt.status === "مؤكد").length,
      completedAppointments: appointments.filter((apt) => apt.status === "مكتمل").length,
      cancelledAppointments: appointments.filter((apt) => apt.status === "ملغي").length,
      totalRevenue: appointments.reduce((sum, apt) => sum + apt.price, 0),
      teethStats: stats,
    }

    const reportContent = `
تقرير شامل للعيادة
==================

إحصائيات الجلسات:
- إجمالي الجلسات: ${report.totalAppointments}
- الجلسات المؤكدة: ${report.confirmedAppointments}
- الجلسات المكتملة: ${report.completedAppointments}
- الجلسات الملغية: ${report.cancelledAppointments}
- إجمالي الإيرادات: ${report.totalRevenue.toFixed(2)}

إحصائيات الأسنان:
- أسنان سليمة: ${stats.healthyTeeth}
- أسنان معالجة: ${stats.treatedTeeth}
- أسنان مصابة: ${stats.problemTeeth}

تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")}
    `

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "clinic-report.txt"
    link.click()
    showNotification("تم إنشاء التقرير بنجاح")
  }

  const backupData = () => {
    const backupData = {
      appointments: appointments,
      teethData: teethData,
      backupDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "clinic-backup.json"
    link.click()
    showNotification("تم إنشاء النسخة الاحتياطية بنجاح")
  }

  const resetAllTeeth = () => {
    if (
      confirm(
        isArabic
          ? "هل أنت متأكد من إعادة تعيين جميع بيانات الأسنان؟"
          : "Are you sure you want to reset all teeth data?",
      )
    ) {
      const resetTeeth: ToothData[] = []
      for (let i = 1; i <= 32; i++) {
        resetTeeth.push({
          number: i,
          status: "healthy",
          hasIssue: false,
        })
      }
      setTeethData(resetTeeth)
      showNotification("تم إعادة تعيين جميع بيانات الأسنان")
    }
  }

  const printTeethChart = () => {
    window.print()
  }

  const exportTeethData = () => {
    const csvContent = [
      ["رقم السن", "الحالة", "الإصابة", "العلاج", "الأولوية", "الملاحظات"],
      ...teethData
        .filter((tooth) => tooth.hasIssue)
        .map((tooth) => [
          tooth.number.toString(),
          tooth.status || "healthy",
          tooth.issue || "",
          tooth.treatment || "",
          tooth.priority || "low",
          tooth.notes || "",
        ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "teeth-data.csv"
    link.click()
    showNotification("تم تصدير بيانات الأسنان بنجاح")
  }

  const shareTeethChart = () => {
    if (navigator.share) {
      navigator.share({
        title: "مخطط الأسنان",
        text: "مخطط الأسنان من نظام إدارة العيادة",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showNotification("تم نسخ الرابط للحافظة")
    }
  }

  const renderTeethChart = () => (
    <div className="teeth-chart">
      {teethData.map((tooth) => (
        <div
          key={tooth.number}
          className={`tooth ${getToothStatusClass(tooth)} ${tooth.hasIssue ? "tooth-issue" : ""}`}
          style={{ backgroundColor: tooth.color }}
          onClick={() => handleToothClick(tooth)}
          data-has-issue={tooth.hasIssue}
        >
          {tooth.number}
        </div>
      ))}
    </div>
  )

  const renderTeethStats = () => {
    const stats = updateDashboardStats()
    const cavityCount = teethData.filter((t) => t.status === "cavity").length
    const missingCount = teethData.filter((t) => t.status === "missing").length

    return (
      <div className="teeth-stats">
        <div className="stat-item">
          <div className="stat-number">{stats.healthyTeeth}</div>
          <div className="stat-label">{isArabic ? "أسنان سليمة" : "Healthy Teeth"}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.treatedTeeth}</div>
          <div className="stat-label">{isArabic ? "أسنان معالجة" : "Treated Teeth"}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{cavityCount}</div>
          <div className="stat-label">{isArabic ? "أسنان مصابة" : "Cavity Teeth"}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{missingCount}</div>
          <div className="stat-label">{isArabic ? "أسنان مفقودة" : "Missing Teeth"}</div>
        </div>
      </div>
    )
  }

  const renderAppointmentReminders = () => {
    const { todayAppointments, tomorrowAppointments } = updateAppointmentReminders()

    return (
      <div className="appointment-reminders">
        {todayAppointments.length > 0 && (
          <div className="appointment-reminder">
            <i className="fa-solid fa-bell"></i>
            <span>
              {isArabic
                ? `لديك ${todayAppointments.length} جلسة اليوم`
                : `You have ${todayAppointments.length} sessions today`}
            </span>
          </div>
        )}
        {tomorrowAppointments.length > 0 && (
          <div className="appointment-reminder">
            <i className="fa-solid fa-calendar-day"></i>
            <span>
              {isArabic
                ? `لديك ${tomorrowAppointments.length} جلسة غداً`
                : `You have ${tomorrowAppointments.length} sessions tomorrow`}
            </span>
          </div>
        )}
      </div>
    )
  }

  const renderQuickActions = () => (
    <div className="quick-actions">
      <button className="quick-action-btn" onClick={() => setCurrentView("add-appointment")}>
        <i className="fa-solid fa-plus"></i> {isArabic ? "جلسة جديدة" : "New Session"}
      </button>
      <button className="quick-action-btn" onClick={() => setCurrentView("teeth-chart")}>
        <i className="fa-solid fa-teeth"></i> {isArabic ? "مخطط الأسنان" : "Teeth Chart"}
      </button>
      <button className="quick-action-btn" onClick={generateReport}>
        <i className="fa-solid fa-chart-bar"></i> {isArabic ? "تقرير شامل" : "Full Report"}
      </button>
      <button className="quick-action-btn" onClick={backupData}>
        <i className="fa-solid fa-download"></i> {isArabic ? "نسخ احتياطي" : "Backup"}
      </button>
    </div>
  )

  return (
    <div
      className={`dental-system ${isDarkMode ? "dark" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
    >
      <style jsx global>{`
        .dental-system {
          font-family: 'Tajawal', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(120deg, #dbeafe 0%, #f0f4ff 60%, #fff 100%);
          color: #222;
          transition: background 0.4s, color 0.4s;
          min-height: 100vh;
        }

        .dental-system.dark {
          background: linear-gradient(120deg, #192230 0%, #313b49 100%);
          color: #f1f1f1;
        }

        .header {
          background: linear-gradient(90deg, #0066b2 60%, #00b4d8 100%);
          color: white;
          padding: 32px 0 24px 0;
          text-align: center;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          box-shadow: 0 2px 22px rgba(0,0,0,0.14);
          border-bottom-left-radius: 36px;
          border-bottom-right-radius: 36px;
          position: relative;
        }

        .dental-system.dark .header {
          background: linear-gradient(90deg, #111a2d 60%, #1e2330 100%);
          box-shadow: 0 4px 14px rgba(255,255,255,0.10);
        }

        .header-decor {
          position: absolute;
          bottom: -34px;
          left: 50%;
          transform: translateX(-50%);
          width: 340px;
          height: 68px;
          background: linear-gradient(90deg, #00b4d8 0%, #48cae4 100%);
          opacity: 0.18;
          border-radius: 0 0 80px 80px;
          z-index: 0;
          pointer-events: none;
        }

        .dental-system.dark .header-decor {
          background: linear-gradient(90deg, #222d45 0%, #22293a 100%);
        }

        .container {
          max-width: 940px;
          margin: 36px auto;
          background: rgba(255,255,255,0.97);
          padding: 40px 40px 32px 40px;
          border-radius: 28px;
          box-shadow: 0 8px 46px 0 rgba(0, 119, 204, 0.13);
          position: relative;
          overflow: hidden;
          transition: background 0.4s, color 0.4s;
        }

        .dental-system.dark .container {
          background: linear-gradient(120deg,#22293a 60%, #282f3c 100%);
          color: #eee;
          box-shadow: 0 0 40px rgba(255,255,255,0.07);
        }

        .container::before {
          content: "";
          position: absolute;
          top: -70px;
          right: -70px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, #00b4d8 0%, #fff0 60%);
          opacity: 0.2;
          border-radius: 50%;
          pointer-events: none;
        }

        .dental-h2, .dental-h3, .dental-h4 {
          font-weight: 700;
          color: #0066b2;
          margin-bottom: 18px;
          position: relative;
          z-index: 2;
        }

        .dental-h2 {
          font-size: 2rem;
          margin-top: 0;
          margin-bottom: 30px;
          letter-spacing: 0.5px;
        }

        .dental-h3 {
          font-size: 1.25rem;
          margin-bottom: 16px;
        }

        .dental-h4 {
          font-size: 1.1rem;
          margin-bottom: 12px;
        }

        .dental-label {
          display: block;
          margin-top: 20px;
          font-weight: 600;
          font-size: 15px;
          color: #0066b2;
          letter-spacing: 0.2px;
        }

        .dental-input, .dental-select, .dental-textarea {
          width: 100%;
          padding: 14px 18px;
          margin-top: 7px;
          border: 1.5px solid #b3d1f5;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 500;
          color: #333;
          box-sizing: border-box;
          transition: border-color 0.3s, box-shadow 0.3s;
          background: #f9fbff;
          outline: none;
        }

        .dental-input:focus, .dental-select:focus, .dental-textarea:focus {
          border-color: #00b4d8;
          box-shadow: 0 0 8px #00b4d8;
        }

        .dental-system.dark .dental-input, 
        .dental-system.dark .dental-select, 
        .dental-system.dark .dental-textarea {
          background: #22293a;
          border-color: #444;
          color: #eee;
        }

        .dental-system.dark .dental-input:focus, 
        .dental-system.dark .dental-select:focus, 
        .dental-system.dark .dental-textarea:focus {
          border-color: #3399ff;
          box-shadow: 0 0 12px #3399ff;
        }

        .dental-button {
          margin-top: 36px;
          width: 100%;
          background: linear-gradient(90deg, #00b4d8 0%, #0066b2 100%);
          color: white;
          padding: 16px 0;
          border: none;
          border-radius: 18px;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 18px rgba(0, 180, 216, 0.18);
          position: relative;
          overflow: hidden;
          z-index: 2;
        }

        .dental-button:hover {
          background: linear-gradient(90deg, #0096c7 0%, #023e8a 100%);
          box-shadow: 0 6px 20px rgba(2, 62, 138, 0.16);
        }

        .dental-system.dark .dental-button {
          box-shadow: 0 4px 12px rgba(51,153,255,0.14);
          background: linear-gradient(90deg, #1e2330 0%, #222d45 100%);
          color: #ffd43b;
        }

        .dental-system.dark .dental-button:hover {
          background: linear-gradient(90deg, #222d45 0%, #1a6fde 100%);
          box-shadow: 0 6px 18px rgba(26,111,222,0.22);
          color: #fff;
        }

        .nav {
          display: flex;
          justify-content: center;
          gap: 28px;
          margin: 32px 0 18px 0;
          flex-wrap: wrap;
          z-index: 2;
        }

        .nav .dental-button {
          width: auto;
          padding: 14px 36px;
          font-size: 1rem;
          border-radius: 16px;
          box-shadow: 0 4px 10px rgba(0, 180, 216, 0.18);
          margin: 0;
        }

        .teeth-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin: 20px 0;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
        }

        .dental-system.dark .teeth-stats {
          background: linear-gradient(135deg, #22293a 0%, #282f3c 100%);
        }

        .stat-item {
          text-align: center;
          padding: 15px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .dental-system.dark .stat-item {
          background: #2d3748;
          color: #e2e8f0;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0066b2;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          margin-top: 5px;
        }

        .appointment-reminders {
          margin: 20px 0;
        }

        .appointment-reminder {
          background: linear-gradient(90deg, #17a2b8 0%, #138496 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          margin: 15px 0;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quick-actions {
          display: flex;
          gap: 10px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .quick-action-btn {
          padding: 10px 20px;
          background: linear-gradient(90deg, #6f42c1 0%, #5a32a3 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
          margin: 0;
          width: auto;
        }

        .quick-action-btn:hover {
          background: linear-gradient(90deg, #5a32a3 0%, #6f42c1 100%);
          transform: translateY(-2px);
        }

        .appointment-list {
          margin-top: 27px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
          gap: 20px;
        }

        .appointment {
          background: linear-gradient(104deg, #e8f0fe 0%, #f1f8ff 100%);
          padding: 20px 24px;
          border-radius: 18px;
          border: 1.5px solid #b3d1f5;
          box-shadow: 0 4px 24px rgba(0,180,216,0.09);
          position: relative;
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: pointer;
          z-index: 2;
        }

        .appointment:hover {
          background: linear-gradient(104deg, #d1eaff 0%, #eaf8ff 100%);
          box-shadow: 0 10px 32px rgba(0, 180, 216, 0.16);
          border-color: #00b4d8;
        }

        .dental-system.dark .appointment {
          background: linear-gradient(104deg, #22293a 0%, #282f3c 100%);
          border-color: #444;
          box-shadow: 0 2px 10px rgba(0,0,0,0.13);
          color: #eee;
        }

        .dental-system.dark .appointment:hover {
          background: linear-gradient(104deg, #282f3c 0%, #222d45 100%);
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
        }

        .appointment strong {
          color: #0077cc;
          font-size: 1.1em;
          font-weight: 700;
        }

        .status-label {
          margin-right: 6px;
          margin-left: 6px;
          font-size: 15px;
          padding: 4px 18px;
          border-radius: 16px;
          font-weight: 700;
          color: white;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          letter-spacing: 0.5px;
        }

        .status-confirmed { 
          background: linear-gradient(90deg,#43ea6b 60%,#28a745 100%);
        }
        .status-canceled { 
          background: linear-gradient(90deg,#ff6161 60%,#dc3545 100%);
        }
        .status-completed { 
          background: linear-gradient(90deg,#fdc96e 60%,#fd7e14 100%);
        }

        .dental-system.dark .status-confirmed { 
          background: linear-gradient(90deg,#56c257 60%,#43ea6b 100%);
        }
        .dental-system.dark .status-canceled { 
          background: linear-gradient(90deg,#ff6161 60%,#dc3545 100%);
        }
        .dental-system.dark .status-completed { 
          background: linear-gradient(90deg,#ffa236 60%,#fdc96e 100%);
        }

        .appointment .btns {
          margin-top: 15px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .appointment .dental-button {
          width: auto;
          min-width: 90px;
          margin: 0;
          padding: 8px 18px;
          font-size: 14px;
          border-radius: 10px;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0,0,0,0.07);
          transition: background 0.3s;
        }

        .appointment .dental-button:hover {
          background: linear-gradient(90deg,#023e8a,#00b4d8);
          color: white;
        }

        .appointment .delete-btn {
          background: linear-gradient(90deg,#ff6161 60%,#dc3545 100%);
          color: white;
          font-weight: 700;
        }

        .appointment .delete-btn:hover {
          background: linear-gradient(90deg,#dc3545,#ff6161);
        }

        .notification {
          position: fixed;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(90deg,#0066b2 60%,#00b4d8 100%);
          color: #fff;
          padding: 20px 38px;
          border-radius: 32px;
          z-index: 1000;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 0 30px rgba(0,0,0,0.28);
          user-select: none;
          letter-spacing: 0.8px;
          animation: fade-in 0.6s;
        }

        .dental-system.dark .notification {
          background: linear-gradient(90deg,#222d45 60%,#22293a 100%);
          color: #aad4ff;
          box-shadow: 0 0 30px rgba(170,212,255,0.15);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-25px) translateX(-50%);}
          to { opacity: 1; transform: translateY(0) translateX(-50%);}
        }

        .back-btn {
          margin-top: 26px;
          background: linear-gradient(90deg, #555 70%, #777 100%);
          color: white;
          padding: 13px 34px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          width: auto;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.11);
          transition: background 0.3s;
        }

        .back-btn:hover {
          background: linear-gradient(90deg, #333 70%, #555 100%);
        }

        .dental-system.dark .back-btn {
          background: linear-gradient(90deg, #444 70%, #666 100%);
          box-shadow: 0 3px 8px rgba(255,255,255,0.09);
        }

        .dental-system.dark .back-btn:hover {
          background: linear-gradient(90deg, #666 70%, #444 100%);
        }

        .teeth-chart {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 390px;
          margin-left: auto;
          margin-right: auto;
          gap: 13px;
          user-select: none;
          background: #f4f8fa;
          border-radius: 22px;
          padding: 18px 0;
          box-shadow: 0 2px 18px rgba(0, 180, 216, 0.08);
        }

        .dental-system.dark .teeth-chart {
          background: linear-gradient(135deg, #22293a 0%, #282f3c 100%);
        }

        .tooth {
          width: 38px;
          height: 38px;
          border: 2px solid #b3d1f5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          transition: background 0.3s, border-color 0.3s;
          box-shadow: 0 1px 6px transparent;
          background: white;
        }

        .dental-system.dark .tooth {
          background: #2d3748;
          color: #e2e8f0;
          border-color: #4a5568;
        }

        .tooth:hover {
          border-color: #00b4d8;
          box-shadow: 0 0 14px #00b4d8;
        }

        .tooth-healthy {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-color: #b3d1f5;
          color: #0066b2;
        }

        .tooth-cavity {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          border-color: #dc3545;
          color: #721c24;
        }

        .tooth-treated {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border-color: #28a745;
          color: #155724;
        }

        .tooth-missing {
          background: linear-gradient(135deg, #e2e3e5 0%, #d6d8db 100%);
          border-color: #6c757d;
          color: #495057;
          opacity: 0.6;
        }

        .tooth-under-treatment {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          border-color: #ffc107;
          color: #856404;
        }

        .tooth-issue {
          border-width: 2.5px;
          box-shadow: 0 0 10px #fd7e14;
        }

        .tooth[data-has-issue="true"]::after {
          content: "⚠";
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 16px;
          color: #dc3545;
          font-weight: 900;
          text-shadow: 0 0 4px #fff;
          background: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #dc3545;
        }

        .teeth-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid #ccc;
        }

        .mode-toggle {
          position: fixed;
          top: 18px;
          left: 18px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(120deg,#ffd43b 60%, #fffbe8 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(255, 212, 59, 0.18);
          transition: background 0.4s, box-shadow 0.4s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: #333;
          user-select: none;
          z-index: 1500;
          outline: none;
        }

        .mode-toggle.dark {
          background: linear-gradient(120deg,#222d45 60%, #22293a 100%);
          box-shadow: 0 3px 12px rgba(255, 255, 255, 0.22);
          color: #ffd43b;
        }

        .language-toggle {
          position: fixed;
          bottom: 22px;
          right: 24px;
          padding: 13px 22px;
          background: linear-gradient(90deg, #00b4d8 60%, #0066b2 100%);
          color: white;
          font-weight: 700;
          font-size: 16px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0, 119, 204, 0.08);
          transition: background 0.3s;
          z-index: 1500;
          user-select: none;
          outline: none;
        }

        .language-toggle:hover {
          background: linear-gradient(90deg, #0066b2 60%, #00b4d8 100%);
        }

        .export-btn {
          margin-top: 14px;
          background: linear-gradient(90deg,#43ea6b 60%,#28a745 100%);
          border: none;
          padding: 14px 32px;
          border-radius: 18px;
          color: white;
          font-size: 18px;
          cursor: pointer;
          font-weight: 700;
          transition: background 0.3s;
          box-shadow: 0 5px 18px rgba(40, 167, 69, 0.18);
          margin-right: 12px;
        }

        .export-btn:hover {
          background: linear-gradient(90deg,#1e7e34,#43ea6b);
          box-shadow: 0 6px 22px rgba(30, 126, 52, 0.26);
        }

        .filter-status {
          margin-top: 14px;
          width: 220px;
          padding: 14px 18px;
          font-size: 16px;
          border-radius: 16px;
          border: 1.8px solid #b3d1f5;
          font-weight: 600;
          box-sizing: border-box;
          transition: border-color 0.3s;
          background: #f9fbff;
        }

        .filter-status:focus {
          border-color: #00b4d8;
          box-shadow: 0 0 12px #00b4d8;
          outline: none;
        }

        .search-input {
          padding: 10px;
          width: 300px;
          border-radius: 14px;
          border: 1.5px solid #b3d1f5;
          margin-bottom: 12px;
          font-size: 16px;
          background: #f9fbff;
        }

        .search-input:focus {
          border-color: #00b4d8;
          box-shadow: 0 0 8px #00b4d8;
          outline: none;
        }

        .hidden {
          display: none !important;
        }

        @media (max-width: 700px) {
          .container {
            margin: 20px 9px;
            padding: 25px 10px;
          }
          .nav {
            gap: 12px;
          }
          .appointment-list {
            grid-template-columns: 1fr;
          }
          .appointment .dental-button {
            font-size: 13px;
            padding: 7px 10px;
          }
          .dental-button, .export-btn, .language-toggle {
            font-size: 15px;
          }
          .teeth-chart {
            max-width: 100%;
            gap: 10px;
          }
          .header {
            font-size: 1.2rem;
            padding: 18px 0;
          }
          .teeth-legend {
            gap: 10px;
          }
          .legend-item {
            font-size: 12px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        {isArabic ? "نظام إدارة العيادة - تسجيل دخول الدكتور" : "Clinic Management System - Doctor Login"}
        <div className="header-decor"></div>
      </header>

      {/* Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`mode-toggle ${isDarkMode ? "dark" : ""}`}
        aria-label="تبديل الوضع"
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M21 12.79A9 9 0 0112.21 3a7 7 0 009.52 9.52z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </svg>
        )}
      </button>

      {/* Language Toggle */}
      <button onClick={() => setIsArabic(!isArabic)} className="language-toggle" aria-label="تبديل اللغة">
        {isArabic ? "English" : "العربية"}
      </button>

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      <div className="container">
        {/* Login View */}
        {currentView === "login" && (
          <div>
            <h2 className="dental-h2">
              <i className="fa-solid fa-user-doctor"></i> {isArabic ? "تسجيل دخول الدكتور" : "Doctor Login"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin()
              }}
            >
              <div>
                <label className="dental-label" htmlFor="loginEmail">
                  <i className="fa-regular fa-envelope"></i> {isArabic ? "البريد الإلكتروني" : "Email"}
                </label>
                <input className="dental-input" id="loginEmail" type="email" placeholder="example@mail.com" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="loginPass">
                  <i className="fa-solid fa-key"></i> {isArabic ? "كلمة المرور" : "Password"}
                </label>
                <input className="dental-input" id="loginPass" type="password" placeholder="••••••••" required />
              </div>

              <button type="submit" className="dental-button">
                <i className="fa-solid fa-sign-in-alt"></i> {isArabic ? "دخول" : "Login"}
              </button>
            </form>

            <p style={{ marginTop: "14px", fontSize: "14px", color: "#555" }}>
              {isArabic ? "لا تملك حساب؟" : "Don't have an account?"}{" "}
              <button
                onClick={() => setCurrentView("register")}
                style={{ background: "none", border: "none", color: "#0077cc", fontWeight: 700, cursor: "pointer" }}
              >
                {isArabic ? "تسجيل جديد" : "Register"} <i className="fa-regular fa-user"></i>
              </button>
            </p>
          </div>
        )}

        {/* Register View */}
        {currentView === "register" && (
          <div>
            <h2 className="dental-h2">
              <i className="fa-solid fa-user-plus"></i>{" "}
              {isArabic ? "تسجيل حساب دكتور جديد" : "Create New Doctor Account"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRegister()
              }}
            >
              <div>
                <label className="dental-label" htmlFor="registerName">
                  <i className="fa-solid fa-signature"></i> {isArabic ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  className="dental-input"
                  id="registerName"
                  type="text"
                  placeholder={isArabic ? "الاسم الكامل" : "Full Name"}
                  required
                />
              </div>

              <div>
                <label className="dental-label" htmlFor="registerEmail">
                  <i className="fa-regular fa-envelope"></i> {isArabic ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  className="dental-input"
                  id="registerEmail"
                  type="email"
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div>
                <label className="dental-label" htmlFor="registerPass">
                  <i className="fa-solid fa-key"></i> {isArabic ? "كلمة المرور" : "Password"}
                </label>
                <input className="dental-input" id="registerPass" type="password" placeholder="••••••••" required />
              </div>

              <button type="submit" className="dental-button">
                <i className="fa-solid fa-user-plus"></i> {isArabic ? "تسجيل حساب" : "Create Account"}
              </button>
            </form>

            <p style={{ marginTop: "14px", fontSize: "14px", color: "#555" }}>
              {isArabic ? "لديك حساب؟" : "Have an account?"}{" "}
              <button
                onClick={() => setCurrentView("login")}
                style={{ background: "none", border: "none", color: "#0077cc", fontWeight: 700, cursor: "pointer" }}
              >
                {isArabic ? "تسجيل دخول" : "Login"} <i className="fa-solid fa-sign-in-alt"></i>
              </button>
            </p>
          </div>
        )}

        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <div>
            <h2 className="dental-h2">
              <i className="fa-solid fa-chart-line"></i> {isArabic ? "لوحة تحكم الدكتور" : "Doctor Dashboard"}
            </h2>

            <button
              onClick={handleLogout}
              style={{
                background: "linear-gradient(90deg,#ff6161,#dc3545)",
                width: "auto",
                padding: "12px 28px",
                marginBottom: "18px",
                borderRadius: "14px",
                boxShadow: "0 4px 12px rgba(220, 53, 69, 0.14)",
                border: "none",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-sign-out-alt"></i> {isArabic ? "تسجيل خروج" : "Logout"}
            </button>

            {/* Dashboard Stats */}
            {renderTeethStats()}

            {/* Appointment Reminders */}
            {renderAppointmentReminders()}

            {/* Quick Actions */}
            {renderQuickActions()}

            <div className="nav">
              <button className="dental-button" onClick={() => setCurrentView("add-appointment")}>
                <i className="fa-solid fa-plus"></i> {isArabic ? "إضافة جلسة جديدة" : "Add New Session"}
              </button>
              <button className="dental-button" onClick={() => setCurrentView("appointments")}>
                <i className="fa-solid fa-list"></i> {isArabic ? "عرض الجلسات" : "View Sessions"}
              </button>
              <button className="dental-button" onClick={() => setCurrentView("teeth-chart")}>
                <i className="fa-solid fa-teeth"></i> {isArabic ? "مخطط الأسنان" : "Teeth Chart"}
              </button>
            </div>
          </div>
        )}

        {/* Add Appointment View */}
        {currentView === "add-appointment" && (
          <div>
            <h3 className="dental-h3">
              <i className="fa-solid fa-notes-medical"></i>{" "}
              {isArabic ? "تسجيل جلسة علاجية" : "Register Treatment Session"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAddAppointment(formData)
              }}
            >
              <div>
                <label className="dental-label" htmlFor="name">
                  <i className="fa-solid fa-user"></i> {isArabic ? "اسم المريض" : "Patient Name"}
                </label>
                <input className="dental-input" id="name" name="name" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="date">
                  <i className="fa-solid fa-calendar-day"></i> {isArabic ? "تاريخ الجلسة" : "Session Date"}
                </label>
                <input className="dental-input" id="date" name="date" type="date" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="tooth">
                  <i className="fa-solid fa-tooth"></i> {isArabic ? "رقم السن المصاب" : "Affected Tooth Number"}
                </label>
                <select className="dental-select" id="tooth" name="tooth" required>
                  <option value="" disabled>
                    {isArabic ? "اختر رقم السن" : "Select tooth number"}
                  </option>
                  {Array.from({ length: 32 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="dental-label" htmlFor="issue">
                  <i className="fa-solid fa-exclamation-triangle"></i> {isArabic ? "نوع الإصابة" : "Issue Type"}
                </label>
                <input className="dental-input" id="issue" name="issue" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="sessionType">
                  <i className="fa-solid fa-stethoscope"></i> {isArabic ? "نوع الجلسة" : "Session Type"}
                </label>
                <input className="dental-input" id="sessionType" name="sessionType" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="price">
                  <i className="fa-solid fa-money-bill-wave"></i> {isArabic ? "سعر الجلسة" : "Session Price"}
                </label>
                <input className="dental-input" id="price" name="price" type="number" min="0" step="0.01" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="currency">
                  <i className="fa-solid fa-coins"></i> {isArabic ? "العملة" : "Currency"}
                </label>
                <select className="dental-select" id="currency" name="currency" required>
                  <option value="ILS">ILS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="dental-label" htmlFor="duration">
                  <i className="fa-solid fa-clock"></i>{" "}
                  {isArabic ? "مدة الجلسة (بالدقائق)" : "Session Duration (minutes)"}
                </label>
                <input className="dental-input" id="duration" name="duration" type="number" min="5" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="notes">
                  <i className="fa-solid fa-comment-dots"></i> {isArabic ? "ملاحظات إضافية" : "Additional Notes"}
                </label>
                <textarea className="dental-textarea" id="notes" name="notes" rows={3}></textarea>
              </div>

              <button type="submit" className="dental-button">
                <i className="fa-solid fa-save"></i> {isArabic ? "حفظ الجلسة" : "Save Session"}
              </button>
            </form>

            <button onClick={() => setCurrentView("dashboard")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {isArabic ? "عودة" : "Back"}
            </button>
          </div>
        )}

        {/* Appointments List View */}
        {currentView === "appointments" && (
          <div>
            <h3 className="dental-h3">
              <i className="fa-solid fa-list-ul"></i> {isArabic ? "قائمة الجلسات" : "Sessions List"}
            </h3>

            <input
              type="text"
              className="search-input"
              placeholder={isArabic ? "ابحث بالاسم..." : "Search by name..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="فلترة الحالة"
            >
              <option>{isArabic ? "الكل" : "All"}</option>
              <option>{isArabic ? "مؤكد" : "Confirmed"}</option>
              <option>{isArabic ? "ملغي" : "Cancelled"}</option>
              <option>{isArabic ? "مكتمل" : "Completed"}</option>
            </select>

            <button onClick={handleExportCSV} className="export-btn" aria-label="تصدير الجلسات">
              <i className="fa-solid fa-file-export"></i> {isArabic ? "تصدير CSV" : "Export CSV"}
            </button>

            <div className="appointment-list">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment">
                  <strong>{appointment.name}</strong>
                  <span className={`status-label ${getStatusColor(appointment.status)}`}>{appointment.status}</span>
                  <p>
                    <i className="fa-solid fa-calendar"></i> {appointment.date}
                  </p>
                  <p>
                    <i className="fa-solid fa-tooth"></i> {isArabic ? "السن رقم" : "Tooth"} {appointment.tooth}
                  </p>
                  <p>
                    <i className="fa-solid fa-exclamation-triangle"></i> {appointment.issue}
                  </p>
                  <p>
                    <i className="fa-solid fa-stethoscope"></i> {appointment.sessionType}
                  </p>
                  <p>
                    <i className="fa-solid fa-money-bill-wave"></i> {appointment.price} {appointment.currency}
                  </p>
                  <p>
                    <i className="fa-solid fa-clock"></i> {appointment.duration} {isArabic ? "دقيقة" : "minutes"}
                  </p>
                  {appointment.notes && (
                    <p>
                      <i className="fa-solid fa-comment-dots"></i> {appointment.notes}
                    </p>
                  )}

                  <div className="btns">
                    <button
                      className="dental-button"
                      onClick={() => {
                        setSelectedAppointment(appointment)
                        setCurrentView("appointment-details")
                      }}
                    >
                      <i className="fa-solid fa-eye"></i> {isArabic ? "عرض" : "View"}
                    </button>
                    <button className="dental-button" onClick={() => setEditingAppointment(appointment)}>
                      <i className="fa-solid fa-edit"></i> {isArabic ? "تعديل الحالة" : "Edit Status"}
                    </button>
                    <button
                      className="dental-button delete-btn"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <i className="fa-solid fa-trash"></i> {isArabic ? "حذف" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setCurrentView("dashboard")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {isArabic ? "عودة" : "Back"}
            </button>
          </div>
        )}

        {/* Appointment Details View */}
        {currentView === "appointment-details" && selectedAppointment && (
          <div>
            <button onClick={() => setCurrentView("appointments")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {isArabic ? "عودة لقائمة الجلسات" : "Back to Sessions"}
            </button>

            <h3 className="dental-h3">
              <i className="fa-solid fa-file-medical"></i> {isArabic ? "تفاصيل الجلسة" : "Session Details"}
            </h3>

            <div style={{ lineHeight: "1.6", fontSize: "17px" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  padding: "20px",
                  borderRadius: "16px",
                  margin: "20px 0",
                }}
              >
                <h4>
                  <i className="fa-solid fa-user"></i> {isArabic ? "معلومات المريض" : "Patient Information"}
                </h4>
                <p>
                  <strong>{isArabic ? "الاسم:" : "Name:"}</strong> {selectedAppointment.name}
                </p>
                <p>
                  <strong>{isArabic ? "التاريخ:" : "Date:"}</strong> {selectedAppointment.date}
                </p>
                <p>
                  <strong>{isArabic ? "رقم السن:" : "Tooth Number:"}</strong> {selectedAppointment.tooth}
                </p>
                <p>
                  <strong>{isArabic ? "نوع الإصابة:" : "Issue Type:"}</strong> {selectedAppointment.issue}
                </p>
                <p>
                  <strong>{isArabic ? "نوع الجلسة:" : "Session Type:"}</strong> {selectedAppointment.sessionType}
                </p>
                <p>
                  <strong>{isArabic ? "السعر:" : "Price:"}</strong> {selectedAppointment.price}{" "}
                  {selectedAppointment.currency}
                </p>
                <p>
                  <strong>{isArabic ? "المدة:" : "Duration:"}</strong> {selectedAppointment.duration}{" "}
                  {isArabic ? "دقيقة" : "minutes"}
                </p>
                <p>
                  <strong>{isArabic ? "الحالة:" : "Status:"}</strong>{" "}
                  <span className={`status-label ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </p>
                {selectedAppointment.notes && (
                  <p>
                    <strong>{isArabic ? "الملاحظات:" : "Notes:"}</strong> {selectedAppointment.notes}
                  </p>
                )}
              </div>
            </div>

            <h4 style={{ marginTop: "25px", textAlign: "center" }}>
              <i className="fa-solid fa-teeth"></i> {isArabic ? "مخطط الأسنان التفاعلي" : "Interactive Teeth Chart"}
            </h4>
            {renderTeethChart()}
          </div>
        )}

        {/* Teeth Chart Page */}
        {currentView === "teeth-chart" && (
          <div>
            <button onClick={() => setCurrentView("dashboard")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {isArabic ? "عودة للوحة التحكم" : "Back to Dashboard"}
            </button>

            <h3 className="dental-h3" style={{ textAlign: "center" }}>
              <i className="fa-solid fa-teeth"></i>{" "}
              {isArabic ? "مخطط الأسنان التفاعلي المتقدم" : "Advanced Interactive Teeth Chart"}
            </h3>

            {/* Teeth Legend */}
            <div className="teeth-legend">
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", borderColor: "#b3d1f5" }}
                ></div>
                <span>{isArabic ? "سليم" : "Healthy"}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)", borderColor: "#28a745" }}
                ></div>
                <span>{isArabic ? "معالج" : "Treated"}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)", borderColor: "#dc3545" }}
                ></div>
                <span>{isArabic ? "مصاب" : "Cavity"}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)", borderColor: "#ffc107" }}
                ></div>
                <span>{isArabic ? "تحت العلاج" : "Under Treatment"}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #e2e3e5 0%, #d6d8db 100%)", borderColor: "#6c757d" }}
                ></div>
                <span>{isArabic ? "مفقود" : "Missing"}</span>
              </div>
            </div>

            {/* Teeth Chart */}
            {renderTeethChart()}

            {/* Teeth Statistics */}
            {renderTeethStats()}

            {/* Additional Tools */}
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={resetAllTeeth}>
                <i className="fa-solid fa-refresh"></i> {isArabic ? "إعادة تعيين الكل" : "Reset All"}
              </button>
              <button className="quick-action-btn" onClick={printTeethChart}>
                <i className="fa-solid fa-print"></i> {isArabic ? "طباعة المخطط" : "Print Chart"}
              </button>
              <button className="quick-action-btn" onClick={exportTeethData}>
                <i className="fa-solid fa-download"></i> {isArabic ? "تصدير البيانات" : "Export Data"}
              </button>
              <button className="quick-action-btn" onClick={shareTeethChart}>
                <i className="fa-solid fa-share"></i> {isArabic ? "مشاركة" : "Share"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tooth Edit Modal */}
      <Dialog open={!!selectedTooth} onOpenChange={() => setSelectedTooth(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isArabic ? `تعديل حالة السن رقم ${selectedTooth?.number}` : `Edit Tooth ${selectedTooth?.number} Status`}
            </DialogTitle>
          </DialogHeader>

          {selectedTooth && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="toothStatus">{isArabic ? "حالة السن" : "Tooth Status"}</Label>
                <select id="toothStatus" className="dental-select" defaultValue={selectedTooth.status}>
                  <option value="healthy">{isArabic ? "سليم" : "Healthy"}</option>
                  <option value="treated">{isArabic ? "معالج" : "Treated"}</option>
                  <option value="cavity">{isArabic ? "مصاب" : "Cavity"}</option>
                  <option value="under-treatment">{isArabic ? "تحت العلاج" : "Under Treatment"}</option>
                  <option value="missing">{isArabic ? "مفقود" : "Missing"}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="toothColor">{isArabic ? "لون مخصص (اختياري)" : "Custom Color (Optional)"}</Label>
                <Input id="toothColor" type="color" defaultValue={selectedTooth.color || "#ffffff"} />
              </div>

              <div>
                <Label htmlFor="toothIssue">{isArabic ? "نوع الإصابة" : "Issue Type"}</Label>
                <Input
                  id="toothIssue"
                  defaultValue={selectedTooth.issue || ""}
                  placeholder={isArabic ? "مثلاً: تسوس، كسر، التهاب اللثة" : "e.g: cavity, fracture, gingivitis"}
                />
              </div>

              <div>
                <Label htmlFor="toothTreatment">{isArabic ? "العلاج المطلوب" : "Required Treatment"}</Label>
                <Input
                  id="toothTreatment"
                  defaultValue={selectedTooth.treatment || ""}
                  placeholder={isArabic ? "مثلاً: حشو، تنظيف، قلع" : "e.g: filling, cleaning, extraction"}
                />
              </div>

              <div>
                <Label htmlFor="toothNotes">{isArabic ? "ملاحظات إضافية" : "Additional Notes"}</Label>
                <Textarea
                  id="toothNotes"
                  defaultValue={selectedTooth.notes || ""}
                  rows={3}
                  placeholder={isArabic ? "ملاحظات خاصة بهذا السن" : "Special notes for this tooth"}
                />
              </div>

              <div>
                <Label htmlFor="toothPriority">{isArabic ? "أولوية العلاج" : "Treatment Priority"}</Label>
                <select id="toothPriority" className="dental-select" defaultValue={selectedTooth.priority || "low"}>
                  <option value="low">{isArabic ? "منخفضة" : "Low"}</option>
                  <option value="medium">{isArabic ? "متوسطة" : "Medium"}</option>
                  <option value="high">{isArabic ? "عالية" : "High"}</option>
                  <option value="urgent">{isArabic ? "عاجلة" : "Urgent"}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const status = (document.getElementById("toothStatus") as HTMLSelectElement)
                      ?.value as ToothData["status"]
                    const color = (document.getElementById("toothColor") as HTMLInputElement)?.value
                    const issue = (document.getElementById("toothIssue") as HTMLInputElement)?.value
                    const treatment = (document.getElementById("toothTreatment") as HTMLInputElement)?.value
                    const notes = (document.getElementById("toothNotes") as HTMLTextAreaElement)?.value
                    const priority = (document.getElementById("toothPriority") as HTMLSelectElement)
                      ?.value as ToothData["priority"]

                    handleSaveToothData(selectedTooth.number, {
                      status,
                      color: color !== "#ffffff" ? color : undefined,
                      issue: issue || undefined,
                      treatment: treatment || undefined,
                      notes: notes || undefined,
                      priority,
                    })
                  }}
                  className="flex-1"
                >
                  <i className="fa-solid fa-save"></i> {isArabic ? "حفظ" : "Save"}
                </Button>

                <Button
                  onClick={() => handleDeleteToothData(selectedTooth.number)}
                  variant="destructive"
                  className="flex-1"
                >
                  <i className="fa-solid fa-trash"></i> {isArabic ? "حذف البيانات" : "Delete Data"}
                </Button>

                <Button onClick={() => setSelectedTooth(null)} variant="outline" className="flex-1">
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isArabic ? "تحديث حالة الجلسة" : "Update Session Status"}</DialogTitle>
          </DialogHeader>

          {editingAppointment && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isArabic ? "المريض:" : "Patient:"} <strong>{editingAppointment.name}</strong>
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleUpdateAppointmentStatus(editingAppointment.id, "مؤكد")
                    setEditingAppointment(null)
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={editingAppointment.status === "مؤكد"}
                >
                  <i className="fa-solid fa-check-circle"></i> {isArabic ? "مؤكد" : "Confirmed"}
                </Button>

                <Button
                  onClick={() => {
                    handleUpdateAppointmentStatus(editingAppointment.id, "مكتمل")
                    setEditingAppointment(null)
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={editingAppointment.status === "مكتمل"}
                >
                  <i className="fa-solid fa-award"></i> {isArabic ? "مكتمل" : "Completed"}
                </Button>

                <Button
                  onClick={() => {
                    handleUpdateAppointmentStatus(editingAppointment.id, "ملغي")
                    setEditingAppointment(null)
                  }}
                  variant="destructive"
                  className="flex-1"
                  disabled={editingAppointment.status === "ملغي"}
                >
                  <i className="fa-solid fa-times-circle"></i> {isArabic ? "ملغي" : "Cancelled"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
