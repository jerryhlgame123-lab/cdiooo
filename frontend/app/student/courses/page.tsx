"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "../../student-courses.css";

interface CourseItem {
  id: number;
  category: string;
  title: string;
  level: string;
  schedule: string;
  time: string;
  startDate: string;
  duration: string;
  rating: number;
  reviewsCount: string;
  enrolled: number;
  maxStudents: number;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  currentPrice: number;
  oldPrice: number;
  tag: string;
  bgGrad: [string, string, string];
}

const COURSES_DATA: CourseItem[] = [
  {
    id: 1,
    category: "ielts lang-en",
    title: "Tiếng Anh IELTS Foundation (Band 3.5 – 4.5)",
    level: "Cơ bản (3.5 – 4.5)",
    schedule: "Thứ 2 - 4 - 6",
    time: "19:30 – 21:00",
    startDate: "05/10/2026",
    duration: "36 buổi Live (3 tháng)",
    rating: 4.9,
    reviewsCount: "840",
    enrolled: 24,
    maxStudents: 30,
    instructorName: "Ms. Jennifer Vũ",
    instructorTitle: "8.5 IELTS",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    currentPrice: 1850000,
    oldPrice: 2600000,
    tag: "ielts",
    bgGrad: ["#061530", "#0a2558", "#051226"]
  },
  {
    id: 2,
    category: "ielts lang-en",
    title: "Tiếng Anh IELTS Bứt Phá (Band 5.0 – 6.0)",
    level: "Trung cấp (5.0 – 6.0)",
    schedule: "Thứ 3 - 5 - 7",
    time: "18:00 – 19:30",
    startDate: "06/10/2026",
    duration: "36 buổi Live (3 tháng)",
    rating: 4.95,
    reviewsCount: "1.1k",
    enrolled: 27,
    maxStudents: 30,
    instructorName: "Thầy David Miller",
    instructorTitle: "IELTS Examiner",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    currentPrice: 2150000,
    oldPrice: 2950000,
    tag: "ielts",
    bgGrad: ["#071b3e", "#0e3475", "#05152f"]
  },
  {
    id: 3,
    category: "ielts lang-en",
    title: "Tiếng Anh IELTS Master Chuyên Sâu (Band 6.5 – 7.5+)",
    level: "Cao cấp (6.5 – 7.5+)",
    schedule: "Thứ 2 - 4 - 6",
    time: "20:00 – 21:30",
    startDate: "12/10/2026",
    duration: "40 buổi Live (3.5 tháng)",
    rating: 5.0,
    reviewsCount: "620",
    enrolled: 21,
    maxStudents: 30,
    instructorName: "Cô Emily Watson",
    instructorTitle: "8.5 IELTS",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    currentPrice: 2650000,
    oldPrice: 3500000,
    tag: "ielts",
    bgGrad: ["#061a38", "#123c82", "#07172e"]
  },
  {
    id: 4,
    category: "toeic lang-en",
    title: "Tiếng Anh TOEIC Cấp Tốc Mục Tiêu (450 – 650 Điểm)",
    level: "Trung cấp (450 – 650)",
    schedule: "Thứ 3 - 5 - 7",
    time: "19:30 – 21:00",
    startDate: "08/10/2026",
    duration: "24 buổi Live (2 tháng)",
    rating: 4.88,
    reviewsCount: "910",
    enrolled: 28,
    maxStudents: 30,
    instructorName: "Thầy Michael Trần",
    instructorTitle: "TOEIC 990",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    currentPrice: 1450000,
    oldPrice: 2100000,
    tag: "toeic",
    bgGrad: ["#062338", "#084168", "#041b2b"]
  },
  {
    id: 5,
    category: "toeic lang-en",
    title: "Tiếng Anh TOEIC Đột Phá Điểm Số (700 – 850+)",
    level: "Nâng cao (700 – 850+)",
    schedule: "Thứ 2 - 4 - 6",
    time: "18:00 – 19:30",
    startDate: "15/10/2026",
    duration: "28 buổi Live (2.5 tháng)",
    rating: 4.92,
    reviewsCount: "540",
    enrolled: 19,
    maxStudents: 30,
    instructorName: "Cô Sarah Lê",
    instructorTitle: "TOEIC 985",
    instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    currentPrice: 1750000,
    oldPrice: 2450000,
    tag: "toeic",
    bgGrad: ["#0a283b", "#0d4b70", "#061f2e"]
  },
  {
    id: 6,
    category: "comm lang-en",
    title: "Tiếng Anh Giao Tiếp Bản Xứ Siêu Phản Xạ 1:1 Live",
    level: "Thực chiến phản xạ",
    schedule: "Thứ 2 - 4 - 6",
    time: "19:30 – 21:00",
    startDate: "05/10/2026",
    duration: "30 buổi Live (2.5 tháng)",
    rating: 4.98,
    reviewsCount: "1.4k",
    enrolled: 29,
    maxStudents: 30,
    instructorName: "Thầy James Wilson",
    instructorTitle: "Native Speaker",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    currentPrice: 1950000,
    oldPrice: 2800000,
    tag: "comm",
    bgGrad: ["#0b2347", "#174582", "#091c36"]
  },
  {
    id: 7,
    category: "n5 lang-jp",
    title: "Tiếng Nhật Nhập Môn JLPT N5 Cơ Bản Dành Cho Người Mới",
    level: "Nhập môn (JLPT N5)",
    schedule: "Thứ 2 - 4 - 6",
    time: "19:00 – 20:30",
    startDate: "05/10/2026",
    duration: "36 buổi Live (3 tháng)",
    rating: 4.96,
    reviewsCount: "980",
    enrolled: 26,
    maxStudents: 30,
    instructorName: "Sensei Kenji Tanaka",
    instructorTitle: "JLPT N1",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    currentPrice: 1650000,
    oldPrice: 2350000,
    tag: "n5",
    bgGrad: ["#2d0e2e", "#561c58", "#220924"]
  },
  {
    id: 8,
    category: "n4 lang-jp",
    title: "Tiếng Nhật Sơ Cấp JLPT N4 Toàn Diện – Ngữ Pháp & Kanji",
    level: "Sơ cấp (JLPT N4)",
    schedule: "Thứ 3 - 5 - 7",
    time: "19:30 – 21:00",
    startDate: "08/10/2026",
    duration: "40 buổi Live (3.5 tháng)",
    rating: 4.93,
    reviewsCount: "740",
    enrolled: 23,
    maxStudents: 30,
    instructorName: "Sensei Aoi Sato",
    instructorTitle: "JLPT N1",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    currentPrice: 1950000,
    oldPrice: 2750000,
    tag: "n4",
    bgGrad: ["#361038", "#631d66", "#290b2b"]
  },
  {
    id: 9,
    category: "n3 lang-jp",
    title: "Tiếng Nhật Trung Cấp JLPT N3 – Bứt Phá Dokkai & Choukai",
    level: "Trung cấp (JLPT N3)",
    schedule: "Thứ 2 - 4 - 6",
    time: "20:00 – 21:30",
    startDate: "12/10/2026",
    duration: "45 buổi Live (4 tháng)",
    rating: 4.91,
    reviewsCount: "630",
    enrolled: 21,
    maxStudents: 30,
    instructorName: "Sensei Ryota Mori",
    instructorTitle: "JLPT N1",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    currentPrice: 2350000,
    oldPrice: 3200000,
    tag: "n3",
    bgGrad: ["#26113b", "#492070", "#1d0c2d"]
  },
  {
    id: 10,
    category: "n2 lang-jp",
    title: "Tiếng Nhật Nâng Cao JLPT N2 Chuyên Sâu Biên Phiên Dịch",
    level: "Nâng cao (JLPT N2)",
    schedule: "Thứ 3 - 5 - 7",
    time: "18:00 – 19:30",
    startDate: "16/10/2026",
    duration: "48 buổi Live (4 tháng)",
    rating: 4.97,
    reviewsCount: "510",
    enrolled: 22,
    maxStudents: 30,
    instructorName: "Sensei Haruto Takahashi",
    instructorTitle: "JLPT N1",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    currentPrice: 2850000,
    oldPrice: 3900000,
    tag: "n2",
    bgGrad: ["#3b0f2e", "#6b1b53", "#2c0922"]
  },
  {
    id: 11,
    category: "comm lang-jp",
    title: "Tiếng Nhật Giao Tiếp Kaiwa Thực Tế Phỏng Vấn & Đi Làm",
    level: "Kaiwa Thực chiến",
    schedule: "Thứ 2 - 4 - 6",
    time: "18:00 – 19:30",
    startDate: "10/10/2026",
    duration: "30 buổi Live (2.5 tháng)",
    rating: 4.95,
    reviewsCount: "820",
    enrolled: 25,
    maxStudents: 30,
    instructorName: "Sensei Yuka Ishikawa",
    instructorTitle: "Bản xứ Tokyo",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    currentPrice: 1850000,
    oldPrice: 2600000,
    tag: "comm",
    bgGrad: ["#2d0e2e", "#561c58", "#220924"]
  }
];

export default function StudentCoursesPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Học viên");
  const [userEmail, setUserEmail] = useState("student@lhd.edu.vn");
  const [userAvatar, setUserAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  );

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Dropdowns
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<CourseItem | null>(null);

  useEffect(() => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const loggedInFlag = localStorage.getItem("lhd_learning_logged_in");

      if (token || loggedInFlag === "true") {
        setIsLoggedIn(true);
        const userStr =
          localStorage.getItem("user_info") ||
          localStorage.getItem("currentUser") ||
          localStorage.getItem("user");
        if (userStr) {
          const parsed = JSON.parse(userStr);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
        }
      } else {
        setIsLoggedIn(false);
        toast.info("Vui lòng đăng nhập để xem danh mục khóa học học viên!");
        router.push("/");
      }

      const cart = JSON.parse(localStorage.getItem("lhd_cart") || "[]");
      setCartCount(cart.length);

      // Check query param lang
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "en") setActiveFilter("lang-en");
      else if (lang === "jp") setActiveFilter("lang-jp");
    } catch {
      // ignore
    }
  }, [router]);

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      let matchesFilter = true;
      if (activeFilter === "all") matchesFilter = true;
      else if (activeFilter === "lang-en") matchesFilter = course.category.includes("lang-en");
      else if (activeFilter === "lang-jp") matchesFilter = course.category.includes("lang-jp");
      else matchesFilter = course.category.includes(activeFilter);

      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const handleAddToCart = (course: CourseItem) => {
    try {
      const cart = JSON.parse(localStorage.getItem("lhd_cart") || "[]");
      const exists = cart.find((item: { title: string }) => item.title === course.title);
      if (exists) {
        toast.info(`Khóa học "${course.title}" đã có trong giỏ hàng!`);
        return;
      }
      cart.push({
        id: course.id,
        title: course.title,
        price: course.currentPrice,
        schedule: course.schedule,
        time: course.time,
        startDate: course.startDate,
        instructor: course.instructorName
      });
      localStorage.setItem("lhd_cart", JSON.stringify(cart));
      setCartCount(cart.length);
      toast.success(`Đã thêm "${course.title}" vào giỏ hàng!`);
    } catch {
      toast.error("Không thể thêm vào giỏ hàng!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("lhd_learning_logged_in");
    localStorage.removeItem("user_info");
    sessionStorage.clear();
    setIsLoggedIn(false);
    toast.info("Đã đăng xuất tài khoản");
    router.push("/");
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", maxWidth: "450px" }}>
          <i className="fa-solid fa-lock" style={{ fontSize: "3rem", color: "#0b63e5", marginBottom: "1rem" }}></i>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
            Khu vực Khóa học Học viên
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
            Bạn cần đăng nhập tài khoản học viên để truy cập danh sách các lớp học Live và lộ trình ngoại ngữ.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.8rem 1.8rem",
              background: "#0b63e5",
              color: "white",
              borderRadius: "9999px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.95rem"
            }}
          >
            Quay Về Trang Chủ Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <header>
        <div className="header-left">
          <Link href="/" className="brand-logo">
            <div className="brand-icon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="brand-title">LHD – Learning</span>
          </Link>

          <ul className="nav-links">
            <li>
              <Link href="/">Trang chủ</Link>
            </li>
            <li>
              <Link href="/student/courses" className="nav-item-active">
                Khóa học
              </Link>
            </li>
            <li>
              <Link href="/student/my-courses">Khóa học của tôi</Link>
            </li>
            <li>
              <Link href="/#about">Giới thiệu</Link>
            </li>
            <li>
              <Link href="/#footer">Liên hệ</Link>
            </li>
          </ul>
        </div>

        <div className="header-right">
          <div className="nav-actions-user" style={{ display: "inline-flex" }}>
            <div className="nav-user-left-group">
              {/* Bell */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="nav-circle-btn btn-bell"
                  id="headerBellBtn"
                  onClick={() => setShowBellDropdown(!showBellDropdown)}
                  title="Thông báo hệ thống"
                >
                  <i className="fa-regular fa-bell"></i>
                </button>

                {showBellDropdown && (
                  <div
                    className="nav-dropdown"
                    id="bellDropdown"
                    style={{
                      minWidth: "340px",
                      left: 0,
                      right: "auto",
                      display: "block",
                      padding: "0.85rem"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "8px",
                        borderBottom: "1px solid #f1f5f9",
                        marginBottom: "8px"
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                        Thông báo mới
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success("Đã đọc tất cả")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0b63e5",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Đã đọc
                      </button>
                    </div>
                    <div style={{ padding: "0.65rem 0.85rem", background: "#f8fafc", borderRadius: "12px", marginBottom: "6px" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>
                        🇬🇧 Buổi học Live sắp mở
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>
                        Khóa IELTS Bứt Phá sẽ bắt đầu lúc 19:30 tối nay trên Google Meet.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link href="/student/cart" className="nav-circle-btn btn-cart" title="Giỏ hàng khóa học">
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </div>

            <div className="nav-user-divider"></div>

            {/* User group */}
            <div className="nav-user-right-group">
              <Link href="/student/profile" className="user-capsule" title="Xem thông tin cá nhân">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={userAvatar} className="user-capsule-avatar" alt="Avatar" />
                <span className="user-capsule-name">{userName}</span>
              </Link>

              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="nav-circle-btn btn-menu"
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  title="Menu học viên"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>

                {showMenuDropdown && (
                  <div
                    className="nav-dropdown student-mega-dropdown"
                    style={{ right: 0, left: "auto", display: "block" }}
                  >
                    <div className="menu-user-banner">
                      <div className="menu-user-banner-glow"></div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={userAvatar} className="menu-banner-avatar" alt="Avatar" />
                      <div className="menu-banner-meta">
                        <div className="menu-banner-name">{userName}</div>
                        <div className="menu-banner-sub">{userEmail}</div>
                      </div>
                    </div>

                    <div className="menu-group-heading">Quản lý Học tập</div>
                    <Link href="/student/home" className="student-menu-item">
                      <div className="menu-item-icon"><i className="fa-solid fa-house"></i></div>
                      <span className="menu-item-title">Trang chủ học viên</span>
                    </Link>
                    <Link href="/student/my-courses" className="student-menu-item">
                      <div className="menu-item-icon"><i className="fa-solid fa-book-bookmark"></i></div>
                      <span className="menu-item-title">Khóa học của tôi</span>
                    </Link>
                    <Link href="/student/courses" className="student-menu-item">
                      <div className="menu-item-icon"><i className="fa-solid fa-compass"></i></div>
                      <span className="menu-item-title">Khám phá khóa học</span>
                    </Link>
                    <Link href="/student/certificates" className="student-menu-item">
                      <div className="menu-item-icon"><i className="fa-solid fa-award"></i></div>
                      <span className="menu-item-title">Chứng chỉ đạt được</span>
                    </Link>

                    <div className="dropdown-divider"></div>
                    <div style={{ paddingTop: "4px" }}>
                      <button type="button" className="btn-menu-logout" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="course-hero-banner">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>

        <div className="course-hero-container">
          <div className="hero-badge-pill">
            <i className="fa-solid fa-sparkles hero-badge-sparkle"></i>
            <span>LỘ TRÌNH NGOẠI NGỮ TOÀN DIỆN</span>
          </div>
          <h1 className="course-hero-title">
            Chinh Phục <span className="gradient-text-glow">Tiếng Anh &amp; Tiếng Nhật</span><br />
            Chuẩn Quốc Tế
          </h1>
          <p className="course-hero-subtitle">
            Lớp học Live trực tuyến 2 chiều cùng chuyên gia: Tối đa 30 học viên/lớp, mở lớp khi đạt từ 20 học viên!
          </p>
        </div>
      </section>

      {/* Catalog Main */}
      <main className="catalog-section">
        <div className="catalog-container">
          {/* Tabs */}
          <div className="filter-tabs-wrapper">
            <div className="filter-tabs-scroll">
              <button
                type="button"
                className={`tab-pill ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                Tất cả (11 khóa)
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "lang-en" ? "active" : ""}`}
                onClick={() => setActiveFilter("lang-en")}
              >
                <span className="tab-flag">GB</span> Toàn Bộ Tiếng Anh
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "ielts" ? "active" : ""}`}
                onClick={() => setActiveFilter("ielts")}
              >
                IELTS (3.5 – 7.5+)
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "toeic" ? "active" : ""}`}
                onClick={() => setActiveFilter("toeic")}
              >
                TOEIC (300 – 990)
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "lang-jp" ? "active" : ""}`}
                onClick={() => setActiveFilter("lang-jp")}
              >
                <span className="tab-flag">JP</span> Toàn Bộ Tiếng Nhật
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "n5" ? "active" : ""}`}
                onClick={() => setActiveFilter("n5")}
              >
                N5 (Nhập môn)
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "n4" ? "active" : ""}`}
                onClick={() => setActiveFilter("n4")}
              >
                N4 (Sơ cấp)
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "n3" ? "active" : ""}`}
                onClick={() => setActiveFilter("n3")}
              >
                N3 (Trung cấp)
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "n2" ? "active" : ""}`}
                onClick={() => setActiveFilter("n2")}
              >
                N2 (Nâng cao)
              </button>
              <button
                type="button"
                className={`tab-pill ${activeFilter === "comm" ? "active" : ""}`}
                onClick={() => setActiveFilter("comm")}
              >
                Giao Tiếp Phản Xạ
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="search-row" style={{ marginTop: "1.5rem" }}>
            <div className="search-box-wrap">
              <i className="fa-solid fa-magnifying-glass search-box-icon"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="course-search-input"
                placeholder="Tìm khóa học, giáo trình, giảng viên..."
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Course Grid */}
          <div className="courses-grid-4col">
            {filteredCourses.map((c) => {
              const isReady = c.enrolled >= 20;
              const percent = Math.round((c.enrolled / c.maxStudents) * 100);

              return (
                <div key={c.id} className="course-item-card">
                  <div className="card-thumb-box">
                    <span className="card-level-badge">{c.level}</span>
                    <svg className="card-thumb-svg" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={`grad_${c.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={c.bgGrad[0]} />
                          <stop offset="50%" stopColor={c.bgGrad[1]} />
                          <stop offset="100%" stopColor={c.bgGrad[2]} />
                        </linearGradient>
                      </defs>
                      <rect width="320" height="180" fill={`url(#grad_${c.id})`} />
                      <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1">
                        <line x1="0" y1="45" x2="320" y2="45" />
                        <line x1="0" y1="90" x2="320" y2="90" />
                        <line x1="0" y1="135" x2="320" y2="135" />
                        <line x1="80" y1="0" x2="80" y2="180" />
                        <line x1="160" y1="0" x2="160" y2="180" />
                        <line x1="240" y1="0" x2="240" y2="180" />
                      </g>
                      <circle cx="160" cy="90" r="32" fill="rgba(255, 255, 255, 0.12)" />
                      <circle cx="160" cy="90" r="18" fill="rgba(255, 255, 255, 0.22)" />
                    </svg>
                  </div>

                  <div className="card-info-box">
                    <div className="card-meta-row">
                      <span className="card-rating-badge">
                        <i className="fa-solid fa-star"></i> {c.rating} ({c.reviewsCount})
                      </span>
                      <span className="card-live-pill">
                        <i className="fa-solid fa-video"></i> Lớp Live HD
                      </span>
                    </div>

                    <h3 className="card-title-text" title={c.title}>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedCourseDetail(c)}
                      >
                        {c.title}
                      </span>
                    </h3>

                    <div className="card-schedule-box">
                      <div className="card-schedule-item">
                        <i className="fa-solid fa-calendar-day"></i>
                        <span>Lịch học: <strong>{c.schedule}</strong></span>
                      </div>
                      <div className="card-schedule-item">
                        <i className="fa-regular fa-clock"></i>
                        <span>Giờ học: <strong>{c.time}</strong></span>
                      </div>
                    </div>

                    <div className="card-enrollment-box">
                      <div className="enrollment-header">
                        <span className="enrollment-count">
                          <i className="fa-solid fa-users"></i> <strong>{c.enrolled}/{c.maxStudents}</strong> học viên
                        </span>
                        <span className={`enrollment-status-badge ${isReady ? "status-ready" : "status-waiting"}`}>
                          <i className={`fa-solid ${isReady ? "fa-circle-check" : "fa-clock"}`}></i>{" "}
                          {isReady ? "Đủ điều kiện mở lớp" : "Đang chờ đủ 20 HV"}
                        </span>
                      </div>
                      <div className="enrollment-bar">
                        <div className="enrollment-progress" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="enrollment-note">
                        Khai giảng {c.startDate} • Mở lớp khi đạt ≥ 20/30 HV
                      </div>
                    </div>

                    <div className="card-instructor-row">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.instructorAvatar} className="instructor-avatar-mini" alt={c.instructorName} />
                      <span className="instructor-name">{c.instructorName} • {c.instructorTitle}</span>
                    </div>

                    <div className="card-bottom-row">
                      <div className="card-price-wrap">
                        <span className="card-price-current">{c.currentPrice.toLocaleString("vi-VN")}đ</span>
                        <span className="card-price-old">{c.oldPrice.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <div className="card-cta-btns">
                        <button
                          type="button"
                          className="btn-add-cart-mini"
                          title="Thêm vào giỏ hàng"
                          onClick={() => handleAddToCart(c)}
                        >
                          <i className="fa-solid fa-cart-plus"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-view-course"
                          onClick={() => setSelectedCourseDetail(c)}
                          style={{ border: "none", cursor: "pointer" }}
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal Detail */}
      {selectedCourseDetail && (
        <div
          className="modal-overlay"
          style={{ display: "flex", zIndex: 1050 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCourseDetail(null);
          }}
        >
          <div className="login-modal-box" style={{ maxWidth: "560px", padding: "1.75rem" }}>
            <div className="modal-header" style={{ marginBottom: "1rem" }}>
              <div>
                <span className="card-level-badge" style={{ position: "static", display: "inline-block", marginBottom: "6px" }}>
                  {selectedCourseDetail.level}
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                  {selectedCourseDetail.title}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedCourseDetail(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "14px", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
                <span style={{ color: "#64748b" }}>Giảng viên:</span>
                <strong>{selectedCourseDetail.instructorName} ({selectedCourseDetail.instructorTitle})</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
                <span style={{ color: "#64748b" }}>Lịch học Live:</span>
                <strong>{selectedCourseDetail.schedule} ({selectedCourseDetail.time})</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
                <span style={{ color: "#64748b" }}>Thời lượng:</span>
                <strong>{selectedCourseDetail.duration}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "#64748b" }}>Sĩ số hiện tại:</span>
                <strong style={{ color: "#0b63e5" }}>{selectedCourseDetail.enrolled}/30 học viên</strong>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0b63e5" }}>
                  {selectedCourseDetail.currentPrice.toLocaleString("vi-VN")}đ
                </span>
                <span style={{ fontSize: "0.9rem", color: "#94a3b8", textDecoration: "line-through", marginLeft: "8px" }}>
                  {selectedCourseDetail.oldPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(selectedCourseDetail);
                  setSelectedCourseDetail(null);
                }}
                style={{
                  padding: "0.85rem 1.6rem",
                  background: "#0b63e5",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                <i className="fa-solid fa-cart-plus" style={{ marginRight: "6px" }}></i>
                Thêm Vào Giỏ Hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
