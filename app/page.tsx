"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  status: "مؤكد" | "ملغي" | "مكتمل" | "Confirmed" | "Cancelled" | "Completed"
  createdAt: string
  invoiceNumber?: string
  paymentStatus: "مدفوع" | "غير مدفوع" | "مدفوع جزئياً" | "Paid" | "Unpaid" | "Partially Paid"
  paidAmount?: number
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

interface Patient {
  id: string
  name: string
  phone: string
  email?: string
  dateOfBirth?: string
  address?: string
  medicalHistory?: string
  allergies?: string
  emergencyContact?: string
  teethData: ToothData[]
  appointments: string[]
  totalPaid: number
  totalDue: number
  createdAt: string
}

interface Invoice {
  id: string
  appointmentId: string
  patientName: string
  invoiceNumber: string
  date: string
  amount: number
  currency: string
  status: "مدفوع" | "غير مدفوع" | "مدفوع جزئياً" | "Paid" | "Unpaid" | "Partially Paid"
  paidAmount: number
  dueAmount: number
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  notes?: string
  createdAt: string
}

interface NematodeSpecies {
  id: string
  name: string
  scientificName: string
  classification: {
    phylum: string
    class: string
    order: string
    family: string
  }
  habitat: string
  size: string
  lifespan: string
  diet: string
  reproduction: string
  ecologicalRole: string
  plantImpact: string
  controlMethods: string[]
  image: string
  description: string
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
  const [selectedNematode, setSelectedNematode] = useState<NematodeSpecies | null>(null)
  const [nematodeSearchTerm, setNematodeSearchTerm] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [patientSearchTerm, setPatientSearchTerm] = useState("")

  // Nematode species data
  const nematodeSpecies: NematodeSpecies[] = [
    {
      id: "1",
      name: "Root-knot Nematode",
      scientificName: "Meloidogyne incognita",
      classification: {
        phylum: "Nematoda",
        class: "Chromadorea",
        order: "Rhabditida",
        family: "Meloidogynidae",
      },
      habitat: "Soil, plant roots",
      size: "0.4-0.6 mm",
      lifespan: "25-30 days",
      diet: "Plant root cells",
      reproduction: "Parthenogenetic",
      ecologicalRole: "Plant parasite, soil ecosystem component",
      plantImpact: "Causes root galls, stunted growth, reduced yield",
      controlMethods: ["Crop rotation", "Resistant varieties", "Biological control", "Soil solarization"],
      image: "/placeholder.svg?height=200&width=300&text=Root-knot+Nematode",
      description:
        "One of the most economically important plant-parasitic nematodes worldwide, causing significant damage to agricultural crops.",
    },
    {
      id: "2",
      name: "Pinewood Nematode",
      scientificName: "Bursaphelenchus xylophilus",
      classification: {
        phylum: "Nematoda",
        class: "Chromadorea",
        order: "Aphelenchida",
        family: "Aphelenchoididae",
      },
      habitat: "Pine trees, wood",
      size: "0.6-1.0 mm",
      lifespan: "30-40 days",
      diet: "Fungal hyphae, plant cells",
      reproduction: "Sexual reproduction",
      ecologicalRole: "Forest pathogen, causes pine wilt disease",
      plantImpact: "Causes pine wilt disease, tree mortality",
      controlMethods: ["Vector control", "Quarantine measures", "Tree removal", "Chemical treatment"],
      image: "/placeholder.svg?height=200&width=300&text=Pinewood+Nematode",
      description:
        "A devastating forest pathogen that causes pine wilt disease, leading to massive tree mortality in affected areas.",
    },
    {
      id: "3",
      name: "Soybean Cyst Nematode",
      scientificName: "Heterodera glycines",
      classification: {
        phylum: "Nematoda",
        class: "Chromadorea",
        order: "Tylenchida",
        family: "Heteroderidae",
      },
      habitat: "Agricultural soils, soybean roots",
      size: "0.5-0.8 mm",
      lifespan: "30-35 days",
      diet: "Soybean root cells",
      reproduction: "Sexual reproduction",
      ecologicalRole: "Agricultural pest, soil inhabitant",
      plantImpact: "Reduces soybean yield, causes chlorosis and stunting",
      controlMethods: ["Resistant cultivars", "Crop rotation", "Nematicides", "Biological control"],
      image: "/placeholder.svg?height=200&width=300&text=Soybean+Cyst+Nematode",
      description:
        "The most damaging pathogen of soybean in the United States, causing billions of dollars in yield losses annually.",
    },
    {
      id: "4",
      name: "Free-living Nematode",
      scientificName: "Caenorhabditis elegans",
      classification: {
        phylum: "Nematoda",
        class: "Chromadorea",
        order: "Rhabditida",
        family: "Rhabditidae",
      },
      habitat: "Soil, compost, rotting vegetation",
      size: "1.0-1.5 mm",
      lifespan: "2-3 weeks",
      diet: "Bacteria, organic matter",
      reproduction: "Hermaphroditic",
      ecologicalRole: "Decomposer, model organism for research",
      plantImpact: "Beneficial - helps decompose organic matter",
      controlMethods: ["Not applicable - beneficial species"],
      image: "/placeholder.svg?height=200&width=300&text=C.+elegans",
      description:
        "A model organism extensively used in biological research, particularly in genetics, developmental biology, and neuroscience.",
    },
  ]

  // Translation function
  const t = (arabicText: string, englishText: string) => {
    return isArabic ? arabicText : englishText
  }

  // Status translation
  const getStatusText = (status: string) => {
    if (isArabic) {
      switch (status) {
        case "Confirmed":
          return "مؤكد"
        case "Cancelled":
          return "ملغي"
        case "Completed":
          return "مكتمل"
        case "Paid":
          return "مدفوع"
        case "Unpaid":
          return "غير مدفوع"
        case "Partially Paid":
          return "مدفوع جزئياً"
        default:
          return status
      }
    } else {
      switch (status) {
        case "مؤكد":
          return "Confirmed"
        case "ملغي":
          return "Cancelled"
        case "مكتمل":
          return "Completed"
        case "مدفوع":
          return "Paid"
        case "غير مدفوع":
          return "Unpaid"
        case "مدفوع جزئياً":
          return "Partially Paid"
        default:
          return status
      }
    }
  }

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}${day}-${random}`
  }

  // Filter nematodes based on search term
  const filteredNematodes = nematodeSpecies.filter(
    (nematode) =>
      nematode.name.toLowerCase().includes(nematodeSearchTerm.toLowerCase()) ||
      nematode.scientificName.toLowerCase().includes(nematodeSearchTerm.toLowerCase()) ||
      nematode.habitat.toLowerCase().includes(nematodeSearchTerm.toLowerCase()),
  )

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
      patient.phone.includes(patientSearchTerm) ||
      (patient.email && patient.email.toLowerCase().includes(patientSearchTerm.toLowerCase()))
  )

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments")
    const savedTeethData = localStorage.getItem("teethData")
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedLanguage = localStorage.getItem("language")
    const savedPatients = localStorage.getItem("patients")
    const savedInvoices = localStorage.getItem("invoices")

    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments)
      // Ensure all appointments have payment status
      const updatedAppointments = parsedAppointments.map((apt: Appointment) => ({
        ...apt,
        paymentStatus: apt.paymentStatus || (isArabic ? "غير مدفوع" : "Unpaid"),
        paidAmount: apt.paidAmount || 0
      }))
      setAppointments(updatedAppointments)
    }

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    }

    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices))
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
      setStatusFilter("All")
    }
  }, [])

  // Update status filter when language changes
  useEffect(() => {
    if (isArabic) {
      setStatusFilter("الكل")
    } else {
      setStatusFilter("All")
    }
  }, [isArabic])

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

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients))
  }, [patients])

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices))
  }, [invoices])

  // Filter appointments
  useEffect(() => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter((apt) => apt.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (statusFilter !== t("الكل", "All")) {
      const filterStatus = isArabic
        ? statusFilter
        : statusFilter === "Confirmed"
          ? "مؤكد"
          : statusFilter === "Cancelled"
            ? "ملغي"
            : statusFilter === "Completed"
              ? "مكتمل"
              : statusFilter

      filtered = filtered.filter((apt) => apt.status === filterStatus || getStatusText(apt.status) === statusFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter, isArabic])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleLogin = () => {
    setDoctorName(t("د. أحمد محمد", "Dr. Ahmed Mohammed"))
    setCurrentView("dashboard")
    showNotification(t("تم تسجيل الدخول بنجاح", "Login successful"))
  }

  const handleRegister = () => {
    setDoctorName(t("د. أحمد محمد", "Dr. Ahmed Mohammed"))
    setCurrentView("dashboard")
    showNotification(t("تم إنشاء الحساب بنجاح", "Account created successfully"))
  }

  const handleLogout = () => {
    setCurrentView("login")
    setDoctorName("")
    showNotification(t("تم تسجيل الخروج بنجاح", "Logout successful"))
  }

  const handleAddAppointment = (formData: FormData) => {
    const invoiceNumber = generateInvoiceNumber()
    const price = Number.parseFloat(formData.get("price") as string)
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      tooth: formData.get("tooth") as string,
      issue: formData.get("issue") as string,
      sessionType: formData.get("sessionType") as string,
      price: price,
      currency: formData.get("currency") as string,
      duration: Number.parseInt(formData.get("duration") as string),
      notes: (formData.get("notes") as string) || "",
      status: isArabic ? "مؤكد" : "Confirmed",
      createdAt: new Date().toISOString(),
      invoiceNumber: invoiceNumber,
      paymentStatus: isArabic ? "غير مدفوع" : "Unpaid",
      paidAmount: 0
    }

    setAppointments((prev) => [...prev, newAppointment])

    // Create invoice
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      appointmentId: newAppointment.id,
      patientName: newAppointment.name,
      invoiceNumber: invoiceNumber,
      date: newAppointment.date,
      amount: price,
      currency: newAppointment.currency,
      status: isArabic ? "غير مدفوع" : "Unpaid",
      paidAmount: 0,
      dueAmount: price,
      items: [{
        description: `${newAppointment.sessionType} - ${t("السن رقم", "Tooth")} ${newAppointment.tooth}`,
        quantity: 1,
        unitPrice: price,
        total: price
      }],
      notes: newAppointment.notes,
      createdAt: new Date().toISOString()
    }

    setInvoices((prev) => [...prev, newInvoice])

    // Update or create patient
    const existingPatient = patients.find(p => p.name.toLowerCase() === newAppointment.name.toLowerCase())
    if (existingPatient) {
      setPatients(prev => prev.map(p => 
        p.id === existingPatient.id 
          ? { 
              ...p, 
              appointments: [...p.appointments, newAppointment.id],
              totalDue: p.totalDue + price
            }
          : p
      ))
    } else {
      // Create new patient
      const initialTeeth: ToothData[] = []
      for (let i = 1; i <= 32; i++) {
        initialTeeth.push({
          number: i,
          status: "healthy",
          hasIssue: false,
        })
      }

      const newPatient: Patient = {
        id: Date.now().toString() + "_patient",
        name: newAppointment.name,
        phone: "",
        teethData: initialTeeth,
        appointments: [newAppointment.id],
        totalPaid: 0,
        totalDue: price,
        createdAt: new Date().toISOString()
      }

      setPatients(prev => [...prev, newPatient])
    }

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

    showNotification(t("تم حفظ الجلسة والفاتورة بنجاح", "Session and invoice saved successfully"))
    setCurrentView("appointments")
  }

  const handleUpdateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)))
    showNotification(
      t(`تم تحديث حالة الجلسة إلى ${getStatusText(status)}`, `Session status updated to ${getStatusText(status)}`),
    )
  }

  const handleUpdatePaymentStatus = (appointmentId: string, paymentStatus: Appointment["paymentStatus"], paidAmount: number) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, paymentStatus, paidAmount }
        : apt
    ))

    // Update invoice
    setInvoices(prev => prev.map(inv => 
      inv.appointmentId === appointmentId
        ? { 
            ...inv, 
            status: paymentStatus, 
            paidAmount, 
            dueAmount: inv.amount - paidAmount 
          }
        : inv
    ))

    // Update patient totals
    const appointment = appointments.find(apt => apt.id === appointmentId)
    if (appointment) {
      setPatients(prev => prev.map(patient => {
        if (patient.appointments.includes(appointmentId)) {
          const oldPaidAmount = appointment.paidAmount || 0
          const difference = paidAmount - oldPaidAmount
          return {
            ...patient,
            totalPaid: patient.totalPaid + difference,
            totalDue: patient.totalDue - difference
          }
        }
        return patient
      }))
    }

    showNotification(t("تم تحديث حالة الدفع", "Payment status updated"))
  }

  const handleDeleteAppointment = (id: string) => {
    if (confirm(t("هل أنت متأكد من حذف هذه الجلسة؟", "Are you sure you want to delete this session?"))) {
      const appointment = appointments.find(apt => apt.id === id)
      
      setAppointments((prev) => prev.filter((apt) => apt.id !== id))
      setInvoices(prev => prev.filter(inv => inv.appointmentId !== id))
      
      // Update patient
      if (appointment) {
        setPatients(prev => prev.map(patient => {
          if (patient.appointments.includes(id)) {
            return {
              ...patient,
              appointments: patient.appointments.filter(aptId => aptId !== id),
              totalDue: patient.totalDue - (appointment.price - (appointment.paidAmount || 0)),
              totalPaid: patient.totalPaid - (appointment.paidAmount || 0)
            }
          }
          return patient
        }))
      }
      
      showNotification(t("تم حذف الجلسة بنجاح", "Session deleted successfully"))
    }
  }

  const handleExportCSV = () => {
    const headers = isArabic
      ? ["اسم المريض", "التاريخ", "رقم السن", "نوع الإصابة", "نوع الجلسة", "السعر", "العملة", "المدة", "الحالة", "حالة الدفع", "المبلغ المدفوع"]
      : [
          "Patient Name",
          "Date",
          "Tooth Number",
          "Issue Type",
          "Session Type",
          "Price",
          "Currency",
          "Duration",
          "Status",
          "Payment Status",
          "Paid Amount"
        ]

    const csvContent = [
      headers,
      ...filteredAppointments.map((apt) => [
        apt.name,
        apt.date,
        apt.tooth,
        apt.issue,
        apt.sessionType,
        apt.price.toString(),
        apt.currency,
        apt.duration.toString(),
        getStatusText(apt.status),
        getStatusText(apt.paymentStatus),
        (apt.paidAmount || 0).toString()
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "appointments.csv"
    link.click()
    showNotification(t("تم تصدير البيانات بنجاح", "Data exported successfully"))
  }

  const handleAddPatient = (formData: FormData) => {
    const initialTeeth: ToothData[] = []
    for (let i = 1; i <= 32; i++) {
      initialTeeth.push({
        number: i,
        status: "healthy",
        hasIssue: false,
      })
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || undefined,
      dateOfBirth: formData.get("dateOfBirth") as string || undefined,
      address: formData.get("address") as string || undefined,
      medicalHistory: formData.get("medicalHistory") as string || undefined,
      allergies: formData.get("allergies") as string || undefined,
      emergencyContact: formData.get("emergencyContact") as string || undefined,
      teethData: initialTeeth,
      appointments: [],
      totalPaid: 0,
      totalDue: 0,
      createdAt: new Date().toISOString()
    }

    setPatients(prev => [...prev, newPatient])
    showNotification(t("تم إضافة المريض بنجاح", "Patient added successfully"))
    setCurrentView("patients")
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
    
    // Update patient teeth data if viewing patient teeth chart
    if (selectedPatient) {
      setPatients(prev => prev.map(patient => 
        patient.id === selectedPatient.id
          ? {
              ...patient,
              teethData: patient.teethData.map(tooth =>
                tooth.number === toothNumber
                  ? {
                      ...tooth,
                      ...data,
                      hasIssue: !!(data.issue || data.status !== "healthy"),
                      lastUpdated: new Date().toISOString(),
                    }
                  : tooth
              )
            }
          : patient
      ))
    }
    
    setSelectedTooth(null)
    showNotification(t(`تم حفظ بيانات السن رقم ${toothNumber}`, `Tooth ${toothNumber} data saved`))
  }

  const handleDeleteToothData = (toothNumber: number) => {
    if (
      confirm(
        t(
          `هل أنت متأكد من حذف جميع بيانات السن رقم ${toothNumber}؟`,
          `Are you sure you want to delete all data for tooth ${toothNumber}?`,
        ),
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
      
      // Update patient teeth data if viewing patient teeth chart
      if (selectedPatient) {
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id
            ? {
                ...patient,
                teethData: patient.teethData.map(tooth =>
                  tooth.number === toothNumber
                    ? {
                        number: toothNumber,
                        status: "healthy",
                        hasIssue: false,
                      }
                    : tooth
                )
              }
            : patient
        ))
      }
      
      setSelectedTooth(null)
      showNotification(t(`تم حذف بيانات السن رقم ${toothNumber}`, `Tooth ${toothNumber} data deleted`))
    }
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = getStatusText(status)
    switch (normalizedStatus) {
      case "مؤكد":
      case "Confirmed":
        return "status-confirmed"
      case "ملغي":
      case "Cancelled":
        return "status-canceled"
      case "مكتمل":
      case "Completed":
        return "status-completed"
      case "مدفوع":
      case "Paid":
        return "status-paid"
      case "غير مدفوع":
      case "Unpaid":
        return "status-unpaid"
      case "مدفوع جزئياً":
      case "Partially Paid":
        return "status-partial"
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
    const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.paidAmount || 0), 0)
    const pendingRevenue = appointments.reduce((sum, apt) => sum + (apt.price - (apt.paidAmount || 0)), 0)

    return { totalAppointments, healthyTeeth, treatedTeeth, problemTeeth, totalRevenue, pendingRevenue }
  }

  const updateAppointmentReminders = () => {
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const todayAppointments = appointments.filter(
      (apt) => apt.date === today && (apt.status === "مؤكد" || apt.status === "Confirmed"),
    )
    const tomorrowAppointments = appointments.filter(
      (apt) => apt.date === tomorrow && (apt.status === "مؤكد" || apt.status === "Confirmed"),
    )

    return { todayAppointments, tomorrowAppointments }
  }

  const generateReport = () => {
    const stats = updateDashboardStats()
    const confirmedCount = appointments.filter((apt) => apt.status === "مؤكد" || apt.status === "Confirmed").length
    const completedCount = appointments.filter((apt) => apt.status === "مكتمل" || apt.status === "Completed").length
    const cancelledCount = appointments.filter((apt) => apt.status === "ملغي" || apt.status === "Cancelled").length
    const paidCount = appointments.filter((apt) => apt.paymentStatus === "مدفوع" || apt.paymentStatus === "Paid").length
    const unpaidCount = appointments.filter((apt) => apt.paymentStatus === "غير مدفوع" || apt.paymentStatus === "Unpaid").length

    const reportContent = isArabic
      ? `
تقرير شامل للعيادة
==================

إحصائيات الجلسات:
- إجمالي الجلسات: ${appointments.length}
- الجلسات المؤكدة: ${confirmedCount}
- الجلسات المكتملة: ${completedCount}
- الجلسات الملغية: ${cancelledCount}

إحصائيات الإيرادات:
- إجمالي الإيرادات المحصلة: ${stats.totalRevenue.toFixed(2)}
- الإيرادات المعلقة: ${stats.pendingRevenue.toFixed(2)}
- الفواتير المدفوعة: ${paidCount}
- الفواتير غير المدفوعة: ${unpaidCount}

إحصائيات الأسنان:
- أسنان سليمة: ${stats.healthyTeeth}
- أسنان معالجة: ${stats.treatedTeeth}
- أسنان مصابة: ${stats.problemTeeth}

إحصائيات المرضى:
- إجمالي المرضى: ${patients.length}

تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")}
    `
      : `
Comprehensive Clinic Report
===========================

Session Statistics:
- Total Sessions: ${appointments.length}
- Confirmed Sessions: ${confirmedCount}
- Completed Sessions: ${completedCount}
- Cancelled Sessions: ${cancelledCount}

Revenue Statistics:
- Total Revenue Collected: ${stats.totalRevenue.toFixed(2)}
- Pending Revenue: ${stats.pendingRevenue.toFixed(2)}
- Paid Invoices: ${paidCount}
- Unpaid Invoices: ${unpaidCount}

Teeth Statistics:
- Healthy Teeth: ${stats.healthyTeeth}
- Treated Teeth: ${stats.treatedTeeth}
- Problem Teeth: ${stats.problemTeeth}

Patient Statistics:
- Total Patients: ${patients.length}

Report Date: ${new Date().toLocaleDateString("en-US")}
    `

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "clinic-report.txt"
    link.click()
    showNotification(t("تم إنشاء التقرير بنجاح", "Report generated successfully"))
  }

  const backupData = () => {
    const backupData = {
      appointments: appointments,
      teethData: teethData,
      patients: patients,
      invoices: invoices,
      backupDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "clinic-backup.json"
    link.click()
    showNotification(t("تم إنشاء النسخة الاحتياطية بنجاح", "Backup created successfully"))
  }

  const resetAllTeeth = () => {
    if (
      confirm(t("هل أنت متأكد من إعادة تعيين جميع بيانات الأسنان؟", "Are you sure you want to reset all teeth data?"))
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
      showNotification(t("تم إعادة تعيين جميع بيانات الأسنان", "All teeth data has been reset"))
    }
  }

  const printTeethChart = () => {
    window.print()
  }

  const exportTeethData = () => {
    const currentTeethData = selectedPatient ? selectedPatient.teethData : teethData
    const headers = isArabic
      ? ["رقم السن", "الحالة", "الإصابة", "العلاج", "الأولوية", "الملاحظات"]
      : ["Tooth Number", "Status", "Issue", "Treatment", "Priority", "Notes"]

    const csvContent = [
      headers,
      ...currentTeethData
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
    link.download = `teeth-data-${selectedPatient ? selectedPatient.name : 'general'}.csv`
    link.click()
    showNotification(t("تم تصدير بيانات الأسنان بنجاح", "Teeth data exported successfully"))
  }

  const shareTeethChart = () => {
    if (navigator.share) {
      navigator.share({
        title: t("مخطط الأسنان", "Teeth Chart"),
        text: t("مخطط الأسنان من نظام إدارة العيادة", "Teeth chart from clinic management system"),
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showNotification(t("تم نسخ الرابط للحافظة", "Link copied to clipboard"))
    }
  }

  const renderTeethChart = (teethDataToRender?: ToothData[]) => {
    const dataToUse = teethDataToRender || teethData
    return (
      <div className="teeth-chart">
        {dataToUse.map((tooth) => (
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
  }

  const renderTeethStats = (teethDataToRender?: ToothData[]) => {
    const dataToUse = teethDataToRender || teethData
    const healthyCount = dataToUse.filter((t) => t.status === "healthy").length
    const treatedCount = dataToUse.filter((t) => t.status === "treated").length
    const cavityCount = dataToUse.filter((t) => t.status === "cavity").length
    const missingCount = dataToUse.filter((t) => t.status === "missing").length

    return (
      <div className="teeth-stats">
        <div className="stat-item">
          <div className="stat-number">{healthyCount}</div>
          <div className="stat-label">{t("أسنان سليمة", "Healthy Teeth")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{treatedCount}</div>
          <div className="stat-label">{t("أسنان معالجة", "Treated Teeth")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{cavityCount}</div>
          <div className="stat-label">{t("أسنان مصابة", "Cavity Teeth")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{missingCount}</div>
          <div className="stat-label">{t("أسنان مفقودة", "Missing Teeth")}</div>
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
              {t(`لديك ${todayAppointments.length} جلسة اليوم`, `You have ${todayAppointments.length} sessions today`)}
            </span>
          </div>
        )}
        {tomorrowAppointments.length > 0 && (
          <div className="appointment-reminder">
            <i className="fa-solid fa-calendar-day"></i>
            <span>
              {t(
                `لديك ${tomorrowAppointments.length} جلسة غداً`,
                `You have ${tomorrowAppointments.length} sessions tomorrow`,
              )}
            </span>
          </div>
        )}
      </div>
    )
  }

  const renderQuickActions = () => (
    <div className="quick-actions">
      <button className="quick-action-btn" onClick={() => setCurrentView("add-appointment")}>
        <i className="fa-solid fa-plus"></i> {t("جلسة جديدة", "New Session")}
      </button>
      <button className="quick-action-btn" onClick={() => setCurrentView("teeth-chart")}>
        <i className="fa-solid fa-teeth"></i> {t("مخطط الأسنان", "Teeth Chart")}
      </button>
      <button className="quick-action-btn" onClick={() => setCurrentView("patients")}>
        <i className="fa-solid fa-users"></i> {t("المرضى", "Patients")}
      </button>
      <button className="quick-action-btn" onClick={() => setCurrentView("invoices")}>
        <i className="fa-solid fa-file-invoice"></i> {t("الفواتير", "Invoices")}
      </button>
      <button className="quick-action-btn" onClick={() => setCurrentView("nematodes")}>
        <i className="fa-solid fa-microscope"></i> {t("الديدان الخيطية", "Nematodes")}
      </button>
      <button className="quick-action-btn" onClick={generateReport}>
        <i className="fa-solid fa-chart-bar"></i> {t("تقرير شامل", "Full Report")}
      </button>
      <button className="quick-action-btn" onClick={backupData}>
        <i className="fa-solid fa-download"></i> {t("نسخ احتياطي", "Backup")}
      </button>
    </div>
  )

  const renderNematodeCard = (nematode: NematodeSpecies) => (
    <Card key={nematode.id} className="nematode-card cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{nematode.name}</CardTitle>
            <CardDescription className="italic">{nematode.scientificName}</CardDescription>
          </div>
          <Badge variant="secondary">{nematode.classification.family}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={nematode.image || "/placeholder.svg"}
          alt={nematode.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{nematode.description}</p>
        <div className="space-y-2 text-sm">
          <div>
            <strong>{t("الموطن:", "Habitat:")}</strong> {nematode.habitat}
          </div>
          <div>
            <strong>{t("الحجم:", "Size:")}</strong> {nematode.size}
          </div>
          <div>
            <strong>{t("التأثير على النباتات:", "Plant Impact:")}</strong> {nematode.plantImpact}
          </div>
        </div>
        <Button
          className="w-full mt-4 bg-transparent"
          variant="outline"
          onClick={() => {
            setSelectedNematode(nematode)
            setCurrentView("nematode-details")
          }}
        >
          {t("عرض التفاصيل", "View Details")}
        </Button>
      </CardContent>
    </Card>
  )

  const renderNematodeLifeCycle = () => (
    <div className="life-cycle-diagram">
      <h4 className="text-lg font-semibold mb-4 text-center">
        {t("دورة حياة الديدان الخيطية", "Nematode Life Cycle")}
      </h4>
      <div className="cycle-stages">
        <div className="stage">
          <div className="stage-circle">1</div>
          <h5>{t("البيضة", "Egg")}</h5>
          <p>{t("المرحلة الأولى من التطور", "First stage of development")}</p>
        </div>
        <div className="stage-arrow">→</div>
        <div className="stage">
          <div className="stage-circle">2</div>
          <h5>{t("اليرقة الأولى", "J1 Juvenile")}</h5>
          <p>{t("الفقس داخل البيضة", "Hatching inside egg")}</p>
        </div>
        <div className="stage-arrow">→</div>
        <div className="stage">
          <div className="stage-circle">3</div>
          <h5>{t("اليرقة الثانية", "J2 Juvenile")}</h5>
          <p>{t("مرحلة العدوى", "Infective stage")}</p>
        </div>
        <div className="stage-arrow">→</div>
        <div className="stage">
          <div className="stage-circle">4</div>
          <h5>{t("اليرقة الثالثة", "J3 Juvenile")}</h5>
          <p>{t("النمو داخل العائل", "Growth inside host")}</p>
        </div>
        <div className="stage-arrow">→</div>
        <div className="stage">
          <div className="stage-circle">5</div>
          <h5>{t("اليرقة الرابعة", "J4 Juvenile")}</h5>
          <p>{t("مرحلة ما قبل البلوغ", "Pre-adult stage")}</p>
        </div>
        <div className="stage-arrow">→</div>
        <div className="stage">
          <div className="stage-circle">6</div>
          <h5>{t("البالغ", "Adult")}</h5>
          <p>{t("النضج الجنسي والتكاثر", "Sexual maturity and reproduction")}</p>
        </div>
      </div>
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
          max-width: 1200px;
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

        .dental-system.dark .container::before {
          background: radial-gradient(circle, #3399ff 0%, #222 60%);
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
        .status-paid { 
          background: linear-gradient(90deg,#28a745 60%,#20c997 100%);
        }
        .status-unpaid { 
          background: linear-gradient(90deg,#dc3545 60%,#e74c3c 100%);
        }
        .status-partial { 
          background: linear-gradient(90deg,#ffc107 60%,#fd7e14 100%);
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
        .dental-system.dark .status-paid { 
          background: linear-gradient(90deg,#20c997 60%,#28a745 100%);
        }
        .dental-system.dark .status-unpaid { 
          background: linear-gradient(90deg,#e74c3c 60%,#dc3545 100%);
        }
        .dental-system.dark .status-partial { 
          background: linear-gradient(90deg,#fd7e14 60%,#ffc107 100%);
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

        .nematode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .nematode-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .nematode-card:hover {
          transform: translateY(-2px);
        }

        .life-cycle-diagram {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 30px;
          border-radius: 20px;
          margin: 30px 0;
        }

        .dental-system.dark .life-cycle-diagram {
          background: linear-gradient(135deg, #22293a 0%, #282f3c 100%);
        }

        .cycle-stages {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
        }

        .stage {
          text-align: center;
          max-width: 120px;
        }

        .stage-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066b2 0%, #00b4d8 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          margin: 0 auto 10px;
        }

        .stage h5 {
          font-size: 14px;
          font-weight: 600;
          margin: 10px 0 5px;
          color: #0066b2;
        }

        .stage p {
          font-size: 12px;
          color: #666;
          line-height: 1.3;
        }

        .stage-arrow {
          font-size: 24px;
          color: #0066b2;
          font-weight: bold;
        }

        .classification-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .dental-system.dark .classification-table {
          background: #2d3748;
        }

        .classification-table th,
        .classification-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .dental-system.dark .classification-table th,
        .dental-system.dark .classification-table td {
          border-bottom-color: #4a5568;
        }

        .classification-table th {
          background: #f7fafc;
          font-weight: 600;
          color: #2d3748;
        }

        .dental-system.dark .classification-table th {
          background: #4a5568;
          color: #e2e8f0;
        }

        .patient-card {
          background: linear-gradient(104deg, #e8f0fe 0%, #f1f8ff 100%);
          padding: 20px 24px;
          border-radius: 18px;
          border: 1.5px solid #b3d1f5;
          box-shadow: 0 4px 24px rgba(0,180,216,0.09);
          position: relative;
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: pointer;
          z-index: 2;
          margin-bottom: 20px;
        }

        .patient-card:hover {
          background: linear-gradient(104deg, #d1eaff 0%, #eaf8ff 100%);
          box-shadow: 0 10px 32px rgba(0, 180, 216, 0.16);
          border-color: #00b4d8;
        }

        .dental-system.dark .patient-card {
          background: linear-gradient(104deg, #22293a 0%, #282f3c 100%);
          border-color: #444;
          box-shadow: 0 2px 10px rgba(0,0,0,0.13);
          color: #eee;
        }

        .dental-system.dark .patient-card:hover {
          background: linear-gradient(104deg, #282f3c 0%, #222d45 100%);
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
        }

        .invoice-card {
          background: linear-gradient(104deg, #fff8e1 0%, #fffbf0 100%);
          padding: 20px 24px;
          border-radius: 18px;
          border: 1.5px solid #ffd54f;
          box-shadow: 0 4px 24px rgba(255,213,79,0.09);
          position: relative;
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: pointer;
          z-index: 2;
          margin-bottom: 20px;
        }

        .invoice-card:hover {
          background: linear-gradient(104deg, #fff3c4 0%, #fff8e1 100%);
          box-shadow: 0 10px 32px rgba(255, 213, 79, 0.16);
          border-color: #ffc107;
        }

        .dental-system.dark .invoice-card {
          background: linear-gradient(104deg, #2d2a1f 0%, #332f24 100%);
          border-color: #5a5a2a;
          box-shadow: 0 2px 10px rgba(0,0,0,0.13);
          color: #eee;
        }

        .dental-system.dark .invoice-card:hover {
          background: linear-gradient(104deg, #332f24 0%, #2d2a1f 100%);
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
        }

        .revenue-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
          padding: 20px;
          background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
          border-radius: 16px;
        }

        .dental-system.dark .revenue-stats {
          background: linear-gradient(135deg, #1a2e1a 0%, #1f331f 100%);
        }

        .revenue-item {
          text-align: center;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .dental-system.dark .revenue-item {
          background: #2d3748;
          color: #e2e8f0;
        }

        .revenue-number {
          font-size: 2rem;
          font-weight: 700;
          color: #28a745;
        }

        .revenue-label {
          font-size: 1rem;
          color: #666;
          margin-top: 8px;
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
          .nematode-grid {
            grid-template-columns: 1fr;
          }
          .cycle-stages {
            flex-direction: column;
            gap: 10px;
          }
          .stage-arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        {t("نظام إدارة العيادة - تسجيل دخول الدكتور", "Clinic Management System - Doctor Login")}
        <div className="header-decor"></div>
      </header>

      {/* Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`mode-toggle ${isDarkMode ? "dark" : ""}`}
        aria-label={t("تبديل الوضع", "Toggle mode")}
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
      <button
        onClick={() => setIsArabic(!isArabic)}
        className="language-toggle"
        aria-label={t("تبديل اللغة", "Toggle language")}
      >
        {isArabic ? "English" : "العربية"}
      </button>

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      <div className="container">
        {/* Login View */}
        {currentView === "login" && (
          <div>
            <h2 className="dental-h2">
              <i className="fa-solid fa-user-doctor"></i> {t("تسجيل دخول الدكتور", "Doctor Login")}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin()
              }}
            >
              <div>
                <label className="dental-label" htmlFor="loginEmail">
                  <i className="fa-regular fa-envelope"></i> {t("البريد الإلكتروني", "Email")}
                </label>
                <input className="dental-input" id="loginEmail" type="email" placeholder="example@mail.com" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="loginPass">
                  <i className="fa-solid fa-key"></i> {t("كلمة المرور", "Password")}
                </label>
                <input className="dental-input" id="loginPass" type="password" placeholder="••••••••" required />
              </div>

              <button type="submit" className="dental-button">
                <i className="fa-solid fa-sign-in-alt"></i> {t("دخول", "Login")}
              </button>
            </form>

            <p style={{ marginTop: "14px", fontSize: "14px", color: "#555" }}>
              {t("لا تملك حساب؟", "Don't have an account?")}{" "}
              <button
                onClick={() => setCurrentView("register")}
                style={{ background: "none", border: "none", color: "#0077cc", fontWeight: 700, cursor: "pointer" }}
              >
                {t("تسجيل جديد", "Register")} <i className="fa-regular fa-user"></i>
              </button>
            </p>
          </div>
        )}

        {/* Register View */}
        {currentView === "register" && (
          <div>
            <h2 className="dental-h2">
              <i className="fa-solid fa-user-plus"></i> {t("تسجيل حساب دكتور جديد", "Create New Doctor Account")}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRegister()
              }}
            >
              <div>
                <label className="dental-label" htmlFor="registerName">
                  <i className="fa-solid fa-signature"></i> {t("الاسم الكامل", "Full Name")}
                </label>
                <input
                  className="dental-input"
                  id="registerName"
                  type="text"
                  placeholder={t("الاسم الكامل", "Full Name")}
                  required
                />
              </div>

              <div>
                <label className="dental-label" htmlFor="registerEmail">
                  <i className="fa-regular fa-envelope"></i> {t("البريد الإلكتروني", "Email")}
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
                  <i className="fa-solid fa-key"></i> {t("كلمة المرور", "Password")}
                </label>
                <input className="dental-input" id="registerPass" type="password" placeholder="••••••••" required />
              </div>

              <button type="submit" className="dental-button">
                <i className="fa-solid fa-user-plus"></i> {t("تسجيل حساب", "Create Account")}
              </button>
            </form>

            <p style={{ marginTop: "14px", fontSize: "14px", color: "#555" }}>
              {t("لديك حساب؟", "Have an account?")}{" "}
              <button
                onClick={() => setCurrentView("login")}
                style={{ background: "none", border: "none", color: "#0077cc", fontWeight: 700, cursor: "pointer" }}
              >
                {t("تسجيل دخول", "Login")} <i className="fa-solid fa-sign-in-alt"></i>
              </button>
            </p>
          </div>
        )}

        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <div>
            <h2 className="dental-h2">
              <i className="fa-solid fa-chart-line"></i> {t("لوحة تحكم الدكتور", "Doctor Dashboard")}
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
              <i className="fa-solid fa-sign-out-alt"></i> {t("تسجيل خروج", "Logout")}
            </button>

            {/* Revenue Stats */}
            <div className="revenue-stats">
              <div className="revenue-item">
                <div className="revenue-number">{updateDashboardStats().totalRevenue.toFixed(2)}</div>
                <div className="revenue-label">{t("إجمالي الإيرادات المحصلة", "Total Revenue Collected")}</div>
              </div>
              <div className="revenue-item">
                <div className="revenue-number">{updateDashboardStats().pendingRevenue.toFixed(2)}</div>
                <div className="revenue-label">{t("الإيرادات المعلقة", "Pending Revenue")}</div>
              </div>
              <div className="revenue-item">
                <div className="revenue-number">{appointments.length}</div>
                <div className="revenue-label">{t("إجمالي الجلسات", "Total Sessions")}</div>
              </div>
              <div className="revenue-item">
                <div className="revenue-number">{patients.length}</div>
                <div className="revenue-label">{t("إجمالي المرضى", "Total Patients")}</div>
              </div>
            </div>

            {/* Dashboard Stats */}
            {renderTeethStats()}

            {/* Appointment Reminders */}
            {renderAppointmentReminders()}

            {/* Quick Actions */}
            {renderQuickActions()}

            <div className="nav">
              <button className="dental-button" onClick={() => setCurrentView("add-appointment")}>
                <i className="fa-solid fa-plus"></i> {t("إضافة جلسة جديدة", "Add New Session")}
              </button>
              <button className="dental-button" onClick={() => setCurrentView("appointments")}>
                <i className="fa-solid fa-list"></i> {t("عرض الجلسات", "View Sessions")}
              </button>
              <button className="dental-button" onClick={() => setCurrentView("patients")}>
                <i className="fa-solid fa-users"></i> {t("المرضى", "Patients")}
              </button>
              <button className="dental-button" onClick={() => setCurrentView("invoices")}>
                <i className="fa-solid fa-file-invoice"></i> {t("الفواتير", "Invoices")}
              </button>
              <button className="dental-button" onClick={() => setCurrentView("teeth-chart")}>
                <i className="fa-solid fa-teeth"></i> {t("مخطط الأسنان", "Teeth Chart")}
              </button>
              <button className="dental-button" onClick={() => setCurrentView("nematodes")}>
                <i className="fa-solid fa-microscope"></i> {t("الديدان الخيطية", "Nematodes")}
              </button>
            </div>
          </div>
        )}

        {/* Add Appointment View */}
        {currentView === "add-appointment" && (
          <div>
            <h3 className="dental-h3">
              <i className="fa-solid fa-notes-medical"></i> {t("تسجيل جلسة علاجية", "Register Treatment Session")}
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
                  <i className="fa-solid fa-user"></i> {t("اسم المريض", "Patient Name")}
                </label>
                <input className="dental-input" id="name" name="name" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="date">
                  <i className="fa-solid fa-calendar-day"></i> {t("تاريخ الجلسة", "Session Date")}
                </label>
                <input className="dental-input" id="date" name="date" type="date" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="tooth">
                  <i className="fa-solid fa-tooth"></i> {t("رقم السن المصاب", "Affected Tooth Number")}
                </label>
                <select className="dental-select" id="tooth" name="tooth" required>
                  <option value="" disabled>
                    {t("اختر رقم السن", "Select tooth number")}
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
                  <i className="fa-solid fa-exclamation-triangle"></i> {t("نوع الإصابة", "Issue Type")}
                </label>
                <input className="dental-input" id="issue" name="issue" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="sessionType">
                  <i className="fa-solid fa-stethoscope"></i> {t("نوع الجلسة", "Session Type")}
                </label>
                <input className="dental-input" id="sessionType" name="sessionType" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="price">
                  <i className="fa-solid fa-money-bill-wave"></i> {t("سعر الجلسة", "Session Price")}
                </label>
                <input className="dental-input" id="price" name="price" type="number" min="0" step="0.01" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="currency">
                  <i className="fa-solid fa-coins"></i> {t("العملة", "Currency")}
                </label>
                <select className="dental-select" id="currency" name="currency" required>
                  <option value="ILS">ILS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="dental-label" htmlFor="duration">
                  <i className="fa-solid fa-clock"></i> {t("مدة الجلسة (بالدقائق)", "Session Duration (minutes)")}
                </label>
                <input className="dental-input" id="duration" name="duration" type="number" min="5" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="notes">
                  <i className="fa-solid fa-comment-dots"></i> {t("ملاحظات إضافية", "Additional Notes")}
                </label>
                <textarea className="dental-textarea" id="notes" name="notes" rows={3}></textarea>
              </div>

              <button type="submit" className="dental-button">
                <i className="fa-solid fa-save"></i> {t("حفظ الجلسة", "Save Session")}
              </button>
            </form>

            <button onClick={() => setCurrentView("dashboard")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {t("عودة", "Back")}
            </button>
          </div>
        )}

        {/* Patients View */}
        {currentView === "patients" && (
          <div>
            <h3 className="dental-h3">
              <i className="fa-solid fa-users"></i> {t("قائمة المرضى", "Patients List")}
            </h3>

            <input
              type="text"
              className="search-input"
              placeholder={t("ابحث بالاسم أو الهاتف أو البريد الإلكتروني...", "Search by name, phone or email...")}
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
            />

            <button className="dental-button" onClick={() => setCurrentView("add-patient")} style={{ width: "auto", padding: "12px 24px", margin: "10px 0" }}>
              <i className="fa-solid fa-user-plus"></i> {t("إضافة مريض جديد", "Add New Patient")}
            </button>

            <div className="appointment-list">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <strong>{patient.name}</strong>
                  <p>
                    <i className="fa-solid fa-phone"></i> {patient.phone}
                  </p>
                  {patient.email && (
                    <p>
                      <i className="fa-solid fa-envelope"></i> {patient.email}
                    </p>
                  )}
                  <p>
                    <i className="fa-solid fa-calendar-plus"></i> {t("الجلسات:", "Sessions:")} {patient.appointments.length}
                  </p>
                  <p>
                    <i className="fa-solid fa-money-bill-wave"></i> {t("المدفوع:", "Paid:")} {patient.totalPaid.toFixed(2)}
                  </p>
                  <p>
                    <i className="fa-solid fa-exclamation-circle"></i> {t("المستحق:", "Due:")} {patient.totalDue.toFixed(2)}
                  </p>

                  <div className="btns">
                    <button
                      className="dental-button"
                      onClick={() => {
                        setSelectedPatient(patient)
                        setCurrentView("patient-details")
                      }}
                    >
                      <i className="fa-solid fa-eye"></i> {t("عرض", "View")}
                    </button>
                    <button
                      className="dental-button"
                      onClick={() => {
                        setSelectedPatient(patient)
                        setTeethData(patient.teethData)
                        setCurrentView("patient-teeth-chart")
                      }}
                    >
                      <i className="fa-solid fa-teeth"></i> {t("مخطط الأسنان", "Teeth Chart")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setCurrentView("dashboard")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {t("عودة", "Back")}
            </button>
          </div>
        )}

        {/* Add Patient View */}
        {currentView === "add-patient" && (
          <div>
            <h3 className="dental-h3">
              <i className="fa-solid fa-user-plus"></i> {t("إضافة مريض جديد", "Add New Patient")}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAddPatient(formData)
              }}
            >
              <div>
                <label className="dental-label" htmlFor="patientName">
                  <i className="fa-solid fa-user"></i> {t("الاسم الكامل", "Full Name")}
                </label>
                <input className="dental-input" id="patientName" name="name" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="patientPhone">
                  <i className="fa-solid fa-phone"></i> {t("رقم الهاتف", "Phone Number")}
                </label>
                <input className="dental-input" id="patientPhone" name="phone" type="tel" required />
              </div>

              <div>
                <label className="dental-label" htmlFor="patientEmail">
                  <i className="fa-solid fa-envelope"></i> {t("البريد الإلكتروني (اختياري)", "Email (Optional)")}
                </label>
                <input className="dental-input" id="patientEmail" name="email" type="email" />
              </div>

              <div>
                <label className="dental-label" htmlFor="patientDOB">
                  <i className="fa-solid fa-calendar"></i> {t("تاريخ الميلاد (اختياري)", "Date of Birth (Optional)")}
                </label>
                <input className="dental-input" id="patientDOB" name="dateOfBirth" type="date" />
              </div>

              <div>
                <label className="dental-label" htmlFor="patientAddress">
                  <i className="fa-solid fa-map-marker-alt"></i> {t("العنوان (اختياري)", "Address (Optional)")}
                </label>
                <textarea className="dental-textarea" id="patientAddress" name="address" rows={2}></textarea>
              </div>

              <div>
                <label className="dental-label" htmlFor="patientMedicalHistory">
                  <i className="fa-solid fa-notes-medical"></i> {t("التاريخ المرضي (اختياري)", "Medical History (Optional)")}
                </label>
                <textarea className="dental-textarea" id="patientMedicalHistory" name="medicalHistory" rows={3}></textarea>
              </div>

              <div>
                <label className="dental-label" htmlFor="patientAllergies">
                  <i className="fa-solid fa-exclamation-triangle"></i> {t("الحساسية (اختياري)", "Allergies (Optional)")}
                </label>
                <textarea className="dental-textarea" id="patientAllergies" name="allergies" rows={2}></textarea>
              </div>

              <div>
                <label className="dental-label" htmlFor="patientEmergencyContact">
                  <i className="fa-solid fa-phone-alt"></i> {t("جهة الاتصال في الطوارئ (اختياري)", "Emergency Contact (Optional)")}
                </label>
                <input className="dental-input" id="patientEmergencyContact" name="emergencyContact" />
              </div>

              <button type="submit" className="dental-button">
                <i className="fa-solid fa-save"></i> {t("حفظ المريض", "Save Patient")}
              </button>
            </form>

            <button onClick={() => setCurrentView("patients")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {t("عودة", "Back")}
            </button>
          </div>
        )}

        {/* Patient Details View */}
        {currentView === "patient-details" && selectedPatient && (
          <div>
            <button onClick={() => setCurrentView("patients")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {t("عودة لقائمة المرضى", "Back to Patients")}
            </button>

            <h3 className="dental-h3">
              <i className="fa-solid fa-user"></i> {t("تفاصيل المريض", "Patient Details")}
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
                  <i className="fa-solid fa-user"></i> {t("المعلومات الشخصية", "Personal Information")}
                </h4>
                <p>
                  <strong>{t("الاسم:", "Name:")}</strong> {selectedPatient.name}
                </p>
                <p>
                  <strong>{t("الهاتف:", "Phone:")}</strong> {selectedPatient.phone}
                </p>
                {selectedPatient.email && (
                  <p>
                    <strong>{t("البريد الإلكتروني:", "Email:")}</strong> {selectedPatient.email}
                  </p>
                )}
                {selectedPatient.dateOfBirth && (
                  <p>
                    <strong>{t("تاريخ الميلاد:", "Date of Birth:")}</strong> {selectedPatient.dateOfBirth}
                  </p>
                )}
                {selectedPatient.address && (
                  <p>
                    <strong>{t("العنوان:", "Address:")}</strong> {selectedPatient.address}
                  </p>
                )}
                {selectedPatient.emergencyContact && (
                  <p>
                    <strong>{t("جهة الاتصال في الطوارئ:", "Emergency Contact:")}</strong> {selectedPatient.emergencyContact}
                  </p>
                )}
              </div>

              {selectedPatient.medicalHistory && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
                    padding: "20px",
                    borderRadius: "16px",
                    margin: "20px 0",
                  }}
                >
                  <h4>
                    <i className="fa-solid fa-notes-medical"></i> {t("التاريخ المرضي", "Medical History")}
                  </h4>
                  <p>{selectedPatient.medicalHistory}</p>
                </div>
              )}

              {selectedPatient.allergies && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)",
                    padding: "20px",
                    borderRadius: "16px",
                    margin: "20px 0",
                  }}
                >
                  <h4>
                    <i className="fa-solid fa-exclamation-triangle"></i> {t("الحساسية", "Allergies")}
                  </h4>
                  <p>{selectedPatient.allergies}</p>
                </div>
              )}

              <div
                style={{
                  background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)",
                  padding: "20px",
                  borderRadius: "16px",
                  margin: "20px 0",
                }}
              >
                <h4>
                  <i className="fa-solid fa-chart-bar"></i> {t("الإحصائيات المالية", "Financial Statistics")}
                </h4>
                <p>
                  <strong>{t("إجمالي الجلسات:", "Total Sessions:")}</strong> {selectedPatient.appointments.length}
                </p>
                <p>
                  <strong>{t("إجمالي المدفوع:", "Total Paid:")}</strong> {selectedPatient.totalPaid.toFixed(2)}
                </p>
                <p>
                  <strong>{t("إجمالي المستحق:", "Total Due:")}</strong> {selectedPatient.totalDue.toFixed(2)}
                </p>
              </div>
            </div>

            <h4 style={{ marginTop: "25px", textAlign: "center" }}>
              <i className="fa-solid fa-teeth"></i> {t("مخطط الأسنان", "Teeth Chart")}
            </h4>
            {renderTeethChart(selectedPatient.teethData)}
            {renderTeethStats(selectedPatient.teethData)}

            <div className="quick-actions">
              <button 
                className="quick-action-btn" 
                onClick={() => {
                  setTeethData(selectedPatient.teethData)
                  setCurrentView("patient-teeth-chart")
                }}
              >
                <i className="fa-solid fa-teeth"></i> {t("مخطط الأسنان التفاعلي", "Interactive Teeth Chart")}
              </button>
            </div>
          </div>
        )}

        {/* Patient Teeth Chart View */}
        {currentView === "patient-teeth-chart" && selectedPatient && (
          <div>
            <button onClick={() => setCurrentView("patient-details")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {t("عودة لتفاصيل المريض", "Back to Patient Details")}
            </button>

            <h3 className="dental-h3" style={{ textAlign: "center" }}>
              <i className="fa-solid fa-teeth"></i>{" "}
              {t(`مخطط أسنان المريض: ${selectedPatient.name}`, `Patient Teeth Chart: ${selectedPatient.name}`)}
            </h3>

            {/* Teeth Legend */}
            <div className="teeth-legend">
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", borderColor: "#b3d1f5" }}
                ></div>
                <span>{t("سليم", "Healthy")}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)", borderColor: "#28a745" }}
                ></div>
                <span>{t("معالج", "Treated")}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)", borderColor: "#dc3545" }}
                ></div>
                <span>{t("مصاب", "Cavity")}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)", borderColor: "#ffc107" }}
                ></div>
                <span>{t("تحت العلاج", "Under Treatment")}</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: "linear-gradient(135deg, #e2e3e5 0%, #d6d8db 100%)", borderColor: "#6c757d" }}
                ></div>
                <span>{t("مفقود", "Missing")}</span>
              </div>
            </div>

            {/* Teeth Chart */}
            {renderTeethChart(selectedPatient.teethData)}

            {/* Teeth Statistics */}
            {renderTeethStats(selectedPatient.teethData)}

            {/* Additional Tools */}
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={printTeethChart}>
                <i className="fa-solid fa-print"></i> {t("طباعة المخطط", "Print Chart")}
              </button>
              <button className="quick-action-btn" onClick={exportTeethData}>
                <i className="fa-solid fa-download"></i> {t("تصدير البيانات", "Export Data")}
              </button>
              <button className="quick-action-btn" onClick={shareTeethChart}>
                <i className="fa-solid fa-share"></i> {t("مشاركة", "Share")}
              </button>
            </div>
          </div>
        )}

        {/* Invoices View */}
        {currentView === "invoices" && (
          <div>
            <h3 className="dental-h3">
              <i className="fa-solid fa-file-invoice"></i> {t("قائمة الفواتير", "Invoices List")}
            </h3>

            <div className="appointment-list">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="invoice-card">
                  <strong>{t("فاتورة رقم:", "Invoice #")} {invoice.invoiceNumber}</strong>
                  <span className={`status-label ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                  <p>
                    <i className="fa-solid fa-user"></i> {invoice.patientName}
                  </p>
                  <p>
                    <i className="fa-solid fa-calendar"></i> {invoice.date}
                  </p>
                  <p>
                    <i className="fa-solid fa-money-bill-wave"></i> {t("المبلغ الإجمالي:", "Total Amount:")} {invoice.amount} {invoice.currency}
                  </p>
                  <p>
                    <i className="fa-solid fa-check-circle"></i> {t("المبلغ المدفوع:", "Paid Amount:")} {invoice.paidAmount} {invoice.currency}
                  </p>
                  <p>
                    <i className="fa-solid fa-exclamation-circle"></i> {t("المبلغ المستحق:", "Due Amount:")} {invoice.dueAmount} {invoice.currency}
                  </p>

                  <div className="btns">
                    <button
                      className="dental-button"
                      onClick={() => {
                        setSelectedInvoice(invoice)
                        setCurrentView("invoice-details")
                      }}
                    >
                      <i className="fa-solid fa-eye"></i> {t("عرض", "View")}
                    </button>
                    <button
                      className="dental-button"
                      onClick={() => {
                        const appointment = appointments.find(apt => apt.id === invoice.appointmentId)
                        if (appointment) {
                          setEditingAppointment(appointment)
                        }
                      }}
                    >
                      <i className="fa-solid fa-credit-card"></i> {t("تحديث الدفع", "Update Payment")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setCurrentView("dashboard")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {t("عودة", "Back")}
            </button>
          </div>
        )}

        {/* Invoice Details View */}
        {currentView === "invoice-details" && selectedInvoice && (
          <div>
            <button onClick={() => setCurrentView("invoices")} className="back-btn">
              <i className="fa-solid fa-arrow-right"></i> {t("عودة لقائمة الفواتير", "Back to Invoices")}
            </button>

            <h3 className="dental-h3">
              <i className="fa-solid fa-file-invoice"></i> {t("تفاصيل الفاتورة", "Invoice Details")}
            </h3>

            <div style={{ lineHeight: "1.6", fontSize: "17px" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #fff8e1 0%, #fffbf0 100%)",
                  padding: "20px",
                  borderRadius: "16px",
                  margin: "20px 0",
                }}
              >
                <h4>
                  <i className="fa-solid fa-info-circle"></i> {t("معلومات الفاتورة", "Invoice Information")}
                </h4>
                <p>
                  <strong>{t("رقم الفاتورة:", "Invoice Number:")}</strong> {selectedInvoice.invoiceNumber}
                </p>
                <p>
                  <strong>{t("اسم المريض:", "Patient Name:")}</strong> {selectedInvoice.patientName}
                </p>
                <p>
                  <strong>{t("التاريخ:", "Date:")}</strong> {selectedInvoice.date}
                </p>
                <p>
                  <strong>{t("الحالة:", "Status:")}</strong>{" "}
                  <span className={`status-label ${getStatusColor(selectedInvoice.status)}`}>
                    {getStatusText(selectedInvoice.status)}
                  </span>
                </p>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  padding: "20px",
                  borderRadius: "16px",
                  margin: "20px 0",
                }}
              >
                <h4>
                  <i className="fa-solid fa-list"></i> {t("تفاصيل الخدمات", "Service Details")}
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("الوصف", "Description")}</TableHead>
                      <TableHead>{t("الكمية", "Quantity")}</TableHead>
                      <TableHead>{t("سعر الوحدة", "Unit Price")}</TableHead>
                      <TableHead>{t("الإجمالي", "Total")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice} {selectedInvoice.currency}</TableCell>
                        <TableCell>{item.total} {selectedInvoice.currency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)",
                  padding: "20px",
                  borderRadius: "16px",
                  margin: "20px 0",
                }}
              >
                <h4>
                  <i className="fa-solid fa-calculator"></i> {t("ملخص المبالغ", "Amount Summary")}
                </h4>
                <p>
                  <strong>{t("المبلغ الإجمالي:", "Total Amount:")}</strong> {selectedInvoice.amount} {selectedInvoice.currency}
                </p>
                <p>
                  <strong>{t("المبلغ المدفوع:", "Paid Amount:")}</strong> {selectedInvoice.paidAmount} {selectedInvoice.currency}
                </p>
                <p>
                  <strong>{t("المبلغ المستحق:", "Due Amount:")}</strong> {selectedInvoice.dueAmount} {selectedInvoice.currency}
                </p>
              </div>

              {selectedInvoice.notes && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
                    padding: "20px",
                    borderRadius: "16px",
                    margin: "20px 0",
                  }}
                >
                  <h4>
                    <i className="fa-solid fa-comment-dots"></i> {t("ملاحظات", "Notes")}
                  </h4>
                  <p>{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => window.print()}>
                <i className="fa-solid fa-print"></i> {t("طباعة الفاتورة", "Print Invoice")}
              </button>
            </div>
          </div>
        )}

        {/* Appointments List View */}
        {currentView === "appointments" && (
          <div>
            <h3 className="dental-h3">
              <i className="fa-solid fa-list-ul"></i> {t("قائمة الجلسات", "Sessions List")}
            </h3>

            <input
              type="text"
              className="search-input"
              placeholder={t("ابحث بالاسم...", "Search by name...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label={t("فلترة الحالة", "Filter status")}
            >
              <option>{t("الكل", "All")}</option>
              <option>{t("مؤكد", "Confirmed")}</option>
              <option>{t("ملغي", "Cancelled")}</option>
              <option>{t("مكتمل", "Completed")}</option>
            </select>

            <button onClick={handleExportCSV} className="export-btn" aria-label={t("تصد\
